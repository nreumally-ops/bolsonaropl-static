# Running this imported website

- Click **Run** to start the `Start application` workflow.
- The command is `python3 server.py`, listening on `0.0.0.0:5000`.
- The homepage is a compiled static build. The `/api/support-count` endpoint is
  served by `server.py` and stores one support per IP hash in PostgreSQL.
- Set `DATABASE_URL` and `SESSION_SECRET` in Replit Secrets for the counter to
  record supports. The counter tables are created idempotently on first use.
- The imported HTML and compiled JavaScript/CSS remain in place. `branding.js`
  updates the home-page campaign branding and its Portuguese/English hero text.
- The header logo and browser favicon use the provided Partido Liberal image.
- Page titles, search/social descriptions, and the social preview image use the
  Fora PT - Flávio Bolsonaro branding.
- The server supports direct links to client-side routes and serves only public
  site files, not hidden files or project configuration.

## Import limitations

This repository contains a compiled static website, not its editable frontend
source. Login, signup, profile editing, and other API-backed features are not
provided by this import. The support counter is the only API endpoint included.
Some third-party services and assets are still referenced by the original build.