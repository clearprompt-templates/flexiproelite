# Website Template — JSON + API Architecture (Next.js)

Use this document when transforming a website into a ClearPrompt JSON-driven template.
**Reference implementation: this repo (`Nova` / "Vanya" homestay).**

Your objective when you receive a new "v0-style" website:

1. Create `{sitename}.json` (all content) in the project root — the **upload source** for ClearPrompt.
2. Wire the app so **all content loads at runtime from the ClearPrompt origin API** (no bundled JSON).
3. Create/adjust **`deploy-sites.sh`** so `npm run build` output uploads to S3.
4. Make **everything actually work**: `npm run build` produces a static export in `out/`, and the deployed site fetches its content by origin.

Copy the [Agent prompt](#agent-prompt) at the bottom into Cursor when starting a fresh template, and follow the [Step-by-step transformation guide](#step-by-step-transformation-guide).

---

## Stack (important — this is Next.js, not Vite)

The reference template is a **Next.js App Router** app exported as a **static site**:

- `next.config.mjs` sets `output: 'export'` → `npm run build` writes static HTML/JS to `out/`.
- `images.unoptimized: true` (required for static export).
- `typescript.ignoreBuildErrors: true` (v0 templates often ship with loose types; the build still succeeds).
- Fonts come from `next/font/google` (`lib/fonts.ts`), **not** a CSS `@import`.
- There is **no `index.html`** and **no `App.tsx`**. The entry points are `app/layout.tsx` and `app/page.tsx`.

If the new website is a Vite/CRA SPA, either port it to this Next.js layout or adapt the file names below to the SPA equivalents (`src/main.tsx`, `index.html`). The **data-loading contract and JSON schema stay identical** regardless of framework.

---

## Goal

Build a production-ready marketing site where:

- All user-facing content comes from JSON delivered by the **ClearPrompt API**.
- Another LLM will later edit the JSON to redesign or customize the site.
- The JSON stays **clean, predictable, and safe** for LLM modification.

---

## Data loading (API only)

1. On page load, a **client component** (`SiteBootstrap`) fetches site data via
   `fetchSiteDataByOrigin()` → `getTemplatesByOriginUrl(origin)` from `lib/api-config.ts`.

2. Send headers: `accept: application/json` and `origin: <site origin>`.
   Use `fetch(..., { cache: 'no-store' })` so content is always fresh.

3. The origin is resolved by `resolveSiteOrigin()`:
   - In the browser: always `window.location.origin`.
   - No env override — the live page origin is the source of truth.

4. **Sandbox vs production API** is chosen in code (`lib/api-config.ts`) from that origin:

   | Site origin hostname                                | API base                              |
   | --------------------------------------------------- | ------------------------------------- |
   | `localhost`, `127.0.0.1`, or starts with `sandbox-` | `https://api.sandbox.clearprompt.dev` |
   | everything else                                     | `https://api.clearprompt.dev`         |

   Paths (appended to the base):
   - templates: `/api/v1/website/templates/by-origin`
   - contact form: `/api/v1/website/contact`

   Helpers: `getApiBaseUrl(origin?)`, `getTemplatesByOriginUrl(origin?)`, `getContactApiUrl(origin?)`.
   Do **not** hardcode a single API host in `site-data.ts` or gate this behind `.env`.

5. Parse `payload.data.json_object` and require that it exists; if missing, throw the API `message`.

6. **No** JSON imported/bundled in the app at build time.

7. `{sitename}.json` in the project root is the **edit/upload source only** — the app never imports it.

### No `.env` for ClearPrompt config

The template **must work with zero env files**. Sandbox/prod routing, API paths, and origin resolution live in `lib/api-config.ts` as code defaults.

- **Do not** commit `.env`, `.env.example` with API URLs, or bake `NEXT_PUBLIC_CLEARPROMPT_API_URL` / `NEXT_PUBLIC_CONTACT_API_URL` / `NEXT_PUBLIC_SITE_URL` into the template.
- Delete leftover `.env` files from the source site (Vite/CRA) during transformation if they contain hardcoded project credentials or API hosts.
- `deploy-sites.sh` may still source a local `.env` **only** for optional AWS tooling (`AWS_PROFILE`); that is unrelated to content loading and must not be required for `npm run build` / `npm run dev`.

### Flow

```
app/page.tsx
  → <SiteBootstrap />               (client component)
    → fetchSiteDataByOrigin()       (lib/site-data.ts)
      → getTemplatesByOriginUrl()   (lib/api-config.ts — sandbox or prod by origin)
        → ClearPrompt API
          → payload.data.json_object
            → setSiteData() cache + applyDocumentMeta()
              → <SiteDataProvider>    (React context)
                → <ThemeStyles>       (inject CSS variables from JSON)
                → <AnalyticsScripts>  (GA/FB when enabled)
                → <SitePage>          (render sections by order + type)
```

| Source                                                         | Used at runtime?                                |
| -------------------------------------------------------------- | ----------------------------------------------- |
| ClearPrompt API (`data.json_object`) via origin-based base URL | **Yes**                                         |
| Local `{sitename}.json` in repo                                | **No** (upload source only)                     |
| `.env`                                                         | **No** for API/content — omit from the template |

---

## Project structure

```
{sitename}.json              # content source for ClearPrompt (NOT bundled)
deploy-sites.sh              # build + upload out/ to S3
next.config.mjs             # output: 'export', images.unoptimized
app/
  layout.tsx                 # root <html>, fonts, "Loading…" metadata, @vercel/analytics
  page.tsx                   # renders <SiteBootstrap /> only
  globals.css                # tailwind v4 @theme inline, base CSS vars, keyframes
lib/
  api-config.ts              # sandbox/prod API bases + by-origin/contact URL helpers
  site-data.ts               # types + API fetch + origin resolver + section helpers
  build-theme-css.ts         # map JSON theme → CSS variables (:root { ... })
  fonts.ts                   # next/font/google font variables
  site-ui-defaults.ts        # animation/UI config (NOT in JSON)
  content-library.ts         # button/animation class helpers (NOT in JSON)
  nav-utils.ts, scroll-to.ts, utils.ts
components/
  site-bootstrap.tsx         # fetch, loading/error UI, apply document meta
  site-data-provider.tsx     # React context (data + visible sections)
  theme-styles.tsx           # <style> injection of buildThemeCss()
  analytics-scripts.tsx      # GA/FB via next/script when enabled
  site-page.tsx              # switch on section.type → section component
  navigation.tsx, footer.tsx # read navigation + siteConfig from context
  hero.tsx, story.tsx, rooms.tsx, ...  # one component per section type
  (smooth-scroll, custom-cursor, loader, floating-cta, ...) # UI-only extras
public/
  images/                    # local images referenced by JSON (relative URLs)
  icon.svg, favicon assets
```

---

## JSON schema

Keep the schema minimal and predictable so redesign LLMs do not get confused.
The reference JSON is `nova.json` in the project root — mirror its shape.

### Top-level shape

```json
{
  "meta": {},
  "siteConfig": {
    "brand": {},
    "theme": { "colors": {}, "typography": {}, "spacing": {}, "borderRadius": {} },
    "contact": {},
    "seo": {},
    "analytics": { "enabled": false }
  },
  "navigation": { "header": {}, "footer": {} },
  "pages": [{ "id": "home", "path": "/", "sections": [] }]
}
```

### `meta`

```json
"meta": {
  "version": "2.0.0",
  "lastUpdated": "2026-06-30",
  "siteId": "nova",
  "language": "en",
  "locales": ["en"],
  "title": "Page <title> + OG title",
  "description": "Meta description"
}
```

### `siteConfig.brand`

```json
"brand": {
  "name": "Vanya",
  "tagline": "...",
  "logo": { "type": "text", "width": 200, "height": 60, "textColor": "#3a5a40" }
}
```

`logo.type` can be `"text"` or `"image"` (`"image"` adds a `url`).

### `siteConfig.contact`, `seo`, `analytics`

```json
"contact": { "location": "...", "locationShort": "...", "email": "...", "phone": "...", "whatsapp": "https://wa.me/..." },
"seo": { "keywords": [], "author": "...", "siteUrl": "...", "ogImage": "/images/...", "favicon": "/icon.svg" },
"analytics": { "googleAnalyticsId": "", "facebookPixelId": "", "enabled": false }
```

### `navigation`

```json
"navigation": {
  "header": {
    "enabled": true, "position": "fixed", "style": "transparent", "logoHref": "#hero",
    "items": [ { "id": "nav-1", "label": "The Stay", "href": "#story", "type": "link" } ],
    "cta": { "enabled": true, "label": "Reserve", "href": "#enquiry", "style": "primary" }
  },
  "footer": {
    "enabled": true, "wordmark": "Vanya",
    "columns": [
      { "id": "footer-brand", "type": "brand", "heading": "...", "content": "..." },
      { "id": "footer-explore", "type": "links", "heading": "Explore", "links": [ { "label": "Rooms", "href": "#rooms" } ] },
      { "id": "footer-connect", "type": "social", "heading": "Connect", "socialMedia": [ { "platform": "instagram", "url": "#", "icon": "Instagram", "label": "Instagram" } ] }
    ],
    "newsletter": { "enabled": false },
    "bottomBar": { "copyrightText": "© {year} ... reserved.", "links": ["Privacy", "Terms"], "customText": { "madeWith": "...", "by": "..." } }
  }
}
```

`{year}` in `copyrightText` is replaced at runtime with the current year.

### `pages[].sections[]`

```json
{
  "id": "hero-section",
  "type": "hero",
  "enabled": true,
  "order": 1,
  "content": {}
}
```

- `type` — matches a case in `site-page.tsx` (e.g. `hero`, `story`, `natureAlive`, `rooms`, `divider`, `experiences`, `timeline`, `gallery`, `enquiry`).
- `enabled` — `true` / `false` to show or hide.
- `order` — ascending render order.
- `content` — all copy, images, and items for that section only.

Only the home page (`path === "/"`) is rendered by the reference `SitePage`; extra pages can be added but need routing/rendering support.

---

## Theme rules (semantic + palette tokens → CSS variables)

Theme colors live in `siteConfig.theme.colors`. `build-theme-css.ts` maps each JSON key to a CSS variable via `COLOR_VAR_MAP`, then `ThemeStyles` injects a `:root { ... }` block at runtime. Components and `globals.css` consume `var(--primary)`, `var(--foreground)`, etc. (Tailwind v4 `@theme inline` in `globals.css` aliases `--color-*` → these vars.)

### Tokens actually used by the reference

Semantic (map straight to shadcn/tailwind roles):

| JSON key                            | CSS var                                  |
| ----------------------------------- | ---------------------------------------- |
| `background`                        | `--background`                           |
| `foreground` / `text`               | `--foreground`                           |
| `card` / `cardForeground`           | `--card` / `--card-foreground`           |
| `popover` / `popoverForeground`     | `--popover` / `--popover-foreground`     |
| `primary` / `primaryForeground`     | `--primary` / `--primary-foreground`     |
| `secondary` / `secondaryForeground` | `--secondary` / `--secondary-foreground` |
| `muted` / `mutedForeground`         | `--muted` / `--muted-foreground`         |
| `accent` / `accentForeground`       | `--accent` / `--accent-foreground`       |
| `destructive`                       | `--destructive`                          |
| `border` / `input` / `ring`         | `--border` / `--input` / `--ring`        |

Bespoke palette (template-specific accents used by this design):

| JSON key                                           | CSS var                                                        |
| -------------------------------------------------- | -------------------------------------------------------------- |
| `canopy`, `moss`, `amber`, `mist`, `sand`, `night` | `--canopy`, `--moss`, `--amber`, `--mist`, `--sand`, `--night` |

> Only keys present in `COLOR_VAR_MAP` are applied. To add a new token, add the key to the JSON **and** to `COLOR_VAR_MAP` in `build-theme-css.ts` **and** (if you want a Tailwind color class) to `@theme inline` in `globals.css`.

### Theme do's and don'ts

**Do:**

- Keep colors as `oklch(...)` or hex strings in JSON.
- Derive gradients/shadows in CSS via `color-mix()` / opacity from these tokens.
- Put a matching set of fallback defaults in `globals.css :root` so the site still renders before the API responds.

**Don't:**

- Put gradients, shadows, or dozens of one-off color names in JSON.
- Hardcode brand colors inside components — use `var(--*)` / Tailwind semantic classes.

### Example

```json
"colors": {
  "primary": "oklch(0.42 0.062 152)",
  "secondary": "oklch(0.93 0.02 92)",
  "accent": "oklch(0.72 0.13 73)",
  "background": "oklch(0.97 0.012 95)",
  "text": "oklch(0.27 0.028 152)",
  "muted": "oklch(0.5 0.03 145)",
  "foreground": "oklch(0.27 0.028 152)",
  "primaryForeground": "oklch(0.97 0.012 95)",
  "secondaryForeground": "oklch(0.34 0.04 152)",
  "accentForeground": "oklch(0.27 0.04 60)",
  "border": "oklch(0.86 0.02 95)",
  "canopy": "oklch(0.42 0.062 152)",
  "moss": "oklch(0.55 0.07 150)",
  "amber": "oklch(0.72 0.13 73)",
  "night": "oklch(0.22 0.035 250)"
}
```

To restyle the site, an LLM edits only these color values.

---

## Typography rules

### In JSON

```json
"typography": {
  "fontFamily": "var(--font-geist-sans), system-ui, sans-serif",
  "headingFontFamily": "var(--font-fraunces), Georgia, serif",
  "fontSize": {
    "base": "16px",
    "heading1": "clamp(2.8rem, 9vw, 7.5rem)",
    "heading2": "clamp(2rem, 5vw, 4rem)",
    "heading3": "1.5rem"
  }
}
```

- `fontFamily` / `headingFontFamily` — font **stacks**. These reference CSS variables (`--font-geist-sans`, `--font-fraunces`) defined by `next/font/google` in `lib/fonts.ts`. If you want a _new_ font, add it to `lib/fonts.ts` first, then reference its variable here.
- `fontSize` — the reference **does** expose a small set of responsive sizes (`base`, `heading1`, `heading2`, `heading3`) as CSS variables (`--font-size-*`). Keep this list short and prefer `clamp()` so LLM edits stay layout-safe. Do **not** add per-element font sizes here — all other sizing stays in Tailwind classes.

### Also in JSON

```json
"spacing": { "sectionPadding": "7rem", "containerMaxWidth": "80rem" },
"borderRadius": { "small": "0.45rem", "medium": "0.6rem", "large": "1rem" }
```

These map to `--section-padding`, `--container-max-width`, `--radius-sm/md/lg`.

### Wiring

- `build-theme-css.ts` emits `--font-sans-stack`, `--font-heading-stack`, `--font-size-*`, `--section-padding`, etc.
- `lib/fonts.ts` loads the font files and exposes their `--font-*` variables; `app/layout.tsx` puts those variables on `<html>`.
- `globals.css` `@theme inline` maps `--font-sans` / `--font-heading` to the loaded fonts; `body` uses `font-sans`.
- `site-bootstrap.tsx` also applies `document.body.style.fontFamily` and `document.documentElement.style.fontSize` from JSON at runtime.

---

## What goes in JSON vs code

### In JSON (dynamic, LLM-editable)

- All text copy (headings, descriptions, CTAs, labels)
- Image URLs and alt text (local `/images/...` or absolute URLs)
- Navigation links, footer columns, contact info
- Section items (rooms, experiences, timeline, gallery, FAQ, etc.)
- Brand name, tagline, logo config
- Theme colors, font stacks, a small `fontSize` set, spacing, radius
- SEO meta, analytics IDs, section `enabled` flags

### Not in JSON (keep in code)

- Animation timing/easing/physics, particle counts, loader, marquee, cursor (`site-ui-defaults.ts`)
- Button/animation class helpers (`content-library.ts`)
- Tailwind class names and layout structure
- Form validation/submission logic
- ClearPrompt API bases + sandbox/prod origin routing (`lib/api-config.ts`) and `resolveSiteOrigin`

---

## Icons

The reference template does **not** use a Lucide `icon-map`. Footer/social entries carry an `icon` string in JSON, but components render text labels / inline SVG. If a new template needs mapped icon components:

- **JSON:** `"icon": "instagram"` (simple string).
- **Code:** create `lib/icon-map.ts` mapping string → component and render it there.
- Never put React components or import paths in JSON.

(`lucide-react` is available as a dependency if you choose to add an icon map.)

---

## Components

- No hardcoded copy in section components — each receives a `content` prop from JSON.
- `Navigation` and `Footer` read from `navigation` + `siteConfig` via `useSiteData()`.
- `SitePage` renders sections sorted by `order` and filtered by `enabled` (see `getHomeSections`), switching on `section.type`.
- UI-only extras (`SmoothScroll`, `CustomCursor`, `Loader`, `FloatingCta`) wrap the page and read from `site-ui-defaults.ts`.

### Adding a new section type

1. Add a `content` type + a member to the `SiteSection` union in `lib/site-data.ts`.
2. Create `components/{type}.tsx` taking `{ content }`.
3. Add a `case '{type}':` in `renderSection()` in `components/site-page.tsx`.
4. Add the section object to `pages[0].sections` in `{sitename}.json`.

---

## Bootstrap behavior

`SiteBootstrap` (client component) must:

1. Show a loading state while fetching.
2. Show a clear error if the origin is not registered (surface the API `message`).
3. On success, call `applyDocumentMeta`: set `document.title`, `<meta name="description">`, favicon, `theme-color`, `document.documentElement.lang`, and apply `fontFamily` + base `fontSize` from JSON.
4. Wrap the app in `SiteDataProvider` → `ThemeStyles` + `AnalyticsScripts` + `SitePage`.

---

## App entry (replaces `index.html`)

- `app/layout.tsx` — root `<html>`/`<body>`, font variables on `<html>`, `metadata` = `"Loading…"` placeholders (real meta applied at runtime), and `<Analytics />` in production. `metadataBase` may be a static placeholder (e.g. `http://localhost:3000`); real SEO comes from the API.
- `app/page.tsx` — renders `<SiteBootstrap />` and nothing else.
- `app/globals.css` — Tailwind v4 import, `@theme inline` token aliases, fallback `:root` colors, base layer, keyframes.

Keep real meta out of `layout.tsx` — it comes from the API at runtime.

---

## Deploy

```bash
./deploy-sites.sh
```

What the reference script does (`SITE=nova`, `BUCKET=clearprompt-templates`, `OUT_DIR=out`):

1. If **not** in GitHub Actions: optionally source `.env` (AWS profile only) and run `npm run build` (Next.js static export → `out/`).
2. Require `out/` to exist.
3. Choose AWS creds: in CI use the environment; locally use `--profile "$AWS_PROFILE"` or default `--profile clearprompt`.
4. Upload with three cache tiers:
   - `out/_next` → `s3://$BUCKET/$SITE/_next` with `max-age=31536000,immutable` (hashed assets).
   - `out/` (excluding `_next/*`, `*.html`, and `*.json`) → `max-age=86400` (images/icons).
   - every `*.html` → `no-cache`, `content-type: text/html`.

Notes:

- The script uploads **`out/`**, never `{sitename}.json`.
- Content lives in the ClearPrompt DB/API; the production (or sandbox) origin must be **registered** with the JSON content.
- To adapt for a new site: change `SITE`, confirm `BUCKET`, ensure `next.config.mjs` has `output: 'export'`, and ensure the AWS profile/creds exist.

### Registering the origin in ClearPrompt

The deployed site fetches by `origin` (`window.location.origin`). Before/after deploy, register that origin in ClearPrompt with `{sitename}.json`:

- Production hosts → content on the **production** ClearPrompt API.
- `sandbox-*` hosts and local `localhost` → content on the **sandbox** ClearPrompt API.

Local `npm run dev` talks to the sandbox API automatically (see `lib/api-config.ts`).

---

## Step-by-step transformation guide

Follow this when you receive a new (usually v0-generated) website to convert.

1. **Confirm the stack.** Ensure it's Next.js App Router. Set `next.config.mjs` → `output: 'export'`, `images.unoptimized: true`. If it's Vite, map the file roles to `main.tsx`/`index.html`.
2. **Inventory content.** Walk every component and list all hardcoded copy, images, links, contact info, repeated items, colors, and fonts.
3. **Design the section list.** Split the page into sections, each with a `type`, `order`, `enabled`, and a `content` object.
4. **Create `lib/api-config.ts`.** Code defaults for prod/sandbox API bases, `isSandboxOrigin`, `getApiBaseUrl`, `getTemplatesByOriginUrl`, `getContactApiUrl`. No `.env` for these.
5. **Create `lib/site-data.ts`.** Define `SiteData`, the `SiteSection` union, per-section `content` types, `resolveSiteOrigin` (`window.location.origin`), `fetchSiteDataByOrigin` (uses `getTemplatesByOriginUrl`), `setSiteData`/`getSiteData`, and helpers (`getHomeSections`, `getSectionByType`). Mirror the reference.
6. **Create `{sitename}.json`** in the project root with every piece of extracted content, matching the schema above. This is the upload source only.
7. **Refactor components** to read from `content` props (sections) and `useSiteData()` (nav/footer). Remove all hardcoded copy/images. Contact forms POST to `getContactApiUrl()`.
8. **Add the data layer:** `site-data-provider.tsx`, `site-bootstrap.tsx` (loading/error/meta), `theme-styles.tsx`, `analytics-scripts.tsx`, and `site-page.tsx` (type switch).
9. **Wire the theme:** move colors/typography/spacing/radius into JSON; implement `build-theme-css.ts` + `COLOR_VAR_MAP`; add fallback `:root` values and `@theme inline` aliases in `globals.css`; load fonts in `lib/fonts.ts`.
10. **Move UI behavior out of JSON** into `site-ui-defaults.ts` / `content-library.ts`.
11. **Point the entry** `app/page.tsx` at `<SiteBootstrap />`; set `app/layout.tsx` metadata to `"Loading…"` and attach font variables.
12. **Create/adjust `deploy-sites.sh`** (set `SITE`, confirm bucket, keep the three cache tiers).
13. **Verify locally:** `npm run dev` hits the sandbox API via origin; confirm load + error states. No `.env` required.
14. **Build & deploy:** `npm run build` (must produce `out/`), then `./deploy-sites.sh`. Ensure the production origin is registered in ClearPrompt with `{sitename}.json`.

---

## LLM-safety checklist

Before finishing, verify:

- [ ] No hardcoded text or images in components
- [ ] No JSON imported/bundled in `app/` or `components/`
- [ ] `{sitename}.json` exists in the project root and matches the schema
- [ ] Theme colors, font stacks, spacing, radius live in JSON
- [ ] Only tokens present in `COLOR_VAR_MAP` are used; new tokens added in all three places (JSON, `build-theme-css.ts`, `globals.css`)
- [ ] `fontSize` in JSON is a short, `clamp()`-based set only — no per-element sizes
- [ ] No gradients/shadows/Tailwind classes/component imports in JSON
- [ ] Icons are simple string names (add `icon-map.ts` only if needed)
- [ ] Sections can be toggled via `"enabled": false`
- [ ] `lib/api-config.ts` routes sandbox vs prod by origin (`localhost` / `127.0.0.1` / `sandbox-*` → sandbox)
- [ ] `resolveSiteOrigin` + `fetchSiteDataByOrigin` load by `origin` header, `cache: 'no-store'`, via `getTemplatesByOriginUrl`
- [ ] Contact posts use `getContactApiUrl()`
- [ ] `next.config.mjs` has `output: 'export'`; `npm run build` produces `out/`
- [ ] `deploy-sites.sh` uploads `out/` (not the JSON) with correct `SITE`/bucket
- [ ] Production / sandbox origins registered in ClearPrompt with the JSON content
- [ ] No committed `.env` / `.env.example` for ClearPrompt API hosts or site URL — API config is code-only

---

## Reference files (this repo)

| File                                | Purpose                                            |
| ----------------------------------- | -------------------------------------------------- |
| `nova.json` / `{sitename}.json`     | JSON shape and section content                     |
| `lib/api-config.ts`                 | Sandbox/prod API bases + URL helpers (no `.env`)   |
| `lib/site-data.ts`                  | Types, API fetch, origin resolver, section helpers |
| `lib/build-theme-css.ts`            | JSON theme → CSS variables (`COLOR_VAR_MAP`)       |
| `lib/fonts.ts`                      | `next/font/google` font variables                  |
| `lib/site-ui-defaults.ts`           | Non-JSON UI/animation defaults                     |
| `lib/content-library.ts`            | Button/animation class helpers                     |
| `components/site-bootstrap.tsx`     | Fetch, loading/error, apply document meta          |
| `components/site-data-provider.tsx` | React context                                      |
| `components/theme-styles.tsx`       | Runtime `<style>` injection                        |
| `components/analytics-scripts.tsx`  | GA/FB via `next/script`                            |
| `components/site-page.tsx`          | Section rendering by `type`/`order`/`enabled`      |
| `app/layout.tsx`, `app/page.tsx`    | Entry (replaces `index.html`/`App.tsx`)            |
| `app/globals.css`                   | Tailwind v4 tokens + fallback `:root` + keyframes  |
| `next.config.mjs`                   | Static export config                               |
| `deploy-sites.sh`                   | Build + upload `out/` to S3                        |

---

## Agent prompt

Paste this into Cursor when transforming a new template:

---

Transform this website into the ClearPrompt JSON-driven architecture described in `WEBSITE_TEMPLATE_ARCHITECTURE.md` (the Nova/Next.js reference).

**Requirements:**

1. **Next.js static export** — `next.config.mjs` with `output: 'export'` and `images.unoptimized: true`. `npm run build` must produce `out/`.

2. **API-only loading** — implement `lib/api-config.ts` + `lib/site-data.ts`:
   - `getApiBaseUrl(origin)` → sandbox (`https://api.sandbox.clearprompt.dev`) when hostname is `localhost`, `127.0.0.1`, or starts with `sandbox-`; otherwise production (`https://api.clearprompt.dev`).
   - `getTemplatesByOriginUrl` / `getContactApiUrl` append `/api/v1/website/templates/by-origin` and `/api/v1/website/contact`.
   - `fetchSiteDataByOrigin` uses those helpers with headers `accept` + `origin`, `cache: 'no-store'`.
   - `resolveSiteOrigin()` = `window.location.origin` (no env override).
   - No bundled/imported JSON, no runtime local fallback, **no `.env` for API hosts**.

3. **Create `{sitename}.json`** in the project root with ALL dynamic content (meta, siteConfig, navigation, pages/sections). Upload source only — never imported by the app.

4. **Theme in JSON** — colors, font stacks, a short `clamp()`-based `fontSize` set, spacing, radius. Implement `build-theme-css.ts` + `COLOR_VAR_MAP`; inject via `theme-styles.tsx`; add fallback `:root` + `@theme inline` in `globals.css`; load fonts in `lib/fonts.ts`.

5. **LLM-safe JSON** — no Tailwind classes, no component imports, no animation config, no gradients/shadows. Icons as string names (add `icon-map.ts` only if needed). UI behavior lives in `site-ui-defaults.ts` / `content-library.ts`.

6. **Architecture** — `app/page.tsx` renders `<SiteBootstrap />` → `SiteDataProvider` → `ThemeStyles` + `AnalyticsScripts` + `SitePage`. `SitePage` switches on `section.type`, sorted by `order`, filtered by `enabled`. Navbar/Footer read from `navigation` + `siteConfig`.

7. **Extract** all hardcoded copy, images, links, and config from components into JSON.

8. **Entry** — `app/layout.tsx` metadata = `"Loading…"`, font variables on `<html>`; real meta applied at runtime in `SiteBootstrap`.

9. **`deploy-sites.sh`** — build + upload `out/` to `s3://clearprompt-templates/{sitename}/` with the three cache tiers (`_next` immutable, assets 1 day, html no-cache). Never upload the JSON.

10. Run `npm run build` and confirm `out/` is produced. Locally, `npm run dev` should hit the sandbox API via origin.

11. **No `.env` for ClearPrompt.** Delete source-site `.env` / `.env.example` that hold API URLs, Supabase keys, or similar. Put sandbox/prod hosts in `lib/api-config.ts` only. Do not add `NEXT_PUBLIC_CLEARPROMPT_API_URL`, `NEXT_PUBLIC_CONTACT_API_URL`, or `NEXT_PUBLIC_SITE_URL` to the template.

Keep JSON minimal so another LLM can safely redesign the site by editing JSON only.

---
