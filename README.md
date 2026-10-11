# Monolyth Code — Maintenance Page

Vite + React maintenance page for monolythcode.com.

## Run locally
```bash
npm install
npm run dev        # http://localhost:5173
```

## Build for deploy
```bash
npm run build      # static output in dist/
```
Upload `dist/` to any static host (Cloudflare Pages, Nginx, etc).

## Customize
Edit the `CONFIG` block at the top of `src/App.jsx`:
- `contactEmail` — address on the contact button
- `backOnline` — ISO timestamp (e.g. `2026-10-13T09:00:00+05:30`) to show a countdown; `null` hides it

Brand accent colour lives in `src/App.css` → `--accent`.

## Cloudflare Pages
- Build command: `npm run build`
- Output directory: `dist`
- Route all paths to the page by adding `public/_redirects` containing: `/*  /index.html  200`

The page sets `<meta name="robots" content="noindex">` so search engines don't index the maintenance state — remove it when the real site goes live.
