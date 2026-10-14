---
name: vuk-portfolio
description: Update or rebuild Vuk Topalovic's React/Vite portfolio website to sync with his current CV content and apply its Liquid Glass (Apple-style) design with light/dark/auto theming. Use this skill whenever Vuk asks to update, rebuild, refresh, restyle, or sync his portfolio site, or mentions changes to portfolio content, theme, design, or aesthetic. Trigger this even on phrasings like "make my portfolio more dynamic", "update the about section", "add a new project to my portfolio", "change the colour scheme", or "sync the portfolio with my CV". This skill owns the portfolio's content source-of-truth and design system — do not handwrite portfolio components from scratch when this skill is available.
---

# Vuk's Portfolio Skill

A skill for keeping Vuk Topalovic's portfolio website synced with his CV content and styled in an Apple-like Liquid Glass design with light, dark and auto (daylight) themes.

## What this skill owns

- **Content source-of-truth**: `data/portfolio_content.json` — derived from Vuk's CV. All portfolio copy comes from here.
- **Design system**: `references/design_system.md` — colour palette, typography, layout, motion specs.
- **Reference implementation**: the live components in `src/components/` and tokens in `src/styles/global.css`.
- **Sync script**: `scripts/sync_portfolio.cjs` — generates a TypeScript/JavaScript data module from the JSON.

## When to use this skill

Trigger this skill whenever Vuk asks anything related to:
- Updating portfolio content (about, projects, experience, stack)
- Restyling, refreshing, or rebuilding the portfolio
- Adding theme toggle or fixing theming
- Syncing the portfolio with his CV
- Adding a new project entry
- Changing the colour palette
- Making the portfolio more "dynamic" / "professional" / "polished"

If the task is purely visual (e.g. "make the hero bigger"), still consult this skill — the design system lives here.

## Tech stack assumed

- **React + Vite** (TypeScript preferred, JavaScript supported).
- No CSS framework dependency. Plain CSS with CSS variables. Tailwind compatible but not required.
- No state management library beyond React's built-ins.
- Theme persistence via `localStorage` + `data-theme` attribute on `<html>`.

If Vuk's project uses something else (Next.js, Astro, plain CSS), adapt accordingly. The design tokens, content shape, and component logic carry over.

## File layout in this skill

```
vuk-portfolio/
├── SKILL.md                              ← this file
├── README.md                             ← for humans
├── data/
│   └── portfolio_content.json            ← single source of truth
├── references/
│   └── design_system.md                  ← palette, type, motion specs
└── scripts/
    └── sync_portfolio.cjs                 ← JSON → data module
```

## Primary workflows

### Workflow 1 — Sync content from JSON to the app

After editing `data/portfolio_content.json`, run:

```bash
node scripts/sync_portfolio.cjs --target /path/to/portfolio-repo --out src/data/portfolio.ts
```

If running from inside the portfolio repo (with the skill installed at `.skills/vuk-portfolio/`):

```bash
node .skills/vuk-portfolio/scripts/sync_portfolio.cjs
```

The script writes a TypeScript module the React app imports from. Components read from `portfolio.ts`, never directly from the JSON.

### Workflow 2 — Redesign or larger restyle

1. **Read `references/design_system.md`** in full.
2. Edit tokens in `src/styles/global.css` and components in `src/components/` (one component + CSS per section; `App.tsx` composes them).
3. Keep content in the JSON; run `sync_portfolio.cjs` after any change to it.
4. Verify with `npm run build` and `npm run lint`, and look at the page in both themes at desktop and phone widths.

### Workflow 3 — Targeted update

When Vuk asks for a specific change (e.g. "add a new project", "change the green to amber"):

- **Content change** → edit `data/portfolio_content.json`, run sync script.
- **Design token change** → edit the variable in `src/styles/global.css` (both light and dark values) and update `references/design_system.md` if its meaning changes.
- **New section** → add data to the JSON, sync, then create the component in the project. Use existing components as style reference.

## Content shape (`portfolio_content.json`)

```ts
{
  identity:    { name, handle, tagline, location, status, email, phone, links: {} },
  hero:        { title, subtitle, intro, glance: [{ label, value }] },
  about:       { summary: [] },                                  // array of paragraphs
  stack:       [{ category, items: [] }],                        // grouped chips
  experience:  [{ id, role, company, location, period, summary, highlights: [], stack: [] }],
  projects:    [{ id, name, tagline, description, facts?, steps?, image?, imageAlt?, stack: [], role, status, featured?, links: {} }],
  education:   [{ title, institution, period }],
  languages:   [{ name, level }]
}
```

### Adding a new project

```json
{
  "id": "kebab-case-id",
  "name": "Display Name",
  "tagline": "One-line hook",
  "description": "1–2 sentence summary. Include outcomes if possible.",
  "stack": ["Tech", "Stack", "List"],
  "role": "Your role on the project",
  "status": "open-source | eu-project | wip",
  "featured": true,
  "links": { "live": "https://...", "github": "https://..." }
}
```

Order is display order. Featured projects (the main six) come first, most important first; the rest appear in the compact "More projects" list.

## Design system summary

Full spec in `references/design_system.md`. Quick rules:

- **Liquid Glass.** Translucent blurred surfaces (`.glass`) over a soft fixed colour field.
- **System fonts** (SF Pro first). No web fonts.
- **One accent:** Apple system blue. Light, dark and auto themes are all first-class.
- **Accessible fallbacks:** solid surfaces under reduced transparency / increased contrast; no motion under reduced motion.

## What not to do

- Don't introduce a CSS framework. Plain CSS with tokens is the spec.
- Don't add emoji decorations or buzzwords ("passionate", "cutting-edge", "synergy"...). Plain, specific sentences.
- Don't invent facts: dates, metrics, roles and tech stacks must come from Vuk or his CV.
- Don't hand-edit the generated `portfolio.ts` data module. Edit the JSON, rerun the script.
- Don't add testimonials, client logos, skill bars or years-of-experience counters.

## Notes for Claude Code

- When Vuk asks for a "redesign" or "rebuild," default to Workflow 2. Confirm the target directory before writing files.
- Always read `references/design_system.md` before changing components.
- Generated data module location defaults to `src/data/portfolio.ts`. Confirm or override via `--out`.
- Run `sync_portfolio.cjs` after any JSON edit. The React app cannot read the JSON directly.
- Keep the portfolio strictly two-deep at most (home + project detail pages). Single-page-with-scroll is fine and preferred for now.
