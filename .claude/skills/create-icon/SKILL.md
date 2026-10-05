---
name: create-icon
description: Use when creating a new icon in src/v4/, or editing an existing one — the compound Regular/Light/Solid file shape, currentColor, the cleverden source mapping, and importing from core/design/icons rather than the legacy set.
---

# Create Icon

Every icon is a React component with its SVG inlined. There are **no `.svg` files** in `src/v4`
and no SVG loader — do not add one.

## Two sets

| Folder                     | Count | Use                                                                                                                |
| -------------------------- | ----- | ------------------------------------------------------------------------------------------------------------------ |
| `src/v4/core/design/icons` | 114   | **The design system. New work goes here.**                                                                         |
| `src/v4/icons`             | 244   | Legacy. Still imported across most of the tree; follow the surrounding file when editing one, but don't add to it. |

The legacy set retires with the chat→social design migration.

## The file shape

One PascalCase file per icon, one function per variant, combined with `Object.assign`:

```tsx
import React from 'react';

function Regular(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="…" fill="currentColor" />
    </svg>
  );
}

function Solid(props: React.SVGProps<SVGSVGElement>) { … }

export const PhotoFilm = Object.assign(Regular, { Regular, Solid });
```

- **`Regular` is the default export target** — `<PhotoFilm />` renders Regular, `<PhotoFilm.Solid />`
  the solid variant.
- Only attach the variants that exist. 65 icons ship `Solid`, 58 ship `Light`; most ship `Regular`
  alone.
- **Always spread `{...props}`** after the fixed attributes, so a consumer can pass `className`,
  `width` or `aria-hidden`.
- Add the icon to `core/design/icons/index.ts`.

## `currentColor`, always

```tsx
<path d="…" fill="currentColor" />
```

Never `fill="#292B32"`. A literal cannot follow the theme, so the glyph stays one colour in dark
mode. 113 of the 114 design icons already do this — `FallbackReaction.tsx` is the lone exception,
and it is also the one icon missing from the barrel.

The matching CSS rule lives in the `styling` skill: an icon tint sets **both** `color` and `fill`,
because the sets mix stroke-driven and fill-driven SVGs.

## Importing

Import by file path, not the barrel — that is what 106 of the 107 call sites do:

```tsx
import { Cross } from '~/v4/core/design/icons/Cross';
```

## Source assets

Icons come from cleverden, `Docs/cleverden/uikit/assets/icons` (214 SVGs). The filename suffix
maps to the variant, and kebab-case maps to PascalCase:

| Asset                         | Becomes                          |
| ----------------------------- | -------------------------------- |
| `arrow-down-to-bracket-r.svg` | `ArrowDownToBracket` → `Regular` |
| `arrow-down-to-bracket-l.svg` | → `Light`                        |
| `arrow-down-to-bracket-s.svg` | → `Solid`                        |

**Audit both directions** when touching icons: our paths should match the asset, _and_ we should
ship every variant cleverden has for that icon. Don't trim a variant we already have.

## Don't inline a glyph

A button renders an icon component; it does not inline `<svg>` in its own file. About eleven
elements still do (`CameraButton`, `ShareButton`, `SearchIcon`, the arrow buttons…) — don't add a
twelfth. Spinners, rings and masks are not glyphs and legitimately draw their own SVG.
