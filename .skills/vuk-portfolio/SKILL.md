---
name: vuk-portfolio
description: Update or rebuild Vuk Topalovic's React/Vite portfolio website to sync with his current CV content and apply a cyberpunk/terminal aesthetic with light/dark theme toggle. Use this skill whenever Vuk asks to update, rebuild, refresh, restyle, or sync his portfolio site, or mentions changes to portfolio content, theme, design, or aesthetic. Trigger this even on phrasings like "make my portfolio more dynamic", "update the about section", "add a new project to my portfolio", "change the colour scheme", or "sync the portfolio with my CV". This skill owns the portfolio's content source-of-truth and design system — do not handwrite portfolio components from scratch when this skill is available.
---

# Vuk's Portfolio Skill

A skill for keeping Vuk Topalovic's portfolio website synced with his CV content and styled in a cyberpunk/terminal aesthetic with full light/dark theme support.

## What this skill owns

- **Content source-of-truth**: `data/portfolio_content.json` — derived from Vuk's CV. All portfolio copy comes from here.
- **Design system**: `references/design_system.md` — colour palette, typography, layout, motion specs.
- **Component templates**: `templates/` — reference React/CSS files Claude Code can copy or adapt.
- **Sync script**: `scripts/sync_portfolio.js` — generates a TypeScript/JavaScript data module from the JSON.

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

If Vuk's project uses something else (Next.js, Astro, plain CSS), adapt the templates accordingly. The design tokens, content shape, and component logic carry over.

## File layout in this skill

```
vuk-portfolio/
├── SKILL.md                              ← this file
├── README.md                             ← for humans
├── data/
│   └── portfolio_content.json            ← single source of truth
├── references/
│   └── design_system.md                  ← palette, type, motion specs
├── scripts/
│   └── sync_portfolio.js                 ← JSON → data module
└── templates/
    ├── global.css                        ← design tokens + base styles
    ├── ThemeProvider.tsx                 ← theme context + toggle
    ├── Hero.tsx + Hero.css
    └── ProjectCard.tsx + ProjectCard.css
```

## Primary workflows

### Workflow 1 — Sync content from JSON to the app

After editing `data/portfolio_content.json`, run:

```bash
node scripts/sync_portfolio.js --target /path/to/portfolio-repo --out src/data/portfolio.ts
```

If running from inside the portfolio repo (with the skill installed at `.skills/vuk-portfolio/`):

```bash
node .skills/vuk-portfolio/scripts/sync_portfolio.js
```

The script writes a TypeScript module the React app imports from. Components read from `portfolio.ts`, never directly from the JSON.

### Workflow 2 — Initial portfolio rebuild

When Vuk says "rebuild my portfolio" or this is the first sync:

1. **Read `references/design_system.md`** in full. The aesthetic spec lives there.
2. **Run `sync_portfolio.js`** to generate the data module in the target project.
3. **Install/update global CSS**: copy `templates/global.css` to `src/styles/global.css` (or wherever the project keeps global styles). Import it once in `main.tsx`.
4. **Install ThemeProvider**: copy `templates/ThemeProvider.tsx` to `src/components/ThemeProvider.tsx`. Wrap `<App />` in `<ThemeProvider>`. Place `<ThemeToggle />` in the nav/header.
5. **Build/update section components** using the data from `portfolio.ts`. Sections needed:
   - Hero (template provided)
   - About — bullets from `portfolio.about.summary`
   - Stack — render `portfolio.stack` as categorised tag lists
   - Experience — render `portfolio.experience` with role, period, summary, highlights
   - Projects — render `portfolio.projects` using `ProjectCard` (template provided)
   - Education + Languages — compact footer-ish blocks
   - Contact / footer — `portfolio.identity.links`
6. **Keep it monospace, dark by default**, ASCII flourishes used sparingly.

### Workflow 3 — Targeted update

When Vuk asks for a specific change (e.g. "add a new project", "change the green to amber"):

- **Content change** → edit `data/portfolio_content.json`, run sync script.
- **Design token change** → edit the relevant variable in `templates/global.css` AND in the project's actual `global.css`. Document the change in `references/design_system.md` so the source-of-truth stays accurate.
- **New section** → add data to the JSON, sync, then create the component in the project. Use existing components as style reference.

## Content shape (`portfolio_content.json`)

```ts
{
  identity:    { name, handle, tagline, location, status, email, phone, links: {} },
  hero:        { title, subtitle, pillars: [], intro },
  about:       { summary: [] },                                  // array of paragraphs
  stack:       [{ category, items: [] }],                        // grouped chips
  experience:  [{ id, role, company, location, period, summary, highlights: [], stack: [] }],
  projects:    [{ id, name, tagline, description, stack: [], role, status, links: {} }],
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
  "status": "production | personal | wip",
  "links": { "live": "https://...", "github": "https://..." }
}
```

Newest project goes first. When the AI/LLM portfolio project ships, **place it at the top** of the `projects` array.

## Design system summary

Full spec in `references/design_system.md`. Quick rules:

- **Dark by default.** Theme toggle persists via `localStorage` and `data-theme` attr.
- **Monospace everywhere** — JetBrains Mono with fallbacks.
- **Two surfaces + one accent + two state colours.** No gradients beyond accent glow.
- **Accent (dark):** neon mint `#00ff9c`. Accent (light): deeper green `#006847`.
- **Sharp borders, 1px.** No drop shadows except optional accent glow.
- **ASCII flourishes sparingly** — `> ~/handle`, `[tag]`, `01 /`, no full terminal cosplay.
- **Motion is functional** — typed-in hero, subtle hover, intersection-observer fade-in.

## What not to do

- Don't introduce a CSS framework if the project doesn't already use one. Plain CSS with tokens is the spec.
- Don't break the monospace look with serif/sans-serif fonts.
- Don't add emoji decorations or marketing-speak buzzwords. The terminal aesthetic punishes both.
- Don't hand-edit the generated `portfolio.ts` data module. Edit the JSON, rerun the script.
- Don't make the portfolio resemble a generic dev template (3-column hero, "skills with progress bars", "let's connect" CTA buttons). It must read like a confident senior engineer's site.
- Don't add testimonials/clients/logos sections. Vuk doesn't have them and faking them damages credibility.

## Notes for Claude Code

- When Vuk asks for a "redesign" or "rebuild," default to Workflow 2. Confirm the target directory before writing files.
- Always read `references/design_system.md` before generating components — design decisions are non-negotiable and live there.
- Use the templates in `templates/` as reference, not gospel. Adapt to fit the actual project structure.
- Generated data module location defaults to `src/data/portfolio.ts`. Confirm or override via `--out`.
- Run `sync_portfolio.js` after any JSON edit. The React app cannot read the JSON directly.
- Keep the portfolio strictly two-deep at most (home + project detail pages). Single-page-with-scroll is fine and preferred for now.
