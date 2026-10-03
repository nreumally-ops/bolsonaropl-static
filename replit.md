# Running this imported website

- Click **Run** to start the `Start application` workflow.
- The command is `python3 server.py`, listening on `0.0.0.0:5000`.
- No package installation or secrets are required to serve this static build.
- The imported HTML and compiled JavaScript/CSS remain in place. `branding.js`
  updates the home-page campaign branding and its Portuguese/English hero text.
- The header logo and browser favicon use the provided Partido Liberal image.
- Page titles, search/social descriptions, and the social preview image use the
  Fora PT - Flávio Bolsonaro branding.
- The server supports direct links to client-side routes and serves only public
  site files, not hidden files or project configuration.

## Import limitations

This repository contains a compiled static website, not its editable frontend
source or API backend. The homepage can run independently, but login, signup,
profile editing, and other API-backed features are not provided by this import.
Local `/api/` requests return an explicit JSON error with HTTP 503 rather than
being mistaken for frontend routes. Some third-party services and assets are
still referenced by the original build.