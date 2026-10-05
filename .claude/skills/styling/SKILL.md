---
name: styling
description: Use when writing or editing CSS in src/v4/ — class naming, lengths, colours, variants, inline styles. Type properties belong to the typography skill, not here.
---

# Styling

One CSS module per component, named after it, sitting beside it. Everything visual goes there;
nothing visual goes inline.

## Lengths in `rem`

Never `px`. 1rem = 16px — 8px → `0.5rem`, 12px → `0.75rem`, 24px → `1.5rem`. Convert existing
declarations to rem when you touch the file.

Four exceptions, because they don't scale with text: `0`, hairline borders (`1px`, `2px`,
`0.5px`), and the `9999px` pill-radius idiom.

## Colours from tokens

```css
color: var(--asc-color-base-shade1);
```

Never a literal — `#000` cannot follow the theme, so it stays black in dark mode. Background is
`var(--asc-color-background-default)`.

**Icon tints set both `color` and `fill`.** The icon sets mix stroke-based SVGs (driven by
`color` / `currentColor`) and solid-fill SVGs (driven by `fill`); setting one leaves the other
kind wrong.

```css
.foo__icon {
  color: var(--asc-color-base-shade1);
  fill: var(--asc-color-base-shade1);
}
```

## Variants via data-attributes

Render a `data-*` attribute and select it in CSS. Don't build the class name conditionally.

```tsx
<div className={styles.card} data-variant={variant} data-size={size} />
```

```css
.card[data-variant='outlined'] { … }
.card[data-size='small'] { … }
```

```tsx
/* No. */
className={clsx(styles.card, isOpen && styles.card__open)}
```

The attribute survives in the DOM, so the state is visible in devtools and in tests, and the CSS
reads as one block per component rather than a set of class names assembled elsewhere.
`data-variant`, `data-size`, `data-hierarchy`, `data-style` and `data-color` are already the
established spellings — reuse them before inventing an axis.

`clsx` is still right for joining a base class with a caller's `className`; it is the
**conditional** form that is out.

## Class naming

BEM-like, block = the camelCase component name: `.card` for the root, `.card__title` for a child.

## Inline styles

Only for genuinely dynamic values — `style={themeStyles}` from `useAmityPage` /
`useAmityComponent`, a computed offset. Anything static belongs in the module.

## Not here

- **Type** — `font-size`, `line-height`, `font-weight`, `font-family` belong to the `Typography`
  component. See the `typography` skill; gate 05 enforces it.
- **Multi-line clamp** — `-webkit-line-clamp` with `display: -webkit-box` must sit on an element
  with no padding, or an extra line leaks through. Split into an outer padded element and an inner
  clamped one.

## Gate

`pnpm verify:styling` checks lengths, colours and conditional classes.

```
node governance/gates/08-check-styling.mjs                  # whole tree
node governance/gates/08-check-styling.mjs path/to/X.css    # one file
node governance/gates/08-check-styling.mjs --json           # machine-readable
```

`px-length` and `conditional-class` are **SAFE** — the conversion is mechanical and the gate
prints it. `hardcoded-colour` is **ADVISORY**: which token replaces a literal is a design
decision.
