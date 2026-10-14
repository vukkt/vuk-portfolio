# Design System — Liquid Glass

The portfolio's visual language, modelled on Apple's Liquid Glass (and on Vuk's own iglass
project). The tokens live in `src/styles/global.css`; this file explains how to use them.

## Principles

- **Calm and professional.** Plain, specific copy. No buzzwords, no emoji, no marketing CTAs.
- **Glass over colour.** A soft, fixed colour field (`.backdrop`) sits behind translucent,
  blurred surfaces (`.glass`). The field is what makes the glass read as glass, so keep it.
- **Light and dark are equals.** Every token has both values. Auto mode follows the
  visitor's local daylight (`daylight.ts`); the toggle is a three-way segmented control.
- **System fonts.** `-apple-system` / SF Pro first, with Segoe UI and Roboto as fallbacks. No web
  fonts, so there is no font request and no layout shift.
- **One accent.** Apple system blue (`--accent`). Green only for the availability dot.
- **Motion is quiet.** A short rise and fade on scroll (`useReveal`), a slight lift on card hover.
  Both turn off under `prefers-reduced-motion`.

## Tokens (see global.css for values)

| Token | Use |
|---|---|
| `--bg` | Page background under the colour field |
| `--text`, `--text-secondary`, `--text-tertiary` | Primary copy, body/supporting copy, labels and meta |
| `--accent` / `--accent-contrast` | Links, primary button, eyebrows / text on accent |
| `--field-1..4` | The four blobs of the colour field |
| `--glass`, `--glass-strong`, `--glass-solid` | Surface fill: default, nav/hover, opaque fallback |
| `--glass-edge`, `--glass-shine`, `--glass-line` | Rim, top highlight, inner dividers |
| `--glass-shadow`, `--glass-blur` | Elevation and the backdrop filter |
| `--fill`, `--fill-hover` | Chips, segmented control track, neutral pills |
| `--radius-lg / md / sm` | 28px cards, 20px compact cards and lists, 12px inner elements |

## Building blocks

- `.glass`: any card or panel. It falls back to a solid fill under `prefers-reduced-transparency`,
  `prefers-contrast: more`, and in browsers without `backdrop-filter`.
- `.section`, `.section-header`, `.section-eyebrow`, `.section-title`, `.section-lede`: every
  section opens with a small blue eyebrow, a short title ending in a full stop, and an optional lede.
- `.chip` / `.chip-list`: tech tags. Plain words, no brackets.
- `.button--primary` (filled accent) and `.button--glass`: at most two buttons in a row.
- `.text-link`: inline accent links, `↗` for external.

## Layout

- Max width 1120px, gutter `clamp(1rem, 4vw, 2rem)`. Works down to 320px with no horizontal scroll.
- Hero: name and intro on the left, an "at a glance" glass card on the right (stacks under 960px).
- Work: 12-column grid, featured cards span 6 (one column under 680px). The first two featured
  projects are the large ones. Non-featured projects go in the compact "More projects" list.
- Experience: one glass card per role; roles without highlights render as compact rows.

## Content rules

- Facts must be checkable: versions, test counts, pilot numbers. Never invent metrics.
- Projects: `featured: true` for the main six, ordered by importance. `facts`, `steps`, `image` are
  optional extras for the large cards. Images go in `public/projects/` as WebP, about 960px wide.
- Don't add testimonials, client logos, skill bars or years-of-experience counters.
