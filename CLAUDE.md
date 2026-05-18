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

Single-page React + TypeScript app bundled with Vite. All portfolio content lives in one file: `src/App.tsx`. There are no routes, no state management, and no component split — everything is a single functional component with inline sections (Hero, About, Experience, Projects, Skills, Contact).

Styling is plain CSS in `src/index.css` using CSS Grid and `clamp()` for responsiveness. The design uses a dark theme: black background (`#000000`), orange accents (`rgb(255, 87, 10)`), IBM Plex Mono from Google Fonts.

TypeScript is strict (`strict: true`, `noUnusedParameters: true`). ESLint uses the modern flat config format (`eslint.config.js`).

Vercel Analytics is wired in `src/main.tsx` via the `@vercel/analytics` package.
