# FlexiProElite

ClearPrompt JSON-driven website template (Next.js static export).

## Develop

```bash
npm install
npm run dev
```

Content loads at runtime from the ClearPrompt API by `window.location.origin` (sandbox API on localhost). Register this origin in ClearPrompt with `flexiproelite.json`.

## Build & deploy

```bash
npm run build   # writes static site to out/
./deploy-sites.sh
```

`flexiproelite.json` is the upload source for ClearPrompt only — it is never bundled into the app.
