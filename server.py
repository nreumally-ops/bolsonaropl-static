"""Serve the imported static site without exposing project configuration."""

import json
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.parse import unquote, urlsplit


ROOT = Path(__file__).resolve().parent
PUBLIC_FILES = {
    path.name
    for path in ROOT.iterdir()
    if path.is_file()
    and path.suffix.lower() in {".html", ".png", ".jpg", ".jpeg", ".svg", ".ico", ".mp3", ".mp4", ".webp"}
}
PUBLIC_FILES.add("branding.js")


class SiteHandler(SimpleHTTPRequestHandler):
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