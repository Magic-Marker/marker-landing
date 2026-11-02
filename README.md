# marker
## Hosting

The site is plain static files at the repo root. It currently ships via GitHub
Pages (`_config.yml`, `CNAME`) and can also deploy as a Cloudflare Worker with
static assets (`wrangler.jsonc`, `.assetsignore`):

- `pnpm dev` serves it locally at http://localhost:8787
- `pnpm run deploy` uploads it to `marker-landing.<account>.workers.dev`

When adding a page that shouldn't be public, exclude it in both `_config.yml`
and `.assetsignore`.

## Page loading

First paint should already be the final page, so:

- Appearance lives in CSS, never injected from JS. Shared styles and all
  `@font-face` rules are in `tailwind-input.css` (built to
  `styles.tailwind.css`).
- Fonts use `font-display: optional`, and each page `<link rel="preload">`s the
  woff2 files it shows above the fold. A new page needs the same preloads.
- Header/footer/carousel scripts load in `<head>` and mount from an inline
  `<script>` placed right after their placeholder `<div>`.
- After editing a component script or the CSS, bump its `?v=` query in the
  pages that link it.
