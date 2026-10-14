# Vuk Portfolio Skill

A Claude Code skill for keeping Vuk Topalovic's React portfolio synced with his CV content and styled in an Apple-like Liquid Glass design.

## What it does

- **Single source of truth.** All portfolio content lives in `data/portfolio_content.json`. Edit there.
- **Design system codified.** Liquid Glass tokens and rules in `references/design_system.md`.
- **One-command sync.** `sync_portfolio.cjs` regenerates the data module the React app imports from.

## Install in your portfolio repo

```bash
# from your portfolio repo root
unzip ~/Downloads/vuk-portfolio-skill.zip -d .skills/
```

That places the skill at `.skills/vuk-portfolio/`. Claude Code will discover the `SKILL.md` and auto-trigger when you ask portfolio-related things.

## Use

### Sync content after editing JSON

```bash
node .skills/vuk-portfolio/scripts/sync_portfolio.cjs
```

Writes `src/data/portfolio.ts` by default. Adjust path with `--out`.

### Through Claude Code

Just talk normally:

- "Update my portfolio"
- "Sync my portfolio with my CV"
- "Add this project to my portfolio: [details]"
- "Rebuild my portfolio with the new theme"
- "Add a light/dark theme toggle"

Claude reads the SKILL.md, knows the design system, edits the JSON, runs the sync, updates components.

## Files

```
.skills/vuk-portfolio/
├── SKILL.md                              ← Claude reads this
├── README.md                             ← you're here
├── data/portfolio_content.json           ← edit your content here
├── references/design_system.md           ← palette, typography, motion spec
└── scripts/sync_portfolio.cjs             ← regenerate the data module
```

## When to update what

| You want to... | Do this |
|---|---|
| Change a project description | Edit `data/portfolio_content.json`, run sync |
| Add a new project | Edit JSON, place it in `projects[]` in display order (`featured: true` for a main card), run sync |
| Change the accent colour | Edit `--accent` (light and dark) in `src/styles/global.css` |
| Add a new section | Add data to JSON, sync, create a component in `src/components/` following the existing ones |
| Tweak a component's look | Edit the component's `.css` file next to it |

## Gitignore

You probably want to keep the skill in version control alongside your repo. The generated `src/data/portfolio.ts` is auto-generated — your call whether to commit it. If you do, it makes the repo buildable without running the sync. If you don't, add it to `.gitignore`:

```
src/data/portfolio.ts
```
