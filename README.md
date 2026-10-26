# marker
## Hosting

The site is plain static files at the repo root. It currently ships via GitHub
Pages (`_config.yml`, `CNAME`) and can also deploy as a Cloudflare Worker with
static assets (`wrangler.jsonc`, `.assetsignore`):

- `npm run dev` serves it locally at http://localhost:8787
- `npm run deploy` uploads it to `marker-landing.<account>.workers.dev`

When adding a page that shouldn't be public, exclude it in both `_config.yml`
and `.assetsignore`.
