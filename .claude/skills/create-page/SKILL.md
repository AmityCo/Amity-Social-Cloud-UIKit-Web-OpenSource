---
name: create-page
description: Use when creating a new v4 page (social or chat) in the Amity Social Cloud UIKit Web project. Enforces the page naming chain and page scaffolding (useAmityPage + data-testid) so the page passes the `01-check-pages` gate.
---

# Create Page

Every v4 page follows **one naming chain**. Get the name right once and it flows through
five places identically. The `governance/gates/01-check-pages.mjs` gate enforces this; this
skill is how you produce a page that passes it on the first run.

## The chain

For a feature named `X` (e.g. `GroupChat`), the page is `XPage` (feature name + `Page`):

| Layer | Location | Contract |
|---|---|---|
| **Feature** | `features/<domain>/X/X.tsx` | `export … X` — the actual implementation |
| **Page component** | `pages/XPage/XPage.tsx` | `export function XPage(...)` — thin wrapper that renders `<X … />` |
| **Page index** | `pages/XPage/index.ts` | `export { XPage } from './XPage'` + `export type { XPageProps }` |
| **Public export** | `src/index.ts` | `XPage as AmityXPage` |
| **pageId** | inside `XPage.tsx` | a **cross-platform** string (see below) |

`AmityXPage` (the public alias) is **consumer-facing API** — pick the name carefully up
front, renaming it later is a breaking change. The `01-check-pages` gate enforces the
folder / file / component / index / public-export chain above.

`pageId` is a separate **cross-platform contract**: the same string is shared by Flutter /
iOS / Android and is often **not** `snake_case(XPage)` (e.g. `ChannelCreateConversationPage`
uses `create_conversation_page` on every platform). It is deliberately **not** enforced by
the naming gate — match the value the other platforms use, never invent one from the Web name.

## Steps

1. **Name it.** `N = <FeatureName>Page`, PascalCase, ending in `Page`. Public export: `Amity${N}`.

2. **Feature first.** Ensure the feature `X` (= `N` minus `Page`) exists under
   `src/v4/<module>/features/<domain>/X/`. A page wraps a feature; it does not hold the
   implementation itself.

3. **Page folder** `src/v4/<module>/pages/N/`:
   - `N.tsx` — the page component. It **must** call `useAmityPage({ pageId })` at the page
     level and wire `accessibilityId` to the root `data-testid`:

     ```tsx
     export function N(props: NProps) {
       const pageId = CHAT_PAGE_IDS.N_UPPER; // cross-platform pageId (see below)
       const { themeStyles, accessibilityId } = useAmityPage({ pageId });
       return (
         <div style={themeStyles} data-testid={accessibilityId}>
           <X {...props} />
         </div>
       );
     }
     ```

     - `pageId` = the **cross-platform** value for this page (match Flutter / iOS / Android).
       Prefer a registry constant (chat uses `CHAT_PAGE_IDS.*`) over a raw string.
   - `index.ts` — `export { N } from './N';` and `export type { NProps } from './N';`

4. **Register the pageId** in the module's page-id registry (`src/v4/constants/customization.ts`
   `PAGE_ID`, or `src/v4/chat/constants/chatPageIds.ts` `CHAT_PAGE_IDS`) and, if the page is
   customizable, in `amity-uikit.config.json`.

5. **Publish it.** Add `N as AmityN` to `src/index.ts` (via the module `pages` barrel) — only
   if the page is meant to be a public entry point.

6. **Self-check.** Run `pnpm verify:pages`. It must report no violations for `N`. Fix any
   SAFE items (folder/file/index/component names) yourself; the chain should be internally
   consistent before you commit.

## Guardrails

- **Do not** name the folder, file, and component differently from each other. Folder `N/`,
  file `N.tsx`, component `N` — all the same string.
- **Always** call `useAmityPage({ pageId })` at the page level and render the root element
  with `data-testid={accessibilityId}` — this is the page scaffolding the gate requires.
- **Do not** invent a `pageId` from the Web name — it is a cross-platform contract; copy the
  value the other platforms use.
- **Do not** put the page's real logic in `pages/`. Pages are thin wrappers over `features/`.
- The gate is the source of truth: `node governance/gates/01-check-pages.mjs` (add `--json`
  for machine-readable output the fix-loop consumes).
