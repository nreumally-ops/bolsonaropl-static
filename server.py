"""Serve the imported static site without exposing project configuration."""

import hashlib
import hmac
import ipaddress
import json
import os
from datetime import datetime, timedelta
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit
from zoneinfo import ZoneInfo

import psycopg


ROOT = Path(__file__).resolve().parent
SUPPORT_COUNT_PATH = "/api/support-count"
BRAZIL_TIME = ZoneInfo("America/Sao_Paulo")
PUBLIC_FILES = {
    path.name
    for path in ROOT.iterdir()
    if path.is_file()
    and path.suffix.lower() in {".html", ".png", ".jpg", ".jpeg", ".svg", ".ico", ".mp3", ".mp4", ".webp"}
}
PUBLIC_FILES.add("branding.js")


class SiteHandler(SimpleHTTPRequestHandler):
    def send_json(self, status, payload):
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        if self.command != "HEAD":
            self.wfile.write(body)

    def get_client_ip_hash(self):
        secret = os.environ.get("SESSION_SECRET")
        if not secret:
            raise RuntimeError("SESSION_SECRET is required to protect IP-based counts.")

        forwarded_for = self.headers.get("X-Forwarded-For", "")
        candidates = [value.strip() for value in forwarded_for.split(",")]
        candidates.append(self.client_address[0])

        client_ip = None
        for candidate in candidates:
            try:
                client_ip = ipaddress.ip_address(candidate).compressed
                break
            except ValueError:
                continue
        if client_ip is None:
            raise ValueError("Could not determine the client IP address.")

        return hmac.new(
            secret.encode("utf-8"),
            client_ip.encode("utf-8"),
            hashlib.sha256,
        ).hexdigest()

    def get_support_stats(self):
        now = datetime.now(BRAZIL_TIME)
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        first_day = today_start.date() - timedelta(days=6)
        week_start = datetime.combine(first_day, datetime.min.time(), tzinfo=BRAZIL_TIME)

        with psycopg.connect() as connection:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT baseline.baseline_count,
                           baseline.resumed_at,
                           COUNT(vote.ip_hash)::BIGINT AS added_count,
                           COUNT(vote.ip_hash) FILTER (
                               WHERE vote.created_at >= %s
                           )::BIGINT AS today_count
                    FROM public.campaign_support_baseline AS baseline
                    LEFT JOIN public.campaign_support_votes AS vote ON TRUE
                    WHERE baseline.singleton IS TRUE
                    GROUP BY baseline.baseline_count, baseline.resumed_at
                    """,
                    (today_start,),
                )
                row = cursor.fetchone()
                if row is None:
                    raise RuntimeError("The support counter baseline is not configured.")

                baseline, resumed_at, added, today_count = row
                cursor.execute(
                    """
                    SELECT (created_at AT TIME ZONE 'America/Sao_Paulo')::DATE AS vote_day,
                           COUNT(*)::BIGINT AS vote_count
                    FROM public.campaign_support_votes
                    WHERE created_at >= %s
                    GROUP BY vote_day
                    ORDER BY vote_day
                    """,
                    (week_start,),
                )
                activity_rows = cursor.fetchall()

        activity_by_day = {day: int(count) for day, count in activity_rows}
        activity = [
            {
                "date": (first_day + timedelta(days=offset)).isoformat(),
                "count": activity_by_day.get(first_day + timedelta(days=offset), 0),
            }
            for offset in range(7)
        ]
        baseline = int(baseline)
        added = int(added)
        total = baseline + added

        return {
            "baseline": baseline,
            "total": total,
            "added": added,
            "today": int(today_count),
            "changePercent": round((added / baseline) * 100, 6) if baseline else 0,
            "resumedAt": resumed_at.isoformat(),
            "activity": activity,
        }

    def do_GET(self):
        if urlsplit(self.path).path == SUPPORT_COUNT_PATH:
            try:
                self.send_json(200, self.get_support_stats())
            except Exception as error:
                print("Support count read failed:", type(error).__name__, flush=True)
                self.send_json(503, {"error": "A contagem está temporariamente indisponível."})
            return
        super().do_GET()

    def do_POST(self):
        if urlsplit(self.path).path != SUPPORT_COUNT_PATH:
            self.send_json(404, {"error": "Endpoint não encontrado."})
            return

        if self.headers.get_content_type() != "application/json":
            self.send_json(415, {"error": "Envie a solicitação como JSON."})
            return
        try:
            content_length = int(self.headers.get("Content-Length", "0"))
        except ValueError:
            self.send_json(400, {"error": "Tamanho da solicitação inválido."})
            return
        if content_length > 1024:
            self.send_json(413, {"error": "Solicitação muito grande."})
            return
        try:
            payload = json.loads(self.rfile.read(content_length) or b"{}")
        except (json.JSONDecodeError, UnicodeDecodeError):
            self.send_json(400, {"error": "JSON inválido."})
            return
        if not isinstance(payload, dict):
            self.send_json(400, {"error": "Formato inválido."})
            return

        try:
            ip_hash = self.get_client_ip_hash()
            with psycopg.connect() as connection:
                with connection.cursor() as cursor:
                    cursor.execute(
                        """
                        INSERT INTO public.campaign_support_votes (ip_hash)
                        VALUES (%s)
                        ON CONFLICT (ip_hash) DO NOTHING
                        RETURNING ip_hash
                        """,
                        (ip_hash,),
                    )
                    recorded = cursor.fetchone() is not None
            stats = self.get_support_stats()
            stats["recorded"] = recorded
            self.send_json(200, stats)
        except Exception as error:
            print("Support count write failed:", type(error).__name__, flush=True)
            self.send_json(503, {"error": "Não foi possível registrar o apoio agora."})

    def send_head(self):
        path = unquote(urlsplit(self.path).path)
        parts = Path(path).parts
        if any(part.startswith(".") or part == ".." for part in parts):
            self.send_error(404)
            return None
        if path == "/api" or path.startswith("/api/"):
            body = json.dumps({"error": "The imported project does not include an API backend."}).encode()
            self.send_response(503)
            self.send_header("Content-Type", "application/json")
            self.send_header("Content-Length", str(len(body)))
            self.end_headers()
            if self.command != "HEAD":
                self.wfile.write(body)
            return None
        target = (ROOT / path.lstrip("/")).resolve()
        if not target.is_relative_to(ROOT):
            self.send_error(404)
            return None
        is_public = (
            path.lstrip("/") in PUBLIC_FILES
            or (path.startswith("/assets/") and target.is_file())
        )
        if not is_public:
            if path == "/" or not Path(path).suffix:
                self.path = "/index.html"
            else:
                self.send_error(404)
                return None
        return super().send_head()

    def end_headers(self):
        self.send_header("Cache-Control", "no-cache")
        super().end_headers()


if __name__ == "__main__":
    server = ThreadingHTTPServer(
        ("0.0.0.0", 5000), partial(SiteHandler, directory=str(ROOT))
    )
    print("Static website listening on 0.0.0.0:5000", flush=True)
    server.serve_forever()