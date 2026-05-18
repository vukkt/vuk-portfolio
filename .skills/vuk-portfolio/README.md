# Vuk Portfolio Skill

A Claude Code skill for keeping Vuk Topalovic's React portfolio synced with his CV content and styled in a cyberpunk/terminal aesthetic.

## What it does

- **Single source of truth.** All portfolio content lives in `data/portfolio_content.json`. Edit there.
- **Design system codified.** Cyberpunk/terminal palette with light/dark theming, locked in `references/design_system.md`.
- **Drop-in templates.** Reference React/CSS components in `templates/` for Hero, ProjectCard, ThemeProvider, global styles.
- **One-command sync.** `sync_portfolio.js` regenerates the data module the React app imports from.

## Install in your portfolio repo

```bash
# from your portfolio repo root
unzip ~/Downloads/vuk-portfolio-skill.zip -d .skills/
```

That places the skill at `.skills/vuk-portfolio/`. Claude Code will discover the `SKILL.md` and auto-trigger when you ask portfolio-related things.

## Use

### Sync content after editing JSON

```bash
node .skills/vuk-portfolio/scripts/sync_portfolio.js
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

### Initial rebuild

If your portfolio is bare or you want a from-scratch rebuild:

> "Claude, rebuild my portfolio from this skill. Use the templates in `templates/` as reference."

Claude will:
1. Read `references/design_system.md` for the aesthetic spec
2. Run `sync_portfolio.js` to generate the data module
3. Install global CSS and ThemeProvider
4. Build/update Hero, About, Stack, Experience, Projects, Contact sections
5. Hook up the theme toggle in your header

## Files

```
.skills/vuk-portfolio/
├── SKILL.md                              ← Claude reads this
├── README.md                             ← you're here
├── data/portfolio_content.json           ← edit your content here
├── references/design_system.md           ← palette, typography, motion spec
├── scripts/sync_portfolio.js             ← regenerate the data module
└── templates/                            ← reference components
    ├── global.css
    ├── ThemeProvider.tsx
    ├── Hero.tsx + Hero.css
    └── ProjectCard.tsx + ProjectCard.css
```

## When to update what

| You want to... | Do this |
|---|---|
| Change a project description | Edit `data/portfolio_content.json`, run sync |
| Add a new project | Edit JSON, put new entry at top of `projects[]`, run sync |
| Change the accent colour | Edit `--accent` in `references/design_system.md` AND in your project's `global.css` |
| Add a new section | Add data to JSON, sync, create component using templates as reference |
| Tweak a component's look | Edit the actual component file — templates are reference only, not the source-of-truth |

## Gitignore

You probably want to keep the skill in version control alongside your repo. The generated `src/data/portfolio.ts` is auto-generated — your call whether to commit it. If you do, it makes the repo buildable without running the sync. If you don't, add it to `.gitignore`:

```
src/data/portfolio.ts
```
