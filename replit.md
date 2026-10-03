# Running this imported website

- Click **Run** to start the `Start application` workflow.
- The command is `python3 server.py`, listening on `0.0.0.0:5000`.
- No package installation or secrets are required to serve this static build.
- The original HTML, compiled JavaScript/CSS, and media remain unchanged.
- The server supports direct links to client-side routes and serves only public
  site files, not hidden files or project configuration.

## Import limitations

This repository contains a compiled static website, not its editable frontend
source or API backend. The homepage can run independently, but login, signup,
profile editing, and other API-backed features are not provided by this import.
Local `/api/` requests return an explicit JSON error with HTTP 503 rather than
being mistaken for frontend routes. Some third-party services and assets are
still referenced by the original build.