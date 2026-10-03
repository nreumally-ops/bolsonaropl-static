# Bolsonaropl static site

Production-ready static build for the Bolsonaropl Vercel project.

- `index.html` serves the restored Ikiss-style bio homepage.
- `assets/` contains the compiled JavaScript and CSS bundles.
- `bolsonaropl.mp4` is the homepage background video.
- The homepage uses one looping video decoder and shows the complete frame on mobile.
- The video attempts audible autoplay at 35% volume. If the browser blocks it, the video starts muted and the on-screen control can enable or disable its original audio.
