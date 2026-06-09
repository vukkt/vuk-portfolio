# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server with HMR
npm run build     # Type-check (tsc -b) then bundle (vite build)
npm run lint      # Run ESLint over the entire project
npm run preview   # Preview the production build locally
```

No test suite is configured.

## Architecture

Single-page React + TypeScript app bundled with Vite. No routes, no state management library.

- **Content**: All portfolio content (identity, hero, experience, projects, education) is defined in `.skills/vuk-portfolio/data/portfolio_content.json` — the single source of truth. `src/data/portfolio.ts` is AUTO-GENERATED from it; never edit it by hand. To change what the site says: edit the JSON, then run `node .skills/vuk-portfolio/scripts/sync_portfolio.cjs` to regenerate the typed module.
- **Components**: One component per section in `src/components/` (Nav, Hero, About, Stack, Experience, Projects, EducationLanguages, Contact), each with a co-located `.css` file. `App.tsx` just composes them in order. Sections use an IntersectionObserver fade-in pattern.
- **Theming**: `ThemeProvider` (`src/components/ThemeProvider.tsx`) manages a dark/light toggle, persisted to localStorage and applied via a `data-theme` attribute on `<html>`. Styles read CSS custom properties (design tokens) defined in `src/styles/global.css` — dark terminal aesthetic, green accent, JetBrains Mono.
- **Analytics**: Vercel Analytics is rendered in `App.tsx` via `@vercel/analytics`.

TypeScript is strict (`strict: true`, `noUnusedParameters: true`). ESLint uses the modern flat config format (`eslint.config.js`).

## Deployment

Pushing to `main` deploys to both targets automatically:

- **GitHub Pages** via `.github/workflows/deploy.yml`, served at `/vuk-portfolio/`.
- **Vercel** via its GitHub integration, served at the domain root.

The Vite `base` path is set conditionally in `vite.config.ts` (`/` when `VERCEL` is set, `/vuk-portfolio/` otherwise).
