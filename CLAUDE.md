# CLAUDE.md

Guidance for AI agents (and humans) working in this repo. Read this first.
For the product overview and feature list, see [README.md](./README.md). For
machine-specific environment notes (WSL/mise), see `CLAUDE.local.md` (gitignored).

## What this is

**Decompress** is a static React SPA: a cervical-spine & RSI physiotherapy exercise
library. It originated as a single-file Claude.ai artifact (`decompress-rehab-app.jsx`)
and is being restructured into a conventional Vite + React project.

It is **client-only**: no backend, no API calls, no client-side router. All state lives in
React; user data is persisted to the browser via the storage adapter in `src/lib/storage.js`.

## Golden rules

1. **Before considering a change done, run the linter and the tests, then build.**
   ```bash
   npm run lint && npm test && npm run build
   ```
   Don't claim something works without at least `lint` + `test` green. If you changed
   anything user-visible, also run the app (`npm run dev`) and verify it manually.
2. **Keep it behavior-preserving when restructuring.** This codebase is being split from
   one file into modules — when moving code, move it verbatim and verify identical
   behavior before improving it. Refactor and feature work are separate steps.
3. **Make the smallest change that fully solves the task.** Match the surrounding style.

## Commands

| Task            | Command                              |
| --------------- | ------------------------------------ |
| Install Node    | `mise install`                       |
| Install deps    | `npm install`                        |
| Dev server      | `npm run dev`                        |
| Lint            | `npm run lint`                       |
| Test (once)     | `npm test`                           |
| Test (watch)    | `npm run test:watch`                 |
| Production build| `npm run build`                      |
| Preview build   | `npm run preview`                    |

> Node is provided by **mise** (version pinned in `mise.toml`). Run `mise install` once
> after cloning. Don't assume a system Node — use the mise-managed one.

## Architecture

- **Entry:** `src/main.jsx` mounts `<App/>` into `index.html`.
- **`src/App.jsx`** owns top-level state (exercises, routine, active tab, detail level,
  filter, search, theme) and the layout shell, and renders the tab views.
- **Data is data, not code:**
  - `src/data/exercises.json` — the exercise content (the "workout JSON"). This is the
    seed/default set; the user can override it at runtime via the Edit-data tab.
  - `src/data/categories.js` — the 4 categories (`neck`, `back`, `nerve`, `rsi`): labels,
    colors (light + dark), and blurbs.
  - `src/theme/themes.js` — light/dark **theme tokens**. Every color in the UI comes from
    here; the active token object is conventionally passed around as `T`.
- **Figures:** each exercise references a drawing by its `fig` key. The drawings live in
  `src/components/figures.jsx` and are rendered by `src/components/Figure.jsx`. To add an
  exercise that needs a new drawing, add a new entry to the figures map; otherwise reuse an
  existing `fig` key.
- **Persistence:** `src/lib/storage.js` exposes `loadStored` / `saveStored` / `deleteStored`
  (async) plus the storage keys. It wraps `localStorage` and **fails gracefully** (falls
  back to in-memory) so the app still runs where storage is unavailable.

## Conventions & gotchas

- **Styling is hybrid:** Tailwind utility classes handle layout/spacing; **colors and
  many sizes come from inline `style` objects driven by theme tokens (`T`)**, not Tailwind
  color classes. Don't hardcode hex colors in components — pull them from `T` / the
  category helpers so dark mode keeps working.
- **No router.** Tabs are just state (`tab === "library" | "routine" | "data"`). Keep it
  that way unless deliberately adding routing — it keeps GitHub Pages deployment trivial.
- **Origin of `window.storage`:** the original artifact used Claude.ai's `window.storage`
  API. In this app that's replaced by a `localStorage`-backed adapter — keep new
  persistence going through `src/lib/storage.js`, not direct `localStorage` calls.
- **Exercise invariants:** every exercise needs at least `id`, `name`, and `category`. The
  Edit-data tab validates this; keep that validation in sync if the schema changes.

## Testing

- Vitest + React Testing Library (jsdom environment). Tests live alongside code or under
  `src/**/*.test.jsx`.
- Good things to cover: JSON validation in the Edit-data flow, routine add/remove/reorder
  logic, theme toggle, and a smoke render of `<App/>`.

## Deployment

- Target: **GitHub Pages**, built by a GitHub Actions workflow (`.github/workflows/`).
- Because it's hosted at a project-site sub-path, Vite's `base` must match the repo path
  (e.g. `/decompress/`). If the repo is renamed or a custom domain is added, update `base`
  in `vite.config.js`.
- The app is a single static page with no client router, so no `404.html` fallback hack is
  needed.

## Project status

Migration in progress: the app currently exists as the single file
`decompress-rehab-app.jsx`. The build tooling, module split, and persistence swap described
above are the active plan. If a command here doesn't exist yet, it's because that part of
the scaffolding is still pending — check `git status` / open files before assuming.
