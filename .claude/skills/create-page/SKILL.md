---
name: create-page
description: Use when creating a new v4 page (social or chat) in the Amity Social Cloud UIKit Web project. Enforces the page naming chain and page scaffolding (useAmityPage + data-testid) so the page passes the `01-check-pages` gate.
---

# Create Page

Every v4 page follows **one naming chain**. Get the name right once and it flows through
five places identically. The `governance/gates/01-check-pages.mjs` gate enforces this; this
skill is how you produce a page that passes it on the first run.

## Read the spec first

`Docs/cleverden/front-end-tech-specs/UIKIT/pages/<Name>/v1.md` is the authority. Take three
things from it and do not invent any of them:

| From the spec                          | Used as                                    |
| -------------------------------------- | ------------------------------------------ |
| `isPublic: true` / `false`             | whether it is exported from `src/index.ts` |
| **ID:** line                           | the `pageId` value                         |
| **API Reference → Public entry point** | the prop list, names and defaults          |

`isPublic: false` means the page ships inside the bundle but is **not** exported.

### When there is no spec

Every **new** public page gets a spec. Many shipped pages predate the process. So:

- **New public page, no spec yet** — stop and get the spec written. `isPublic` and the
  signature are not yours to decide.
- **Changing a shipped page that has no spec** — its current export name, `pageId` and props
  _are_ the contract. A rename is breaking whether or not a document records it.

## The chain

For a feature named `X` (e.g. `GroupChat`), the page is `XPage` (feature name + `Page`):

| Layer              | Location                                  | Contract                                                                             |
| ------------------ | ----------------------------------------- | ------------------------------------------------------------------------------------ |
| **Feature**        | `features/<domain>/X/X.tsx`               | `export … X` — the actual implementation                                             |
| **Page component** | `pages/XPage/XPage.tsx`                   | `export function XPage(...)` — thin wrapper that renders `<X … />`                   |
| **Page index**     | `pages/XPage/index.ts`                    | `export { XPage } from './XPage'` + `export type { XPageProps }`                     |
| **Styles**         | `pages/XPage/XPage.module.css`            | `import styles from './XPage.module.css'` — only if the page needs any               |
| **Public export**  | `src/index.ts`                            | `XPage as AmityXPage`                                                                |
| **pageId**         | `PAGE_ID` in `constants/customization.ts` | referenced as `PAGE_ID.X_PAGE`; its value is a **cross-platform** string (see below) |

`AmityXPage` (the public alias) is **consumer-facing API** — pick the name carefully up
front, renaming it later is a breaking change. The `01-check-pages` gate enforces the
folder / file / component / index / public-export chain above.

`pageId` is a separate **cross-platform contract**: the same string is shared by Flutter /
iOS / Android and is often **not** `snake_case(XPage)` (e.g. `ChannelCreateConversationPage`
uses `create_conversation_page` on every platform). It is deliberately **not** enforced by
the naming gate — match the value the other platforms use, never invent one from the Web name.

The id always lives in a registry — `PAGE_ID` for pages, `COMPONENT_ID` for components — and
is referenced by name at the call site. A raw string there is how a registry entry and its
component drift apart unnoticed.

## Scaffolding

Every page calls `useAmityPage` and uses all three of its outputs:

```tsx
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { PAGE_ID } from '~/v4/constants/customization';

export function XPage(props: XPageProps) {
  const pageId = PAGE_ID.X_PAGE;
  const { themeStyles, accessibilityId, isExcluded } = useAmityPage({ pageId });

  if (isExcluded) return null;

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <X {...props} />
    </div>
  );
}
```

- **`pageId` comes from the `PAGE_ID` registry** in `src/v4/constants/customization.ts` (chat
  pages use `CHAT_PAGE_IDS`), never a raw string. Its **value** is the cross-platform id —
  match Flutter / iOS / Android. Components do the same with `COMPONENT_ID`.
- **`isExcluded` → `return null`.** `useAmityPage` returns it exactly as `useAmityComponent`
  does; without it the page cannot be switched off by config.
- **`style={themeStyles}` on the root.** Omit it and every customization key for this page
  silently does nothing.
- **`data-testid={accessibilityId}` on the root.** `accessibilityId` is `pageId/*/*`.

`useAmityPage` also returns `config`, `defaultConfig`, `currentTheme`, `uiReference` and
`resolveText`.

## Styles

A page is a thin wrapper, so it often needs no stylesheet at all — 24 of the 58 page folders
have none. When it does need one:

- Name it `XPage.module.css`, next to `XPage.tsx`. All 34 pages that have a stylesheet follow
  this; there is no second spelling.
- Class names are `xPage__part` — block is the camelCase page name.
- **rem, never px.**
- **`--asc-color-*` tokens, never hardcoded colours.**
- Icon rules set both `color` and `fill`.
- Multi-line clamp goes on a padding-less inner element, never on the padded one.

If the page is reaching for more than layout — spacing, a grid, a scroll container — the
styling probably belongs to the feature it wraps, not to the page.

## Steps

1. **Name it.** `N = <FeatureName>Page`, PascalCase, ending in `Page`. Public export: `Amity${N}`.

2. **Feature first.** Ensure the feature `X` (= `N` minus `Page`) exists under
   `src/v4/<module>/features/<domain>/X/`. A page wraps a feature; it does not hold the
   implementation itself.

3. **Page folder** `src/v4/<module>/pages/N/`:

   - `N.tsx` — the page component, with the scaffolding above.
   - `N.module.css` — only if the page needs styles.
   - `index.ts` — `export { N } from './N';` and `export type { NProps } from './N';`

4. **Register the pageId** in the module's page-id registry (`src/v4/constants/customization.ts`
   `PAGE_ID`, or `src/v4/chat/constants/chatPageIds.ts` `CHAT_PAGE_IDS`) and, if the page is
   customizable, in `amity-uikit.config.json`.

5. **Publish only if the spec says `isPublic: true`** — add `N as AmityN` to `src/index.ts`
   (via the module `pages` barrel).

6. **Self-check.** Run `pnpm verify:pages`. It must report no violations for `N`. Fix any
   SAFE items (folder/file/index/component names) yourself; the chain should be internally
   consistent before you commit.

## Guardrails

- **Do not** name the folder, file, and component differently from each other. Folder `N/`,
  file `N.tsx`, component `N` — all the same string.
- **Always** call `useAmityPage({ pageId })` at the page level and render the root element
  with `data-testid={accessibilityId}` — this is the page scaffolding the gate requires.
- **Always** honour `isExcluded`. Only 3 of the 48 pages that call the hook do today, so copying
  a neighbouring page will get this wrong.
- **Do not** export a page the spec marks `isPublic: false`.
- **Do not** invent a `pageId` from the Web name — it is a cross-platform contract; copy the
  value the other platforms use.
- **Do not** write the id as a raw string at the call site. It goes in `PAGE_ID` first.
- **Do not** put the page's real logic in `pages/`. Pages are thin wrappers over `features/`.

## Gate

`pnpm verify:pages` checks the naming chain and the page scaffolding.

```
node governance/gates/01-check-pages.mjs         # whole tree
node governance/gates/01-check-pages.mjs --json  # machine-readable, for the fix loop
```

It classifies findings as SAFE (folder / file / index names — fix them yourself), BREAKING
(the public export — never auto-rename) and ADVISORY.
