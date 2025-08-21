
# Matter.js + TypeScript demo (GitHub Pages-ready)

A tiny physics app using [Matter.js](https://brm.io/matter-js/) written in TypeScript. It bundles with esbuild and outputs to `/docs`, so you can enable **GitHub Pages** on the repo (branch: `main`, folder: `/docs`) and it's live.

## Features
- TypeScript source in `src/`
- Bundled to a single `docs/bundle.js` (no CDNs)
- Responsive canvas, mouse drag, and a shower of balls
- One command to build

## Quickstart
```bash
# 1) Install deps
npm install

# 2) Build the app to docs/
npm run build

# 3) Open docs/index.html in your browser (or run a dev server)
npm run dev
# -> visit the printed local server URL
```

## Deploy to GitHub Pages (docs/)
1. Push this repo to GitHub.
2. In your repository, go to **Settings → Pages**.
3. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/docs**
4. Click **Save**. Your site will publish at:
   - `https://<your-username>.github.io/<this-repo>/`

> Tip: Every time you change code, run `npm run build` and push the updated `docs/` to `main`.

## Custom domain or username.github.io
- If you’re using a **project site** (a normal repo), the URL is `https://<username>.github.io/<repo>/` and this setup works as-is.
- If you create a repo named **<username>.github.io** (a user site), you can still keep `/docs` as the Pages source. The site will live at `https://<username>.github.io/`.

## Files
- `src/main.ts` — your TypeScript app
- `docs/index.html` — entry HTML that loads `bundle.js`
- `docs/style.css` — minimal styles
- `package.json` — scripts & deps
- `tsconfig.json` — TS config

Happy tinkering!
```

