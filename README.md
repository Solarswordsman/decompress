# Decompress

> A cervical-spine & RSI physical-therapy exercise library — browse, build a routine, and view each exercise at the level of detail you want.

**Decompress** is a small single-page web app for organizing rehab/physio exercises
(for neck/cervical issues, upper-back posture, nerve glides, and forearm/RSI work).
You can browse a library of exercises, filter and search, dial the detail level up or
down, assemble an ordered personal routine, and edit the underlying exercise data as
JSON right in the app.

It started life as a single-file artifact generated in a Claude.ai chat (with the Fable
model) and is being grown into a proper, deployable React app.

> ⚠️ **Not medical advice.** This is an educational reference. Review these exercises
> with your physical therapist — especially the nerve glides and extension work. Stop any
> exercise that sends symptoms _further down the arm_ (peripheralization); symptoms moving
> _toward the neck_ (centralization) is the good direction.

---

## Features

- **Library** — 20 seeded exercises across 4 categories (Neck & cervical, Upper back &
  scapula, Nerve glides, Forearm & RSI), with per-category filtering and free-text search.
- **Detail levels** — view every card as **Full**, **Standard**, **Quick**, or just
  **Names**, and expand any individual card inline.
- **My routine** — add exercises to an ordered routine, reorder them, and clear it.
- **Edit data** — the entire exercise set is editable as JSON in-app, with validation,
  revert, and reset-to-defaults.
- **Light / dark theme** — every color comes from a central theme-token table.
- **Local persistence** — your custom data, routine, and theme are saved in the browser.
- **Schematic figures** — each exercise has a hand-drawn-style inline SVG illustration.

## Tech stack

| Concern        | Choice                                              |
| -------------- | --------------------------------------------------- |
| UI             | React 19 (function components + hooks)              |
| Build / dev    | Vite                                                |
| Styling        | Tailwind CSS (layout) + inline theme tokens (color) |
| Icons          | `lucide-react`                                      |
| Language       | JavaScript / JSX                                    |
| Lint           | ESLint                                              |
| Tests          | Vitest + React Testing Library                      |
| Runtime mgmt   | [mise](https://mise.jdx.dev/) (pins Node)           |
| Hosting        | Netlify (static; Vercel-compatible)                 |

> Setup note: this repo targets a WSL + mise environment. Machine-specific details live in
> `CLAUDE.local.md` (gitignored). See [CLAUDE.md](./CLAUDE.md) for contributor/agent guidance.

## Getting started

Prerequisites: **[mise](https://mise.jdx.dev/)** installed. It will provide the pinned
Node version for you.

```bash
mise install        # install the Node version pinned in mise.toml
npm install         # install dependencies
npm run dev         # start the Vite dev server (prints a local URL)
```

Other commands:

```bash
npm run lint        # ESLint
npm test            # run the test suite once (Vitest)
npm run build       # production build into dist/
npm run preview     # serve the production build locally
```

## Project structure

```
src/
  main.jsx              # React entry point (mounts <App/>)
  App.jsx               # top-level state + layout shell
  index.css             # Tailwind entry + base styles
  data/
    exercises.json      # the exercise content (the "workout JSON")
    categories.js       # category definitions (CATS) + helpers
  theme/
    themes.js           # light/dark theme tokens
  lib/
    storage.js          # persistence adapter (localStorage) + storage keys
  components/
    Figure.jsx          # SVG figure renderer
    figures.jsx         # the schematic-drawing definitions, keyed by `fig`
    CatChip.jsx
    AddButton.jsx
    ExerciseCard.jsx    # renders a card at any detail level
    Header.jsx
    Tabs.jsx
    DetailLevelControl.jsx
    tabs/
      LibraryTab.jsx
      RoutineTab.jsx
      EditDataTab.jsx
```

## Editing exercise data

Each exercise is a JSON object:

```jsonc
{
  "id": "chin-tuck-seated",          // unique id
  "name": "Seated chin tucks",
  "category": "neck",                 // neck | back | nerve | rsi
  "fig": "chinTuck",                  // key into the built-in figure set
  "targets": ["Deep neck flexors"],
  "oneLiner": "Glide your chin straight back, hold 5s.",
  "brief": "Sit tall, glide the chin straight back…",
  "steps": ["…", "…"],
  "purpose": "Why this exercise helps…",
  "dose": "10 reps × 5s hold, 2–3 sessions/day.",
  "cautions": "Stop if it increases arm tingling."
}
```

You can edit this in the app's **Edit data** tab (changes persist in your browser), or edit
`src/data/exercises.json` directly to change the shipped defaults. The `fig` field selects a
built-in schematic drawing — reuse any existing key for new exercises.

## Deployment

The app is a fully static SPA (no server, no client-side router) and deploys to **Netlify**
(Vercel works identically) via git-connected continuous deployment. Build settings live in
[`netlify.toml`](./netlify.toml); the publish directory is `dist/` and Vite's `base` stays
`/` since it's served from the site root. See [CLAUDE.md](./CLAUDE.md#deployment) for details.

## License

Personal project — no license specified yet.
