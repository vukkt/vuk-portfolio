# Design System — Cyberpunk / Terminal

The portfolio's visual language. Claude Code references this when generating or updating components.

## Aesthetic principles

- **Dark by default, light available.** Theme toggle is required.
- **Monospace everywhere.** No exceptions for headings, body, navigation. The whole site reads like a terminal that took a design class.
- **Neon accents, sparingly.** One primary accent does most of the work. Two secondary accents reserved for state (success, warning).
- **Sharp edges. No soft shadows, no glassmorphism.** Borders are thin and contrast-pulled. Optional 1px glow on accent elements.
- **Grid lines and ASCII flourishes welcome.** Section dividers can be `═══════` or `── // section ──`. Use sparingly.
- **Motion is functional, not decorative.** Typed-in entrance animations on hero. Subtle hover state shifts. No parallax. No floating shapes.

## Color tokens

Use CSS variables. Theme switching swaps the values at `:root` / `[data-theme="light"]`.

### Dark theme (default)

```css
:root {
  /* surfaces */
  --bg: #0a0a0a;
  --bg-elevated: #111111;
  --bg-overlay: #161616;
  --border: #2a2a2a;
  --border-strong: #3a3a3a;

  /* text */
  --text-primary: #e6e6e6;
  --text-secondary: #a0a0a0;
  --text-muted: #666666;

  /* accents */
  --accent: #00ff9c;          /* primary — neon mint/green */
  --accent-dim: #00b86f;
  --accent-glow: rgba(0, 255, 156, 0.15);
  --warn: #ff6b35;            /* secondary — burnt orange */
  --info: #6ea8fe;            /* tertiary — cool blue */

  /* state */
  --success: #00ff9c;
  --error: #ff4d6d;
}
```

### Light theme

```css
[data-theme="light"] {
  --bg: #fafafa;
  --bg-elevated: #ffffff;
  --bg-overlay: #f0f0f0;
  --border: #d4d4d4;
  --border-strong: #a0a0a0;

  --text-primary: #0a0a0a;
  --text-secondary: #4a4a4a;
  --text-muted: #888888;

  --accent: #006847;          /* deeper green that reads on light */
  --accent-dim: #00a86b;
  --accent-glow: rgba(0, 104, 71, 0.1);
  --warn: #c2410c;
  --info: #1e40af;

  --success: #006847;
  --error: #c91e3a;
}
```

**Notes on palette choice:**

- Mint/green chosen over the cliched cyberpunk pink/cyan — feels more terminal, less Blade Runner cosplay. Reads professional.
- Light theme uses a deeper green so accents stay legible against white. Same hue family, adjusted lightness.
- Avoid pure black (`#000000`) and pure white (`#ffffff`) for surfaces — they're harsh in monitors. Use `#0a0a0a` and `#fafafa`.

## Typography

Two fonts only:

- **Mono:** `JetBrains Mono`, fallback to `'IBM Plex Mono', 'Fira Code', ui-monospace, monospace`. Used for everything.
- **Optional display alternative:** `'Geist Mono'` if you want a slightly cleaner look.

Load from a single self-hosted source or Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
```

### Scale

```css
--font-size-xs: 0.75rem;   /* 12px — labels, badges */
--font-size-sm: 0.875rem;  /* 14px — meta info */
--font-size-base: 1rem;    /* 16px — body */
--font-size-lg: 1.125rem;  /* 18px — subheads */
--font-size-xl: 1.5rem;    /* 24px — section heads */
--font-size-2xl: 2rem;     /* 32px — page heads */
--font-size-3xl: 3rem;     /* 48px — hero name */
--font-size-4xl: 4.5rem;   /* 72px — hero name on desktop */

--line-height-tight: 1.2;
--line-height-base: 1.55;
--line-height-relaxed: 1.7;

--letter-spacing-tight: -0.01em;
--letter-spacing-wide: 0.05em;       /* uppercase labels */
--letter-spacing-wider: 0.12em;      /* small caps everywhere */
```

### Treatments

- Uppercase + wide letter-spacing for section labels, nav, badges.
- Mixed case for body, summaries, project descriptions.
- Bold (600) for emphasis, never italic (italics break the mono terminal feel).

## Layout

- **Max content width:** `1100px`. Wider feels generic.
- **Horizontal padding:** `clamp(1.25rem, 4vw, 3rem)`.
- **Section spacing:** `clamp(4rem, 10vw, 8rem)` between sections vertically.
- **Grid for projects:** 1 column mobile, 2 columns from `768px`, optional 3 columns from `1100px` for compact view.

## Component conventions

### Borders & rules

- Use 1px solid `var(--border)` for cards.
- Section dividers: 1px horizontal line in `var(--border)` OR an ASCII rule (`═══════`).
- On accent elements, use 1px `var(--accent)` with a soft box-shadow glow:
  ```css
  border: 1px solid var(--accent);
  box-shadow: 0 0 0 1px var(--accent-glow), 0 0 20px var(--accent-glow);
  ```

### Hover states

- Subtle. Border color shift to `var(--border-strong)` or `var(--accent)`.
- Text color shift on links.
- No transform translations bigger than 1–2px.
- Transition: `transition: all 0.2s ease;`

### Buttons & links

- Primary CTA: filled with `var(--accent)`, text in `var(--bg)`, 1px border, slight glow on hover.
- Secondary: transparent background, 1px `var(--border-strong)`, hover swaps border to accent.
- Links inline in text: underlined with `var(--accent)`, no color change unless visited.

### Code-like flourishes

- Prompt-style prefixes on labels: `> about`, `$ projects`, `~/experience`.
- Cursor blink at the end of the hero tagline (typed-in effect).
- Square brackets around tags: `[react]`, `[typescript]`.
- Numbered sections in monospace: `01 / about`, `02 / experience`.

Use these *sparingly*. One or two per page max. They're seasoning, not the meal.

## Motion

- Hero name: typed-in over 600ms on initial load.
- Section entries: fade in + 8px translateY, staggered by 60ms, intersection-observer triggered.
- Theme toggle: instant — no animated color transition (causes flash on heavy pages).
- Tag chips: scale 1.02 on hover, 100ms ease.

Reduce motion respected:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

## What NOT to do

- No emojis in section headings.
- No gradient backgrounds. Solid surfaces only. Accent glows are the only "gradient-adjacent" effect.
- No multi-color rainbows or pastel palettes — keep it 2 surfaces + 1 accent + 2 state colors.
- No sans-serif anywhere. Even in form inputs, mono.
- No fake terminal "command output" walls of green text. Aesthetic, not a costume.
