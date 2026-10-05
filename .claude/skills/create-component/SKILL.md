---
name: create-component
description: Use when creating a v4 component (social or chat) in the Amity Social Cloud UIKit Web project, or when deciding whether a component is public. Enforces the component chain — spec ID, useAmityComponent scaffolding, CSS module, barrel, and the Amity*Component public export.
---

# Create Component

A component is a customizable surface between a page and an element. The tech spec decides
whether it is public and what its signature is; this skill turns that spec into code.

## Read the spec first

`Docs/cleverden/front-end-tech-specs/UIKIT/components/<Name>/v1.md` is the authority. Take
four things from it and do not invent any of them:

| From the spec                                    | Used as                                      |
| ------------------------------------------------ | -------------------------------------------- |
| `isPublic: true` / `false` (frontmatter)         | whether it is exported from `src/index.ts`   |
| **ID:** line — e.g. `discovery_widget_component` | the `componentId` string                     |
| **API Reference → Public entry point**           | the prop list, names and order               |
| **Required / Optional Parameters** tables        | which props are optional, and their defaults |

`isPublic: false` means the component ships inside the bundle but is **not** exported. Adding
it to `src/index.ts` anyway creates consumer-facing API nobody agreed to.

The spec's signature is written in a platform-neutral pseudo-syntax. Translate types
(`String` → `string`, `Boolean` → `boolean`, `Int` → `number`), keep the names and the
defaults exactly.

### When there is no spec

Every **new** public component gets a spec. Most of the ones already shipped do not have one —
they predate the process. So:

- **New public component, no spec yet** — stop and get the spec written. `isPublic` and the
  signature are not yours to decide.
- **Changing a shipped component that has no spec** — its current public export name,
  `componentId` and props _are_ the contract. Keep them; a rename is a breaking change whether
  or not a document records it.

## The chain

For a component `X`:

| Layer          | Location                                        | Contract                                                            |
| -------------- | ----------------------------------------------- | ------------------------------------------------------------------- |
| Implementation | `<module>/components/X/X.tsx`                   | `export const X = ({ pageId = '*' }: XProps) => …`                  |
| Styles         | `<module>/components/X/X.module.css`            | `import styles from './X.module.css'`                               |
| Folder barrel  | `<module>/components/X/index.ts`                | `export { X } from './X'` + `export type { XProps }`                |
| Module barrel  | `<module>/components/index.ts`                  | `export * from './X'`                                               |
| Public export  | `src/index.ts`                                  | `X as AmityXComponent` — **only if the spec says `isPublic: true`** |
| Registry       | `core/providers/CustomizationProvider/utils.ts` | `'<page>/<componentId>/*': {}`                                      |

`AmityXComponent` is consumer-facing API. Renaming it later is a breaking change.

## Scaffolding

Every component calls `useAmityComponent` and uses all three of its outputs:

```tsx
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import styles from './X.module.css';

type XProps = {
  pageId?: string;
  topicId: string;
  showHeader?: boolean;
};

export const X = ({ pageId = '*', topicId, showHeader = true }: XProps) => {
  const componentId = COMPONENT_ID.X_COMPONENT;

  const { themeStyles, accessibilityId, isExcluded } = useAmityComponent({ pageId, componentId });

  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.x}>
      …
    </div>
  );
};
```

- **`pageId` is a prop defaulting to `'*'`** — the host page passes its own id so one component
  can be addressed per page. Never hardcode a page id inside a component.
- **`componentId` comes from the `COMPONENT_ID` registry**, never a raw string. Add the entry to
  `src/v4/constants/customization.ts` with the spec's **ID:** as its value, then reference it.
  Pages do the same with `PAGE_ID` — one registry per id kind, no literals at the call site.
- **`isExcluded` → `return null`.** Without it the component cannot be switched off by config.
- **`style={themeStyles}` on the root.** This injects the per-component theme; omit it and
  every customization key for this component silently does nothing.
- **`data-testid={accessibilityId}` on the root.** `accessibilityId` is `pageId/componentId/*`.

`useAmityComponent` also returns `config`, `defaultConfig`, `currentTheme`, `uiReference` and
`resolveText`. Use `resolveText(key)` instead of `useString(key)` when the spec allows a config
override of the copy.

## Styles

- One CSS module per component, named `X.module.css`, next to `X.tsx`.
- Class names are `x__part` — block is the camelCase component name.
- **rem, never px.**
- **`--asc-color-*` tokens, never hardcoded colours.**
- Icon rules set both `color` and `fill`.
- Multi-line clamp goes on a padding-less inner element, never on the padded one.

## Steps

1. **Read the spec.** Record `isPublic`, the **ID:**, and the signature.
2. **Create `<module>/components/X/`** with `X.tsx`, `X.module.css`, `index.ts`.
3. **Write the props** from the spec's API Reference — same names, same optionality, same defaults.
4. **Add the scaffolding** above.
5. **Register the id** — add `X_COMPONENT: '<spec ID>'` to `COMPONENT_ID` in
   `src/v4/constants/customization.ts`, then the customization key
   `'<page>/<spec ID>/*': {}` in `CustomizationProvider/utils.ts`. The registry value, the key
   and what `X.tsx` resolves to must all be the same string.
6. **Export from the module barrel** — `export * from './X'` in `components/index.ts`.
7. **Publish only if `isPublic: true`** — add `X as AmityXComponent` to `src/index.ts`.
8. **Self-check.** Run `pnpm verify:components`.

## Guardrails

- **Do not** export a component the spec marks `isPublic: false`.
- **Do not** invent a `componentId` from the Web name — it is a cross-platform contract; use the
  spec's **ID:**.
- **Do not** write the id as a raw string at the call site. It goes in `COMPONENT_ID` first.
- **Do not** register a customization key whose `componentId` no component actually uses. The key
  will never match anything — `newsfeed_component` is registered today and matches nothing,
  because the component resolves to `newsfeed`.
- **Do not** hardcode `pageId` inside a component — take it as a prop.
- **Do not** add a Storybook story. There are three in the whole `src/v4` tree; it is not a
  component convention here.
- Folder `X/`, file `X.tsx`, component `X`, stylesheet `X.module.css` — all the same string.

## Gate

`pnpm verify:components` checks the chain above, including both directions of `isPublic`:
a component exported against `isPublic: false`, and a **built** component that `isPublic: true`
but is missing from `src/index.ts`. A spec with no component in the tree yet is not flagged.

```
node governance/gates/04-check-components.mjs                  # whole tree
node governance/gates/04-check-components.mjs path/to/X.tsx    # one file
node governance/gates/04-check-components.mjs --json           # machine-readable
```
