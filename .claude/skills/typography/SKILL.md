---
name: typography
description: Use when rendering any visible text in src/v4/, or when a CSS module is about to set font-size, font-weight, font-family or line-height. The Typography component owns the type scale; nothing else sets type.
---

# Typography

`Typography` is the type system. Every piece of visible text in the UIKit goes through it, and
nothing else sets type — not a CSS module, not a token, not a raw element.

## The variants

```tsx
import { Typography } from '~/v4/core/components/Typography';
```

| Variant                   | Size     | Line height | Weight | Default element |
| ------------------------- | -------- | ----------- | ------ | --------------- |
| `Typography.Headline`     | 1.25rem  | 1.5rem      | 700    | `h1`            |
| `Typography.TitleBold`    | 1rem     | 1.5rem      | 600    | `h2`            |
| `Typography.Title`        | 1rem     | 1.5rem      | 400    | `h2`            |
| `Typography.BodyBold`     | 0.875rem | 1.25rem     | 600    | `p`             |
| `Typography.Body`         | 0.875rem | 1.25rem     | 400    | `p`             |
| `Typography.CaptionBold`  | 0.75rem  | 1rem        | 600    | `p`             |
| `Typography.Caption`      | 0.75rem  | 1rem        | 400    | `p`             |
| `Typography.CaptionSmall` | 0.75rem  | 0.75rem     | 400    | `p`             |

Override the rendered element with `as` when the semantics need it — `<Typography.Body as="span">`
inside a sentence, `<Typography.TitleBold as="h3">` for heading order. The `as` prop changes the
tag, never the type.

## Every visible string goes through it

```tsx
<Typography.BodyBold className={styles.row__name}>{displayName}</Typography.BodyBold>
```

Never a raw `<p>`, `<span>` or `<h1>`–`<h6>` holding text. A bare element inherits whatever type
its ancestor happens to have, which is how a screen ends up with four sizes nobody chose.

`<span>` is fine as a non-text wrapper — an icon holder, a flex shim, a positioning box. The rule
is about elements that _contain_ text.

## CSS modules never set type

A component stylesheet must not set `font-size`, `font-weight`, `font-family` or `line-height`.
`Typography` owns all four. Setting them in CSS means two sources of truth for one piece of text,
and the CSS silently wins.

```css
/* No. */
.row__name {
  font-size: 0.875rem;
  font-weight: 600;
}
```

```tsx
/* Yes — pick the variant that already is that. */
<Typography.BodyBold className={styles.row__name}>
```

What a stylesheet **should** still do to a text element: colour (`--asc-color-*`), truncation,
margin, alignment, `max-width`. `Typography` sets `color: inherit`, so colour stays in CSS.

If no variant matches the design, that is a design question — raise it, don't open a new size in
a component stylesheet.

## `--asc-text-*` is legacy

The `--asc-text-font-size-*`, `--asc-text-font-weight-*`, `--asc-line-height-*` and
`--typography-*` custom properties in `src/v4/styles/global.css` predate this system. They are
**not** the type system. Do not reference them in new code; replace them with a variant when you
touch a file that does.

## The one exception

`src/v4/core/components/Typography/Typography.module.css` is the only stylesheet allowed to
declare the scale. It defines the variants above and nothing else does.

## Gate

`pnpm verify:typography` checks all of this.

```
node governance/gates/05-check-typography.mjs                  # whole tree
node governance/gates/05-check-typography.mjs path/to/X.tsx    # one file
node governance/gates/05-check-typography.mjs --json           # machine-readable
```

A CSS declaration whose value matches an existing variant is reported **SAFE** with the variant
named — the fix is to delete the rule and use that variant. A value that matches no variant is
**ADVISORY**: it needs a design decision before it can move.
