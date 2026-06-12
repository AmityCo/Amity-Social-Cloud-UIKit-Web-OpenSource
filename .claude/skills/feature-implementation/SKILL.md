---
name: feature-implementation
description: Use when implementing any feature, page, component, or hook inside src/v4/ of the Amity Social Cloud UIKit Web project
---

# Feature Implementation

## Overview

Conventions and patterns required when building anything inside `src/v4/`. Deviating from these causes type errors, lint failures, or visual inconsistency.

---

## Project Rules (ESLint-enforced)

- **No relative imports** — always use the `~/` alias (maps to `src/`)
- **No explicit `/index` suffix** — ESLint bans `import { X } from '~/.../Foo/index'`. Use either the specific file (`'~/.../Foo/Foo'`) or the folder path (`'~/.../Foo'`) that resolves via the barrel's `index.ts`. Prefer the folder path when the folder has a barrel re-exporting the symbol — shorter, survives file renames.
- **No test files** — do not create `.test.ts` / `.test.tsx` files

---

## SDK hook organization — three folders, three suffixes

Every SDK-backed hook in a module lives in one of three sibling folders under
`src/v4/<module>/hooks/`. The folder name dictates both the suffix on the
hook and the import path consumers use.

| Folder | Suffix | What goes here | Underlying SDK primitive |
|---|---|---|---|
| `hooks/objects/` | `Object` | `useChannelObject`, `usePostObject` | `useLiveObjectV4` |
| `hooks/collections/` | `Collection` | `useChannelCollection`, `useMessageCollection` | `useLiveCollectionV4` |
| `hooks/queries/` | `Query` | `useMessageDeleteQuery`, `useMessageResendQuery`, `useCreateMessageQuery` | `useMutation` (React Query) on a one-shot SDK call |

Each folder ships a barrel `index.ts` that re-exports every hook in the
folder. Consumers always import from the folder path, never the file:

```ts
import { useChannelObject } from '~/v4/chat/hooks/objects';
import { useMessageCollection } from '~/v4/chat/hooks/collections';
import { useMessageDeleteQuery, useMessageResendQuery } from '~/v4/chat/hooks/queries';
```

See: `src/v4/chat/hooks/objects/useChannelObject.ts`,
`src/v4/chat/hooks/collections/useMessageCollection.ts`,
`src/v4/chat/hooks/queries/useMessageDeleteQuery.ts`.

### Live Objects — `useLiveObjectV4` wrappers

- Returns `{ item, isLoading, error }` — read it with the SDK noun:
  `const { channel } = useChannelObject({ channelId })`.
- Pass `shouldCall: !!param` to skip fetching until the param is ready.
- One file per SDK noun. Never call `useLiveObjectV4` from a component
  directly — always wrap.

### Live Collections — `useLiveCollectionV4` wrappers

- Returns `{ items, isLoadingFirstPage, hasMore, loadMore, isLoading }` —
  not `hasNextPage`/`loadNextPage`.
- Pass `shouldCall: false` to skip fetching until params are ready.
- `isLoadingFirstPage` → full-screen skeleton (first load).
- `isLoading && !isLoadingFirstPage` → skeleton rows appended at the bottom
  of the list (next page load).
- One file per SDK list method (e.g. `useChannelCollection` wraps
  `ChannelRepository.getChannels`, `useSearchUserByDisplayName` wraps
  `UserRepository.searchUserByDisplayName`). Never call
  `useLiveCollectionV4` from a component directly.

### Queries (React Query mutations / one-shot SDK calls)

A `Query` hook is the canonical orchestrator for a single SDK side-effect:
it owns the `useMutation`, the toast / confirm wiring, and exposes one
verb function (e.g. `addReaction`, `deleteMessage`). It does NOT own UI
state — overlays and sheet open/close state belong to feature-local
hooks under `features/<feature>/hooks/` that consume the Query hook.

Rules for writing a Query hook:

1. **Explicit generics** — `useMutation<Payload, Error, Param>`.
2. **Derive types from the SDK function** — use `Awaited<ReturnType<...>>`
   for the resolved payload type and `Parameters<...>[0]` for the SDK
   param shape. When the generics are wired correctly, **do not add
   `as SomeParams` type assertions at the call site** — the arg is
   already type-checked against the generic. When the SDK call takes
   positional args (e.g. `addReaction('message', id, name)`), define a
   local `XxxPayload` object type next to the hook and adapt inside
   `mutationFn` — never expose positional args to the caller. Bind
   each field of the payload type to the SDK signature via a named
   `type Params = Parameters<typeof SDK_FN>` alias plus indexed access
   (`Params[0]`, `Params[1]`, …). Don't hand-roll `string` or
   `string[]` — when the SDK signature changes, the payload follows
   automatically.
3. **`mutationFn` points directly at the SDK function** — no wrapper
   arrow function.
4. **Use `await mutateAsync` with `{ onSuccess, onError }` callbacks
   passed as the second argument** — `await mutateAsync(params, {
   onSuccess, onError })`. Do **not** wrap `mutateAsync` in
   `try`/`catch`. Awaiting keeps the calling function's control flow
   linear (downstream work can read the resolved value or rely on the
   awaited completion) and plays nicely with `react-hook-form`'s
   `handleSubmit` / `isSubmitting` tracking. The
   `{ onSuccess, onError }` form keeps success and failure branches
   explicit and avoids swallowed errors.
5. Access the created resource from the `onSuccess` callback — e.g.
   `onSuccess: (result) => { const id = result?.data?.channelId; ... }`.
6. `onError` should route to a toast / confirm / alert via existing
   providers (`useNotifications`, `useConfirmContext`). Do not rethrow.
7. **Plain inner function, not `useCallback`.** The returned verb
   function is invoked from event handlers, not stored in `useEffect` /
   `useMemo` dependency arrays. `useCallback` adds noise without
   preserving identity that any consumer relies on.
8. **Optional `afterX` callback in the verb function's options** — pass
   `{ afterDelete }` / `{ afterResend }` for sheet/viewer close hooks.
   Define an explicit `<Verb>Options` type next to the hook (no
   `Request` prefix) and re-export it from the barrel.

9. **Public function name is the bare verb — no `request` / `do` /
   `handle` prefix.** Expose `addReaction`, `removeReaction`, `report`,
   `unreport`, `deleteMessage` directly. Older hooks shipped as
   `requestX` and are being migrated. New hooks: bare verb only.

10. **Hook's own `onError` owns the toast.** Bake the failure toast
    into the `useMutation` config (`onError: () => error({ content:
    TOAST.<…>.FAILED, alignment })`). Callers don't pass error
    callbacks for toast-only failure paths — the hook is the single
    source of truth. Resolve `toastAlignment` from a hook param with
    a `useResponsive()` desktop / mobile fallback.

11. **Return `Promise<void>` from the public verb function.** Drop
    SDK return values (booleans, IDs) at the hook boundary unless a
    caller actually needs them. Default shape:
    `async function addReaction(payload): Promise<void> { await
    mutateAsync(payload); }`.

12. **Pair related opposite operations into one hook with two
    `useMutation` calls.** When two SDK calls are semantic opposites
    on the same noun (add/remove members, promote/demote moderator,
    flag/unflag message, mute/unmute channel) AND share a payload
    shape, bundle them into ONE `Query` hook holding TWO separate
    `useMutation` blocks — each with its own `mutationFn` and
    `onError`. Return both verb functions side-by-side
    (`{ addMembers, removeMembers }`). This keeps the SDK namespace
    boundary intact (one hook owns one repository's
    `Membership.*` operations, another owns its `Moderation.*`),
    avoids enum/discriminator dispatch inside `mutationFn`, and
    keeps each operation's failure-toast logic in its own `onError`
    block. Do **not** combine non-opposite operations (e.g.
    add-member + promote-moderator) under one hook — that mixes
    two repository surfaces and forces a switch.

See: `src/v4/chat/hooks/queries/useMessageDeleteQuery.ts`,
`src/v4/chat/hooks/queries/useMessageResendQuery.ts`,
`src/v4/chat/hooks/queries/useAddMessageReactionQuery.ts`,
`src/v4/chat/hooks/queries/useRemoveMessageReactionQuery.ts`,
`src/v4/chat/features/group/create/hooks/useCreateGroupChat.ts`,
`src/v4/chat/features/shared/hooks/useMessageComposer.ts`.

---

## Core Components — use before creating new ones

**Always check `src/v4/core/components/` first** before building a new component. The core library has ~47 primitives — using them avoids duplication and stays consistent with existing patterns.

Key components to know:

### Tabs
- `variant: 'chip' | 'underlined' | 'icon' | 'iconSmall'`
- Use `variant="chip"` for pill-style horizontal tab bars
- Props: `value: Key`, `onChange: (key: Key) => void`, `tabs: { value, label, content }[]`
- Also accepts: `className`, `tabListClassName`, `tabPanelClassName` for layout overrides
- Chip tab text: inactive → `Typography.Title`, selected → `Typography.TitleBold` (rendered via react-aria render prop inside `Tab` children)

See: `src/v4/core/components/Tabs/Tabs.tsx`

### Avatar

- Requires `defaultImage` (ReactNode fallback)
- No `displayName` or `size` props
- Override shape via `containerClassName` (e.g. `border-radius: 0.625rem` for community channels, `border-radius: 50%` for conversations)

See: `src/v4/core/components/Avatar/Avatar.tsx`

### AriaButton

- Use `{ Button } from '~/v4/core/components/AriaButton/Button'` for all clickable buttons **and clickable list rows**. Never use `<div onClick>` — it has no keyboard support, no focus ring, and no screen-reader role. `AriaButton` wraps `react-aria-components` so it gives all three for free.
- Props: `onPress` (not `onClick`), `color?: 'primary' | 'secondary' | 'alert'` (default `'primary'`), `variant?: 'fill' | 'outlined' | 'text' | 'default'` (default `'fill'`), `icon?: ReactNode`, `size?: 'small' | 'medium'`.
- For list rows, pass `variant="default"` (unstyled, takes your CSS classes) and an `aria-label` describing the action.
- Forward-ref aware — safe to use as Popover trigger.

See: `src/v4/core/components/AriaButton/Button.tsx`, `src/v4/chat/features/conversation/create/components/UserItem/UserItem.tsx`

### CheckboxGroup

- Use `{ CheckboxGroup } from '~/v4/core/components/AriaCheckboxGroup/CheckboxGroup'` for **multi-select lists** (user pickers, filter chips, etc.). Never hand-roll `AriaButton` + custom check icon + `selectedIds: Set<string>` state — CheckboxGroup gives you keyboard nav (Space to toggle, arrows to move), focus ring, and `aria-checked` roles for free.
- Props: `value: string[]`, `onChange: (values: string[]) => void`, `checkboxes: { value: string; label: string | ReactNode }[]`, `alignment?: 'row' | 'row-reverse'` (use `row-reverse` when the checkmark sits on the right of the label, like user-selection lists), `checkboxProps?: Partial<CheckboxProps>` (pass `{ className: ... }` to style each row — padding, height, hover).
- The `label` accepts any ReactNode — pass the full row component (avatar + name + badges) as the label; do not wrap the row in a separate `AriaButton`.
- Pairs naturally with react-hook-form `Controller` — pass `field.value` / `field.onChange`. When the checkbox values are IDs but the form stores full objects, map IDs ↔ objects inside the list wrapper using a `Map<string, T>` built from current visible items + already-selected items.
- For single-select, use `RadioGroup` instead (below) — do **not** coerce CheckboxGroup with `value={[selected]}` array hacks.

See: `src/v4/core/components/AriaCheckboxGroup/CheckboxGroup.tsx`, `src/v4/chat/features/group/select-member/components/UserList/UserList.tsx`

### RadioGroup

- Use `{ RadioGroup } from '~/v4/core/components/AriaRadioGroup/RadioGroup'` for **single-select lists** (Public / Private, sort options, Yes / No). Each `Radio` is pre-styled with `flex-direction: row-reverse`, `justify-content: space-between`, `width: 100%`, and the classic radio-dot indicator via a border-width trick — no CSS work needed to match typical designs.
- Props: `value: string`, `onChange: (value: string) => void`, `radios: { value; label; props?; icon?; isDisabled? }[]`, `radioContainerClassname?` (for the options wrapper), `radioProps?: Partial<RadioProps>` (pass `{ className: ... }` to style each row — padding, height, hover).
- `value` is a plain string (not an array). `onChange` receives the single selected value. Pair with `Controller` → map the form's boolean / enum directly: `value={isPublic ? 'public' : 'private'}`, `onChange={(v) => setIsPublic(v === 'public')}`.
- The `label` accepts any ReactNode — build the row content (icon circle + title + description) as a sub-component and pass it.
- Never build a custom radio with `AriaButton` + `aria-checked` or use `CheckboxGroup` with single-entry arrays.

See: `src/v4/core/components/AriaRadioGroup/RadioGroup.tsx`, `src/v4/chat/features/group/create/components/PrivacySection/PrivacySection.tsx`

### FormInput

- Use `{ FormInput } from '~/v4/core/components/FormInput/FormInput'` for text fields that need a label, optional flag, character counter, or underlined / boxed styling. Wraps react-aria-components `TextField` + `TextArea` so labels auto-associate and screen readers work.
- Props: `label`, `optional`, `maxLength`, `helperText`, `variant: 'boxed' | 'underlined'` (default `'underlined'`), `multiLine`, plus all native `TextFieldProps` / `InputProps` (`value`, `onChange`, `placeholder`).
- Never hand-roll a `<label>` + `<input>` + counter — the counter and a11y wiring are built in.

See: `src/v4/core/components/FormInput/FormInput.tsx`, `src/v4/chat/features/group/create/components/GroupNameField/GroupNameField.tsx`

---

## Accessibility — apply every applicable technique, not just AriaButton

Accessibility is a hard requirement across the whole tree, not a checklist reserved for buttons. For every element you add, work through this list and apply what fits:

### Semantic HTML first

- Use landmark tags where they match the intent: `<header>`, `<nav>`, `<main>`, `<footer>`, `<aside>`, `<section>`. Each page has exactly one `<main>`.
- Lists of items use `<ul>` / `<ol>` with `<li>`; forms use `<form>` with labeled inputs; headings use `<h1>`–`<h6>` in order (no skipping levels).
- Prefer semantic elements over a generic `<div>` + ARIA role. A native `<button>` needs no `role="button"`; a `<nav>` needs no `role="navigation"`.

### Interactive elements

- Every clickable element must be reachable by `Tab`, activatable by `Enter` / `Space`, and show a visible focus ring. `AriaButton`, `react-aria-components`, and native `<button>` / `<a>` give all three. Never simulate a button with `<div>` / `<span>` + `onClick`.
- Disabled interactive controls use `isDisabled` on AriaButton or `disabled` on native inputs (not `aria-disabled` alone) so they are skipped by Tab.
- Links that navigate use `<a href>`; links that perform actions must be buttons.

### ARIA labels & descriptions

- Icon-only buttons, inputs without a visible label, and ambiguous controls need `aria-label` (or `aria-labelledby` when another element already contains the text).
- Supplementary helper text or validation errors bind to the control via `aria-describedby`.
- Do not duplicate visible text in `aria-label` — screen readers will announce it twice.

### ARIA states (use when native attributes don't cover it)

- Toggle buttons: `aria-pressed`. Expandable triggers: `aria-expanded`. Tabs: `aria-selected`. Menu items: `aria-checked` where relevant.
- Selected row in a list, current route, current page in a pager: `aria-current`.
- Live-updating regions (e.g. "No results found", async success/error banners): `role="status"` / `aria-live="polite"` (or `assertive` only for urgent messages).

### Images & icons

- Meaningful images: descriptive `alt`.
- Decorative images and icons that only repeat adjacent text: `alt=""` (for `<img>`) or `aria-hidden="true"` (for inline SVG).
- Standalone informational icons with no adjacent label: wrap in a button/link with `aria-label`, or give the SVG `role="img"` + `aria-label`.

### Forms

- Every input has an associated `<label>` (via `htmlFor`) or an `aria-label`.
- Group related inputs with `<fieldset>` / `<legend>` where appropriate.
- Error messages link to the field with `aria-describedby`; set `aria-invalid="true"` on invalid fields.

### Focus management

- When a modal / popover / drawer opens, focus moves into it; on close, focus returns to the trigger. `react-aria-components` overlays handle this automatically — prefer them over hand-rolled `useState` toggles.
- When a page replaces its contents (route change, tab switch), move focus to the new region's heading so screen readers re-announce.
- Never call `element.focus()` on hover or scroll; only in response to user intent.

### Text & contrast

- All visible text goes through `Typography.*` which respects the theme. Theme tokens (`--asc-color-*`) are tuned to meet WCAG AA (4.5:1 for body text, 3:1 for large text). Never hardcode colours.
- Honour the user's motion preference: long animations / autoplay should respect `@media (prefers-reduced-motion: reduce)`.

### Keyboard shortcuts

- Don't hijack common browser shortcuts (`Ctrl+S`, `Ctrl+F`, etc.).
- Overlay keyboards (Popover, Dialog, Menu) must close on `Esc` — again, `react-aria-components` handles this.

### Testing checklist before PR

1. Tab through the feature — every interactive element reachable, focus ring visible, order matches visual order.
2. Operate it with keyboard only — Enter/Space activate, Esc closes overlays, arrow keys move through menus/tabs.
3. Run VoiceOver (macOS) / NVDA — every control announces role + label; status changes announce without focus loss.
4. Zoom browser to 200% — layout still usable, nothing clipped.

### Skeleton

- Sub-components: `Skeleton.Circle`, `Skeleton.Line`, `Skeleton.Square`. The base `<Skeleton>` is a passthrough `<div>` with no styling — use it as a **wrapper** for groups of skeleton primitives (e.g. one row of avatar + line) so the markup reads semantically.
- All dimensions are **strings** — e.g. `width="2.5rem"`, `height="0.625rem"`, `radius="0.75rem"`. Never numbers, never `px`.
- The shimmer animation (`@keyframes pulse`) is baked into `Skeleton.module.css`. **Do not hand-roll skeleton CSS** — no custom `linear-gradient` strips, no local `@keyframes`, no `__skeletonAvatar` / `__skeletonLine` rules. If you find these in a file you're touching, delete them and migrate to the primitives.
- **Mirror the real row structure.** A skeleton row should reuse the same container class as the real row (same height, padding, gap) so there is no layout shift when the data lands. Replace each piece of real content with the matching primitive: `UserAvatar` → `Skeleton.Circle`, name `Typography` → `Skeleton.Line`, trailing icon → `Skeleton.Circle`.
- **Wrap every grouping level with `<Skeleton>`, not `<div>`.** The outer row wrapper IS a `<Skeleton>`, AND every inner grouping wrapper (avatar wrapper, name+badge row, trailing slot) is also a `<Skeleton>`. Plain `<div>` only inside leaf primitives that supply their own. The semantic intent is "this whole subtree is loading state" — using `<div>` mid-tree breaks the intent and invites someone to drop a real `Typography` inside a "skeleton" tree later.

See: `src/v4/core/components/Skeleton/Skeleton.tsx`, `src/v4/chat/features/shared/components/MessageReactorListSheet/MessageReactorListSheet.tsx`, `src/v4/chat/features/group/member-list/components/MemberItem/MemberItem.tsx`

---

## Pagination — always use `useIntersectionObserver`

Never use `onScroll` handlers for pagination. Use a sentinel `div` at the bottom of the list with `useIntersectionObserver`.

- Sentinel only renders when `hasMore && !isLoadingFirstPage && !isLoading` — all three guards. `!isLoadingFirstPage` prevents the observer from firing while the initial skeleton list is still on screen; `!isLoading` prevents firing `loadMore` again while a page is already in flight.
- `onIntersect` should also re-check all three guards: `() => hasMore && !isLoadingFirstPage && !isLoading && loadMore()`.
- Show skeleton rows at the bottom while loading next page (`isLoading && !isLoadingFirstPage`).

See: `src/v4/core/hooks/useIntersectionObserver.ts`, `src/v4/chat/features/home/components/ChannelList/ChannelList.tsx`

### List-component state machine — early returns + inline skeletons

Live-collection-backed list components (chat-home, archived chats, search results, member lists) all follow the same shape. Branches are evaluated in this exact order — getting the order wrong causes the no-results state to flicker during initial load, or skeletons to disappear too early.

1. **Pre-fetch empty state** (search-only) — when the gate that decides whether to call the SDK is still `false` (e.g. `query.length < SEARCH_MIN_QUERY_LENGTH`), early-return `<EmptyState variant="prompt" />`.
2. **No-results empty state** — early-return `<EmptyState variant="no-results" />` when `items.length === 0 && !isLoading && !isLoadingFirstPage`. The two loading guards are non-negotiable: without them the empty state flashes for one frame between the SDK call firing and the first page landing.
3. **Render block** — map `items` to rows, then render the **combined skeleton branch** AND the sentinel as siblings under one wrapper `<div>`. One skeleton branch covers both first-page and tail-load via `{(isLoadingFirstPage || isLoading) && skeletons}`. Do NOT split into two branches and do NOT add a dedicated first-page early-return — during first-page load the empty `items.map()` produces nothing and the combined branch renders the skeletons; during tail-load the sentinel's three-guard predicate disappears so the skeletons replace it visually.
4. **Skeleton row component** — every list-row component exports a `.Skeleton` static (e.g. `ChannelItem.Skeleton`, `MemberItem.Skeleton`). The skeleton mirrors the real row's container class so there is no layout shift when data lands. See the Skeleton subsection of "Accessibility".

See: `src/v4/chat/features/search/components/SearchChannelList/SearchChannelList.tsx`, `src/v4/chat/features/home/components/ChannelList/ChannelList.tsx`

### Constants — always pull from `~/v4/<module>/constants/`

Magic numbers belong in a constants file, never inlined in JSX, hooks, or utilities. The chat module ships dedicated constant files under `~/v4/chat/constants/` grouped by topic (`search.ts`, `chat.ts`, `text.ts`, `toast.ts`, etc.) and re-exported from a single barrel. Add to the matching topic file or create a new one — never hand-write the numeric/string literal at the call site.

Examples shipped: `SEARCH_DEBOUNCE_MS`, `SEARCH_MIN_QUERY_LENGTH`, `SEARCH_SKELETON_ROW_COUNT` (`src/v4/chat/constants/search.ts`).

---

## Virtualized lists — `@tanstack/react-virtual` for message-style feeds

For reverse/chat-style lists that can grow to thousands of rows (direct chat, group chat), use `@tanstack/react-virtual`'s `useVirtualizer`. For short feed lists (channel list, user list) stick with plain `overflow-y: auto` + the pagination rules above.

Rules when using the virtualizer:

- **Scroll element ref**: `useVirtualizer({ count, estimateSize, overscan, getScrollElement: () => scrollRef.current })`. The ref must target the actual scrollable container, not an inner wrapper.
- **Variable height**: let the virtualizer measure — attach `ref={virtualizer.measureElement}` on the outer row wrapper and expose `data-index={virtualRow.index}` so the library can correlate observations back to the virtual row.
- **Reverse anchoring for chat**: don't fight the scroll axis with `column-reverse`. Reverse the items array before feeding the virtualizer (`[...items].reverse()`) so the newest message sits at the largest index; then scroll anchors naturally to the bottom.
- **Anchor on prepend**: when infinite-scrolling upward, preserve viewport by recording `scrollRef.current.scrollHeight` *before* `loadMore()` and, in a `useLayoutEffect` keyed on `items.length`, add the height delta back to `scrollTop` once new rows land. Without this the view "jumps up" every time a page loads.
- **Top infinite-scroll trigger**: inspect `virtualizer.getVirtualItems()[0]?.index` and compare against a small threshold (e.g. `PAGE_TOP_TRIGGER_INDEX = 5`). Don't hand-roll `IntersectionObserver` on top — the virtualizer already knows which rows are visible.
- **At-bottom detection**: `scrollTop + clientHeight >= scrollHeight - TOLERANCE_PX` (16 px is fine). Use this to gate mark-as-read, "scroll to latest" pill visibility, and auto-anchor-on-new-message.

See: `src/v4/chat/features/conversation/chat/components/MessageList/MessageList.tsx`, `src/v4/chat/constants/chat.ts`.

---

## Sub-components — compound pattern + explicit prop types

Whenever a component has internal helper components (`PrivacyRow`, `AddTile`, `YouTile`, `MemberTile`, `ComponentName.Skeleton`, etc.), follow this pattern:

1. **Keep them in the same file as the main component.** Do not create a separate file per helper. One `ComponentName.tsx` contains the main export plus its helpers.
2. **Define the main component first, helpers below.** Read order: consumer-facing component first, implementation details after.
3. **Always define an explicit `type SubComponentNameProps`** above each helper. Never inline the prop type (`function Tile({ user }: { user: Amity.User }) { ... }` is banned — extract the type).
4. **Attach helpers as static sub-components via dot notation.** `MainComponent.Sub = Sub` at the bottom of the file (after all function declarations). This includes skeletons (`ComponentName.Skeleton = ComponentNameSkeleton`).

```ts
export function MemberGrid({ ... }: MemberGridProps) { ... }

type AddTileProps = { onPress: () => void };
function AddTile({ onPress }: AddTileProps) { ... }

type YouTileProps = { user: Amity.User };
function YouTile({ user }: YouTileProps) { ... }

MemberGrid.AddTile = AddTile;
MemberGrid.YouTile = YouTile;
```

See: `src/v4/chat/features/home/components/ChannelItem/ChannelItem.tsx` (Skeleton), `src/v4/chat/features/group/create/components/MemberGrid/MemberGrid.tsx` (multiple tiles), `src/v4/chat/features/group/create/components/PrivacySection/PrivacySection.tsx` (Row).

---

## Action lists / menus — declarative items array with `visible`

When a component renders a list of action rows whose presence depends on runtime state (popovers, context menus, action sheets, kebab menus), build the items as a single literal array where each entry carries a `visible: boolean` field, then `.filter()` before rendering. Do not chain `if (cond) items.push(...)` calls.

Rules:

1. **One literal array, one item per logical row.** Array order = render order. Reordering rows = moving entries in the array. No external sort step.

2. **`visible: boolean` on every entry.** Each row's visibility is a single flat boolean expression evaluated against the inputs (message metadata, current user, async flag state, etc.). Never split visibility across nested `if`/`else` branches in the builder.

3. **Filter at the boundary, not at render.** The builder returns `items.filter((item) => item.visible)`. Consumers receive a list of guaranteed-visible items and never inspect `visible` themselves. Keep `visible` as an internal build-time field — type the in-builder array as `(PublicItem & { visible: boolean })[]` and let the public return type stay `PublicItem[]`.

4. **Public item type stays minimal.** The exported `MessageActionItem` (or equivalent) does not carry `visible`. Render-only fields (`key`, `icon`, `label`, `destructive?`, `loading?`, `onPress`) only. This prevents consumers from accidentally rendering invisible rows.

5. **Unique `key` per logical row, even for mutually-exclusive variants.** When the same conceptual slot has multiple visual states (e.g. a Report row that's either Loading skeleton, "Unreport", or "Report"), give each variant a distinct key (`report-loading`, `unreport`, `report`) — not all three sharing `key: 'report'`. Mutual exclusion via `visible` is correct today, but a future drift in conditions would surface as React's "two children with the same key" warning. Unique keys remove the foot-gun.

6. **Async / skeleton rows** carry `loading: true` and a no-op `onPress: () => {}`; the renderer branches on `item.loading` to render a `Menu.Item.Skeleton` (or equivalent) instead of an interactive row. Skeleton rows must have `pointer-events: none` in CSS so the no-op `onPress` is unreachable.

7. **Hooks stay in the renderer, not the builder.** The builder is a plain function (testable, no React rules-of-hooks). The renderer (popover, sheet) calls the hooks (`useFlagMessageQuery`, `useSDK`, etc.), passes the resolved state and handlers into the builder, and renders the returned items. This keeps the builder pure and the hook subscription scoped to the renderer's lifecycle.

8. **Required handlers, not optional.** If every consumer always passes a handler (e.g. `onReport` for a chat menu), type it as required. Optional handlers create dead conditional branches that pile up over time. Make the contract honest.

9. **Inline the items array when the builder has only one consumer.** Extracting a separate `buildXItems(...)` function is justified when (a) the array is consumed by 2+ surfaces (popover + drawer for the same feature), (b) the visibility predicates compose multiple async flag states, or (c) ordering is spec-mandated and a future row needs a clear extension point. For a single-consumer drawer with simple boolean visibility (e.g. `!isTargetModerator`), declare the typed `(Item & { visible: boolean })[]` array directly inside the renderer/handler, then `.filter(...).map(...)` to JSX. The pattern (declarative array + visible filter + unique keys) still applies — just without the extra function.

```ts
type ItemHandlers = {
  onEdit: () => void;
  onCopy: () => void;
  onSave: () => void;
  onReport: (m: Amity.Message) => void;
  onUnreport: () => void;
  onDelete: () => void;
};

type FlagState = { isLoading: boolean; isFlaggedByMe: boolean };

export function buildBubbleMenuItems(
  message: Amity.Message,
  currentUserId: string | null | undefined,
  flagState: FlagState,
  handlers: ItemHandlers,
): MessageActionItem[] {
  const isOwn = !!currentUserId && message.creatorId === currentUserId;
  const isActive = message.syncState === 'synced' && !message.isDeleted;

  const items: (MessageActionItem & { visible: boolean })[] = [
    { key: 'edit', icon: 'pen', label: 'Edit', onPress: handlers.onEdit,
      visible: isOwn && message.dataType === 'text' && isActive },
    { key: 'copy', icon: 'copy', label: 'Copy', onPress: handlers.onCopy,
      visible: (message.dataType === 'text' || message.dataType === 'custom') && isActive },
    { key: 'report-loading', icon: Flag, label: '', loading: true, onPress: () => {},
      visible: !isOwn && flagState.isLoading },
    { key: 'unreport', icon: UnFlag, label: 'Unreport', onPress: handlers.onUnreport,
      visible: !isOwn && !flagState.isLoading && flagState.isFlaggedByMe },
    { key: 'report', icon: Flag, label: 'Report', onPress: () => handlers.onReport(message),
      visible: !isOwn && !flagState.isLoading && !flagState.isFlaggedByMe },
    { key: 'delete', icon: 'trash', label: 'Delete', destructive: true,
      onPress: handlers.onDelete, visible: isOwn },
  ];

  return items.filter((item) => item.visible);
}
```

See: `src/v4/chat/features/shared/components/MessageActionsPopover/MessageActionsPopover.tsx`

---

## Empty states — extend the shared `EmptyState` component, don't fork

The chat module ships one shared empty-state component at `~/v4/chat/features/shared/components/EmptyState/`. It already supports `'prompt'` (search-prompt placeholder) and `'no-results'` (failed-search) variants and exposes the search-not-found icon + centred caption layout used across all search surfaces.

Rules:

1. **Extend `EmptyState` with a new variant** (e.g. `'no-members'`, `'no-channels'`) before building a parallel component. Add the variant key to the `EmptyStateVariant` union, the matching string to the `CONTENT` map, and pull the visible text from `TEXT.<FEATURE>.EMPTY_STATE` so it stays in the constants namespace. Same icon picker logic — `'prompt'` uses the search-prompt icon, every other variant uses the no-result icon.
2. **Consume via `<EmptyState variant="..." />`** at the call site. Don't pass `text` / `icon` props through — the variant IS the contract.
3. **Don't fork to feature-local empty states.** A duplicate `MyFeatureEmptyState` that hand-rolls the icon + caption + min-height layout fights the shared CSS (`--empty-state-offset-top` ladder) and drifts visually.
4. **Visibility predicate sits in the consumer**, never inside `EmptyState` itself. The consumer renders `<EmptyState />` only when the data array is empty AND no loading state is active — `EmptyState` doesn't read SDK state.

See: `src/v4/chat/features/shared/components/EmptyState/EmptyState.tsx`, `src/v4/chat/features/group/memberships/components/MemberList/MemberList.tsx`

---

## Existing Hooks — correct call signatures

- `useChannel({ channelId })` — takes object, not bare string
- `useSDK()` — returns `{ currentUserId }`
- `useSearchUserByDisplayName({ displayName, limit, matchType })` — from `~/v4/core/hooks/collections/useSearchUserByDisplayName`, wraps `UserRepository.searchUserByDisplayName` via `useLiveCollectionV4`

See: `src/v4/chat/hooks/useChannel.ts`, `src/v4/core/hooks/useSDK.ts`, `src/v4/core/hooks/collections/useSearchUserByDisplayName.ts`

---

## Utility hooks — prefer `react-use` over hand-rolled

`react-use` is already a project dependency. Prefer its hooks over manual implementations — e.g. `useDebounce`, `useMedia`, `useNetworkState`, `useLocalStorage`, `useCopyToClipboard`, `useMount`, `useUnmount`, `useUpdateEffect`, `usePrevious`, `useToggle`. Never hand-roll `useEffect` + `setTimeout` for debounce or `window.matchMedia` subscriptions for media queries.

```ts
import { useDebounce, useMedia, useNetworkState } from 'react-use';
```

See: `src/v4/core/hooks/useResponsive.ts`, `src/v4/chat/features/conversation/create/hooks/useCreateConversation.ts`

---

## Forms — `react-hook-form` + `zod` + `Controller`

For any page with two or more form fields, or any field that needs validation, use `react-hook-form` + `zod` via `zodResolver`. Never hand-roll `useState` per field for forms.

Rules:

1. **Schema + types with zod.** Define a `z.object({...})` schema at the top of the feature-local hook, and derive the form shape with `type FormValues = z.infer<typeof schema>`. Use `z.custom<T>()` for SDK object fields (`Amity.User`, `Amity.File<'image'>`, etc.) and `.min(1)`, `.max(100)`, `.trim()`, `.nullable()` for validation.

2. **`useForm` with live validation.** Always pass `mode: 'onChange'` and `resolver: zodResolver(schema)` so `formState.isValid` / `formState.isDirty` reflect live state. Set `defaultValues` explicitly — don't rely on implicit undefined.

3. **Hook owns all form logic.** The feature-local hook (`features/<feature>/hooks/use<Feature>.ts`) creates the form, defines `handleSubmit` via `form.handleSubmit(async (values) => ...)`, and returns `{ form, isFormValid, handle<Action>, ... }`. No `useState` for field values in the feature root.

4. **Expose form-state flags derived from `formState`, not hand-rolled.** Standard returns:

   - `isFormValid = form.formState.isValid || form.formState.isSubmitting` — enable flag for the submit button; stays "enabled" during the async submission to avoid flicker when the mutation is pending.
   - `isFormDirty = form.formState.isDirty` — use for unsaved-changes prompts, "Discard" dialogs, or confirming navigation away. Pair with `form.reset(values)` after a successful submit to clear dirty state.
   - `isSubmitting = form.formState.isSubmitting` — expose only when the UI needs a distinct "saving…" indicator separate from disabled state.

   Never hand-roll equivalents via `useState`.

5. **Feature root wraps children in `<form onSubmit={handleSubmit}>`.** Submit buttons (Next, Create, Save) use `type="submit"` + `isDisabled={!isFormValid}` — never `onPress={handleSubmit}`. This also gives you keyboard Enter-to-submit for free.

6. **Custom inputs use `Controller`.** Any component that takes `value` + `onChange` (AvatarPicker, PrivacySection, MemberGrid, GroupNameField, etc.) must be wired via `<Controller control={form.control} name="..." render={({ field }) => <Component value={field.value} onChange={field.onChange} />} />`. Do not call `form.watch(...)` + `form.setValue(...)` manually in the feature root.

7. **`setValue` — if ever needed outside a Controller, pass `{ shouldValidate: true, shouldDirty: true }`** so `formState.isValid` and `formState.isDirty` stay in sync.

8. **Separate logic from UI.** Derived values (e.g. `selectedUserIds: Set<string>` from `selectedUsers: Amity.User[]`) live in the hook via `useMemo`, not in the feature root. The feature root does nothing but prop-wire `Controller`s, render sub-components, and hand submit/action handlers down.

See: `src/v4/chat/features/group/create/hooks/useCreateGroupChat.ts`, `src/v4/chat/features/group/create/CreateGroupChat.tsx`, `src/v4/chat/features/group/select-member/hooks/useSelectGroupMember.ts`

---

## Toasts & notifications — `useNotifications()` + `TOAST` constants

Use `useNotifications()` from `~/v4/core/providers/NotificationProvider` for all in-app toasts. Never render raw toast UI, use `window.alert`, or spawn custom overlays. Never import a third-party toast library.

Rules:

1. **Channel**: `const { success, info, error, loading, show } = useNotifications()`. Each method takes `{ content: ReactNode, ... }`. Use `success` for completion confirmations, `error` for action failures, `info` for neutral messages, `loading` for in-flight operations.

2. **Messages live in a constants file, never inline at the call site.** Define them in `<module>/constants/toast.ts` under a nested `TOAST` namespace following the **`TOAST.<FEATURE>.<ACTION>.<OUTCOME>` shape** (e.g. `TOAST.GROUP_CHAT.CREATE.SUCCESS`, `TOAST.GROUP_CHAT.CREATE.FAILED`, `TOAST.CHAT.DELETE.FAILED`, `TOAST.CHAT.SAVE.PHOTO.SUCCESS`). The shape is required for localization-prep — it lets a future i18n migration walk the tree mechanically and emit one key per leaf without renaming. Never use flat keys like `DELETE_FAILED` or `PHOTO_SUCCESS`. Re-export from the module's `constants/index.ts` barrel. Consumers import the `TOAST` object and reference the nested field when calling `success`/`error`.

   **Flat-key exceptions** (no outcome axis):
   - `TOAST.<FEATURE>.LOADING` — a single in-flight string with no success/failure twin.
   - `TOAST.COMPOSER.<REASON>` — multiple distinct error reasons that aren't outcomes of one action (e.g. `MAX_FILES`, `MAX_VIDEO_DURATION`, `UNSUPPORTED_FILE`). Treat the reason as the leaf.

3. **Mutations: wrap `mutateAsync` in try/catch, fire the right toast in each branch.** Do not rely on React Query's `onError` alone — the feature-level try/catch keeps outcome handling adjacent to the navigation/state it controls.

4. **Dialogs vs toasts.** Use `useConfirmContext().info({ title, content })` for blocking feedback that needs user acknowledgement (inappropriate image uploads, destructive confirmations). Use `useNotifications()` for non-blocking background toasts.

5. **`useImageUpload` already uses `ConfirmContext` internally** for 403 / generic upload errors — do not add a duplicate toast for upload failures; it will double-fire.

See: `src/v4/chat/constants/toast.ts`, `src/v4/chat/features/group/create/hooks/useCreateGroupChat.ts`, `src/v4/core/providers/NotificationProvider.tsx`

---

## Alert dialogs — `useConfirmContext()` + `ALERT` constants

Use `useConfirmContext()` from `~/v4/core/providers/ConfirmProvider` for all blocking/acknowledgement dialogs. The API has two methods:

- `confirm({ title, content, okText, cancelText, okButtonColor, onOk, onCancel })` — two-button dialog for destructive / reversible actions. Pass `okButtonColor: 'alert'` for destructive confirms (Leave, Delete, Discard).
- `info({ title, content })` — single-button "OK" acknowledgement for error states the user must read before continuing (Upload failed, Unsupported file, Member limit reached).

Rules:

1. **Messages live in `<module>/constants/alert.ts` under an `ALERT` namespace.** Shape: `ALERT.<FEATURE>.<ACTION>.{TITLE, CONTENT, CONFIRM?, CANCEL?}`. Re-export from `<module>/constants/index.ts`. Consumers import `ALERT` and reference the nested field at the call site — no inline strings.

2. **Unsaved-changes guard.** Any "close / back" handler on a form-owning page checks `form.formState.isDirty` first. If dirty, fire `confirm(...)` with `okButtonColor: 'alert'`, wiring `onOk: pop`; if clean, call `pop()` directly.

3. **Validation dialogs fire from the hook, not the UI.** When a Controller-bound input needs to reject a value (over member limit, unsupported image type, file too large), route the Controller's `onChange` through a hook-owned setter that does the guard + `info(...)` + `form.setValue(..., { shouldValidate: true, shouldDirty: true })`. The UI never calls `info`/`confirm` directly for form validation.

4. **Zod schema mirrors the runtime guard.** If the dialog says "max 99", the schema must carry `.max(99)` so `formState.isValid` agrees with the runtime behaviour. Pull the limit from a constants file so both stay in sync.

5. **File-type / size validation happens before upload.** In custom file inputs (AvatarPicker, CoverImage, etc.) check `file.type` against an `ACCEPTED_TYPES` constant and `file.size` against a `MAX_FILE_SIZE` constant before calling `uploadSingleImage`. Fire `info(...)` with the corresponding `ALERT.*.UNSUPPORTED_IMAGE_TYPE` / `ALERT.*.FILE_TOO_LARGE` entry, and call `removeDrawerData()` first if the picker is mounted inside a mobile drawer (so the drawer closes before the alert appears).

See: `src/v4/chat/constants/alert.ts`, `src/v4/chat/features/group/create/hooks/useCreateGroupChat.ts` (LEAVE_WITHOUT_FINISHING), `src/v4/chat/features/group/create/components/AvatarPicker/AvatarPicker.tsx` (UNSUPPORTED_IMAGE_TYPE), `src/v4/chat/features/group/select-member/hooks/useSelectGroupMember.ts` (MEMBER_LIMIT_REACHED), `src/v4/social/hooks/useImageUpload.ts` (UPLOAD_FAILED / INAPPROPRIATE_IMAGE).

---

## Banners — `BANNER` constants, parallel shape to TOAST

Use banner components (e.g. `MutedBanner`, `ConnectionBanner`) for persistent in-page status strips that aren't dismissible toasts and aren't blocking dialogs. Banner copy lives in `<module>/constants/banner.ts` under a `BANNER` namespace.

Rules:

1. **Shape mirrors `TOAST` for consistency: `BANNER.<FEATURE>.<ACTION>.<VARIANT>`.** Examples: `BANNER.CHAT.MUTE.USER`, `BANNER.CHAT.MUTE.CHANNEL`. Never flat (`USER_MUTED` is wrong — it's `MUTE.USER`). The `<VARIANT>` axis describes which subject the banner applies to, paralleling how `<OUTCOME>` works for toasts.
2. **Re-export from `<module>/constants/index.ts`.** Consumers import `BANNER` and reference the nested field — never inline strings.
3. **No banner-rendering primitive in core.** Each module defines its own banner component (e.g. `src/v4/chat/features/shared/components/MutedBanner/`) and consumes the strings from `BANNER`. Don't introduce a generic `<Banner />` in `core/components/` without a discussion — the visual language of banners is feature-specific.

See: `src/v4/chat/constants/banner.ts`, `src/v4/chat/features/shared/components/MutedBanner/MutedBanner.tsx`.

---

## Inline body strings — `TEXT` constants

When a component renders a hardcoded string **inside its own body** (not via a toast / banner / alert / button label), the string still goes into a constants file — never inline JSX. The namespace is `TEXT`.

Rules:

1. **File location: `<module>/constants/text.ts`.** Re-export from `<module>/constants/index.ts`.
2. **Shape: `TEXT.<FEATURE>.<KIND>.{TITLE, SUBTITLE, ...}`.** Use `KIND` to describe what the strings render — e.g. `TEXT.PREVIEW.UNAVAILABLE.{TITLE, SUBTITLE}` for a link-preview failure card, `TEXT.EMPTY.<STATE>.{TITLE, SUBTITLE}` for empty-state placeholders. Leaf keys mirror the visual parts (`TITLE` / `SUBTITLE` / `BODY`), the same pattern `ALERT` uses for dialog parts.
3. **Use `TEXT` only for component-rendered body strings.** Don't put toast / banner / dialog copy here — those have their own namespaces. Don't put button labels here either — buttons usually take their label as a prop and the consumer supplies it from a more specific namespace.
4. **Localization-prep rationale.** All of `TOAST`, `BANNER`, `ALERT`, and `TEXT` follow the same nested shape so a future i18n pass can flatten every leaf into a single keyspace mechanically. No string survives inline at a call site, no namespace survives flat — the convention pays for itself when localization arrives.

See: `src/v4/chat/constants/text.ts`, `src/v4/chat/features/shared/components/MessageLinkPreview/MessageLinkPreview.tsx`.

---

## Localization — `useString` / `resolveString` / `en.json`

All NEW visible strings flow through the localization layer instead of the legacy `TOAST` / `ALERT` / `BANNER` / `TEXT` constants files. Existing constants stay where they are; don't migrate unless the surrounding feature is being rewritten.

Rules:

1. **Catalog lives in `src/v4/core/localization/defaults/en.json`.** Keys follow `amity_<area>_<topic>_<purpose>` (e.g. `amity_chat_dm_block_user_title`, `amity_chat_blocked_message`, `amity_chat_member_action_mute`). Many keys are pre-allocated as empty strings (`""`) — populate those before adding new ones.

2. **Don't add net-new l10n keys without surfacing the gap to the user first.** Workflow when a string is needed:
   - Grep `en.json` for empty pre-allocated keys whose name matches the surface (`grep -nE '"amity_chat_<verb>_'`). Many keys ship empty waiting to be populated.
   - If a close match exists (even if the name isn't a perfect description), reuse it. The user owns the namespace; finding a similar existing key beats inventing a new one.
   - If no match exists, list the proposed key + value to the user and wait for approval. Never invent keys silently.

3. **`useString(key, ...args)` in render, `resolveString(key, ...args)` in callbacks.**
   - `useString('amity_chat_dm_action_block_user')` inside a component body — re-renders on language change.
   - `resolveString('amity_chat_block_success')` inside an `onSuccess` / `onError` / `onPress` callback fired outside the render cycle (e.g. inside a `useMutation` config or a `useConfirmContext().confirm({ ... })` callback). The toast / dialog fires once; `resolveString` reads the current value at fire time.

4. **Dynamic interpolation uses `%s` (and `%d`), not `{0}` or `{name}`.** Catalog stores e.g. `"amity_chat_dm_block_user_message": "%s won't be able to send you the message. They won't be notified that you've blocked them."`. Call sites pass the value as a positional arg: `resolveString('amity_chat_dm_block_user_message', displayName)`. The formatter (`applyFormat` in `core/localization/resolveString.ts`) substitutes left-to-right, matching iOS / Android conventions. Multiple placeholders → multiple args.

5. **Reuse canonical keys for shared labels.** A "Cancel" button uses `amity_chat_cancel`; a "Confirm" button uses the equivalent canonical key. Don't define per-feature variants of the same word — search before adding.

6. **When a new key IS unavoidable, mirror nearby populated siblings.** Examples: confirm-button keys follow `amity_chat_<verb>_confirm_button` (parallels populated `amity_chat_unban_confirm_button`); DM failure-toast keys follow `amity_chat_dm_toast_<verb>_failed` (parallels `_mute_failed` / `_unmute_failed`).

7. **`Query` hooks resolve strings inside `onSuccess` / `onError`.** Toast content uses `resolveString` because the toast fires from a React Query callback, not render. Same for `useConfirmContext().confirm({ title, content, okText, cancelText, ... })` — every visible string is `resolveString(...)`.

8. **Preserve `TOAST` / `ALERT` / `BANNER` / `TEXT` constants for prior phases.** They remain the convention for legacy code paths. New features should NOT add to them; populate `en.json` keys instead. Do not silently migrate older constants either — that's a separate, scoped refactor.

See: `src/v4/core/localization/index.ts`, `src/v4/core/localization/defaults/en.json`, `src/v4/chat/hooks/queries/useUserBlockQuery.ts` (Query hook with all l10n via `resolveString`), `src/v4/chat/features/conversation/chat/hooks/useConversationActions.tsx` (mixed: `useString` labels in render, `resolveString` for confirm-dialog content).

---

## Styling

- CSS Modules only (`.module.css` per component)
- Theme tokens use `--asc-` prefix CSS variables — never hardcode color values
- **Background color**: use `var(--asc-color-background-default)` — not `var(--asc-color-base-background)`
- **Icon tints — set both `color` AND `fill`**. Every CSS rule that tints an icon glyph must pair the two, either to a named token or to `currentColor`. Icons in `~/v4/icons/*` are a mix of stroke-based (driven by `color`/`currentColor`) and solid-fill SVGs (driven by `fill`); setting only one of the two leaves the second kind rendered in the wrong color. Example:
  ```css
  .foo__icon {
    color: var(--asc-color-base-shade1);
    fill: var(--asc-color-base-shade1);
  }
  ```
- **Use `rem` for all length values** — never `px`. 1rem = 16px (e.g. 8px → 0.5rem, 12px → 0.75rem, 16px → 1rem, 24px → 1.5rem, 32px → 2rem). Update existing files to rem when touched.
- No inline styles except dynamic values (e.g. `style={themeStyles}` from `useAmityPage`)
- **No comments in CSS files**
- **CSS class naming — BEM-like**: `.componentName` for root, `.componentName__child` for child elements
- **Conditional styles — use data attributes**: apply variants via `data-*` attributes and style them in CSS with `[data-x='y']` selectors. Never use `clsx` with conditional class name strings.

---

## Sticky headers and tab bars

Use `position: sticky` (not `position: fixed`) — sticky stays in document flow and needs no padding compensation on the content below.

Pattern for pages with a sticky header + sticky chip tab bar:

1. Feature root defines a CSS custom property for header height on its root class (e.g. `--chat-home-header-height`, `--create-conversation-header-height`). Include **every** sticky band in the value: AppBar row + search bar + tab bar, etc. Empty states below use this var to centre inside the remaining viewport: `min-height: calc(100svh - var(--...-header-height, fallback))`.
2. Header gets `position: sticky; top: 0; z-index: 10; background: var(--asc-color-background-default)`. If the header owns multiple bands (AppBar + search input), wrap them in one `<header>` with `flex-direction: column` so the whole block sticks as a single unit — no per-band sticky coordination needed.
3. Chip tab list gets `position: sticky; top: var(--chat-home-header-height); z-index: 9; background: var(--asc-color-background-default)`.
4. Eliminate the gap between header and tab bar by overriding `gap: 0` on the Tabs wrapper via `className`.
5. **No `overflow: hidden` on any ancestor** — sticky requires a scrollable ancestor (the page/window).
6. **Do not wrap the feature root in `display: flex; flex-direction: column; min-height: 100svh` with a flex-grow list child** — this breaks sticky on long pages once pagination extends content past the first viewport. Use plain document flow: feature root is a plain block, sticky elements stick to the page/window. See the `ChatHome` and `CreateConversation` roots — both are plain blocks.

See: `src/v4/chat/features/home/ChatHome.module.css`, `src/v4/chat/features/home/components/Header/Header.module.css`, `src/v4/chat/features/conversation/create/CreateConversation.module.css`, `src/v4/chat/features/conversation/create/components/Header/Header.module.css`

---

## TypeScript

- Use `type` for all type declarations — never `interface`
- Do not import `React` unless it is explicitly referenced (e.g. `React.forwardRef`, `React.createElement`). The project uses the new JSX transform — JSX works without importing React.
- When the SDK type you need isn't directly exported from the namespace, derive it from a field: e.g. `Amity.Channel['messagePreview']` instead of `Amity.MessagePreview`

---

## Text — always use Typography

Use the `Typography` component from `~/v4/core/components/Typography/Typography` for all visible text. Never use raw `<span>`, `<p>`, or `<h*>` elements for user-facing text.

Available sub-components: `Typography.Headline`, `Typography.TitleBold`, `Typography.Title`, `Typography.BodyBold`, `Typography.Body`, `Typography.CaptionBold`, `Typography.Caption`, `Typography.CaptionSmall`

---

## Component Folder Structure

Each component lives in its own folder. Component-local hooks go in a `hooks/` subfolder inside the component. **Every folder must have a barrel `index.ts`** — this applies to all folders without exception: components, features, elements, hooks, utils, providers, constants, etc. The feature root (`features/<feature>/`) also needs a barrel, and when a feature groups multiple sub-features (e.g. `features/conversation/create/`), the parent folder re-exports with `export * from './<sub-feature>'`.

See: `src/v4/chat/features/home/components/ChannelItem/` for a component example, `src/v4/chat/features/conversation/index.ts` for a grouped-feature barrel.

---

## Naming — `Amity` prefix

- Internal components, pages, and hooks use plain names — no `Amity` prefix (e.g. `ChatHomePage`, `ChatHome`)
- The `Amity` prefix is applied **only** in `src/index.ts` as a re-export alias (e.g. `export { ChatHomePage as AmityChatHomePage }`)
- Module-level barrels (`src/v4/<module>/pages/index.ts`) also export without the prefix

---

## Page / Application pattern

Three-layer architecture: `Application` → `Page` → `Feature`

- `pages/Application/Application.tsx` — wraps with the module's navigation provider; renders page-layer components conditionally using `currentPage.type === PageTypes.X && <XPage />` inline (no switch, no sub-components)
- `pages/PageName/PageName.tsx` — **thin page layer**: calls `useAmityPage({ pageId })`, passes `themeStyles` and `accessibilityId` to the wrapper div, renders the feature root. No business logic, no state, no CSS module.
- `features/<feature>/<Feature>.tsx` — **feature root**: owns layout, business logic, state, navigation pushes, and CSS variable scope. Renders sub-components.

### Page props are the canonical shape — reuse, don't duplicate

Every `PageName.tsx` exports its prop type (`export type PageNameProps = { ... }`) and re-exports it from the page barrel. Consumers downstream reuse that single type instead of re-declaring structurally-identical shapes:

- **Navigation provider** — each page entry's `context` field is typed as the page's `*Props` type (e.g. `{ type: ChatPageTypes.SelectGroupMemberPage; context?: SelectGroupMemberPageProps }`). This guarantees `push({ type, context })` stays in lockstep with the page's actual prop surface — rename a prop on the page and every push-site breaks at the type level.
- **Feature root** — `features/<feature>/<Feature>.tsx` imports the page-props type and consumes it directly (`export function SelectGroupMember(props: SelectGroupMemberPageProps)`). No separate `SelectGroupMemberProps` type.
- **Feature-local hook** — `use<Feature>` also takes the same `*PageProps` type as its params. One canonical prop shape flows Page → Feature → Hook.

Prop-naming matches Flutter for the public page surface (e.g. `selectedGroupMember`, `selectedUsers`) — internal component/hook names follow the same canonical type, so React-internal plumbing also reads with Flutter-parity names.

See: `src/v4/chat/pages/Application/Application.tsx`, `src/v4/chat/pages/SelectGroupMemberPage/SelectGroupMemberPage.tsx` (exports `SelectGroupMemberPageProps`), `src/v4/chat/providers/ChatNavigationProvider.tsx` (re-uses it for nav context), `src/v4/chat/features/group/select-member/SelectGroupMember.tsx` + `hooks/useSelectGroupMember.ts` (both consume `SelectGroupMemberPageProps`).

---

## Reusable Elements — always extract shared styles

When the same visual style appears in **2 or more places**, extract it into a reusable element under `src/v4/<module>/elements/<ElementName>/` **before** duplicating CSS inline. Check that folder first before writing a new button / badge / pill / chip / bubble.

Every reusable element ships with four files: `ElementName.tsx`, `ElementName.module.css`, `ElementName.stories.tsx` (required), `index.ts`.

Rules:

- **Clickable elements use `Button` from `~/v4/core/components/AriaButton/Button`** — not the native `<button>` and not directly from `react-aria-components`. Use `onPress` (not `onClick`), `isDisabled` (not `disabled`).
- **Forward refs** with `forwardRef` so the element can be used as a Popover trigger, menu anchor, etc.
- Icon-bearing elements take a **variant key** (e.g. `icon: 'plus' | 'add-user'`) and map it to SVG components internally — consumers never import icons directly into a reusable.
- Re-export the `type` union alongside the component from `index.ts`.

See: `src/v4/chat/elements/IconButton/IconButton.tsx`, `src/v4/chat/elements/IconButton/IconButton.stories.tsx`

---

## Storybook

A `ComponentName.stories.tsx` file is required alongside:

- Every Application entry and page
- Every reusable element under `<module>/elements/`

For elements with variants, expose a `control: 'select'` on the variant prop plus one story per meaningful variant (each icon, each size, disabled state).

See: `src/v4/chat/pages/Application/Application.stories.tsx`, `src/v4/chat/pages/ChatHomePage/ChatHomePage.stories.tsx`, `src/v4/chat/elements/IconButton/IconButton.stories.tsx`

---

## File Locations

| Type                    | Location                                                        |
| ----------------------- | --------------------------------------------------------------- |
| Navigation entry        | `src/v4/<module>/pages/Application/`                           |
| Pages                   | `src/v4/<module>/pages/PageName/`                              |
| Feature root            | `src/v4/<module>/features/<feature>/<Feature>.tsx`             |
| Feature components      | `src/v4/<module>/features/<feature>/components/ComponentName/` |
| Feature-local elements  | `src/v4/<module>/features/<feature>/elements/ElementName/`     |
| Shared module elements  | `src/v4/<module>/elements/ElementName/`                        |
| Component-local hooks   | `src/v4/<module>/features/<feature>/components/ComponentName/hooks/` |
| Feature-local hooks     | `src/v4/<module>/features/<feature>/hooks/`                    |
| Feature-local utils     | `src/v4/<module>/features/<feature>/utils/`                    |
| Feature-local constants | `src/v4/<module>/features/<feature>/constants/`                |
| Shared module hooks     | `src/v4/<module>/hooks/`                                       |
| Live-object hooks       | `src/v4/<module>/hooks/objects/` (suffix: `Object`)            |
| Collection hooks        | `src/v4/<module>/hooks/collections/` (suffix: `Collection`)    |
| Query / mutation hooks  | `src/v4/<module>/hooks/queries/` (suffix: `Query`)             |
| Shared module utils     | `src/v4/<module>/utils/`                                       |
| Providers               | `src/v4/<module>/providers/`                                   |
| Shared module constants | `src/v4/<module>/constants/`                                   |

Placement guide:

- If the element is used by **one feature**, keep it feature-local: `features/<feature>/elements/`.
- If it is (or is likely to be) used by **multiple features** in the same module, hoist it to `<module>/elements/`.
- Same rule applies to hooks, utils, and constants: feature-local by default, hoist to module level only when shared.

Constants pattern:

- Put each constant in `features/<feature>/constants/index.ts` with an `UPPER_SNAKE_CASE` name that's descriptive on import (`GROUP_NAME_MAX_LENGTH`, not just `MAX_LENGTH`). Multiple constants for the same feature share the file.
- Never hardcode magic numbers directly in components, schemas, or hooks — extract to the constants module and import. This keeps `zod` schema `.max(100)` and a component's `maxLength={100}` consistent, enforced by a single source.
- See: `src/v4/chat/features/group/create/constants/index.ts`, consumed by `GroupNameField.tsx` + `useCreateGroupChat.ts`.

---

## Debugging regressions — root-cause-first workflow

When the user reports something that "used to work" and now doesn't (popover not opening, scroll jumping, focus stolen, click swallowed, etc.), do **not** start patching files. Follow this loop in order. The Iron Law: **no fixes until Phase 1 is done.**

### Phase 1 — Define the regression boundary

1. **Anchor the symptom in working state.** Ask (or confirm) which commit / branch the user last saw it working in. The answer "previous commit was fine, broken after these uncommitted changes" is the most useful evidence you can get — it scopes the suspect surface to the working-tree diff.
2. **Run the diff, not your memory.** `git status` then `git diff HEAD -- <suspect-paths>` for each touched file. Don't reason from `Read` snapshots taken earlier in the session — the user may have edited the file since (this happened in the message-reaction popover bug: the `Read` cache showed a wrapper div that no longer existed, sending the investigation down a dead path). Re-read or re-diff before drawing conclusions.
3. **Categorize each change** as: (a) pure addition (new file, new prop accepted but unused), (b) refactor (same behavior, different shape), (c) behavioral change (different render output, new component mounted, new effect). Behavioral changes are your suspect set — additions and pure refactors rarely cause regressions on their own.

### Phase 2 — Trace the user-visible flow end-to-end

Walk the event from the DOM event that *triggers* the symptom up to the React state that *produces* the symptom. Don't skip layers. For the popover-not-showing class of bug:

1. **Event source** — what fires the trigger? (`useLongPress` on `MessageBubble.tsx` → `onLongPress` callback)
2. **Callback wiring** — what does the callback call, and is it actually wired? (`onLongPress` is passed from `MessageList.tsx` → comes from `useChatMessage` → wraps `openBubbleMenu` from `useBubbleMenu`)
3. **State change** — does the state setter run, and does the new state render? (`openBubbleMenu` does `setBubbleMenu({ message, anchor })`; the consumer renders `bubbleMenu && <Popover ... />`)
4. **Render output** — what JSX actually mounts when the state is set? (`<MessageReactionPickerPopover>` + `<MessageActionsPopover>` siblings, both anchored to the same element)
5. **Library behavior** — what does the underlying primitive do with that JSX? (read the library source — `react-aria-components/dist/Popover.mjs` — to see exactly what gets rendered into the DOM)

Each step is a candidate failure point. Naming them out loud forces you to verify each one instead of jumping to the layer that "feels" suspicious.

### Phase 3 — Read the library source when the symptom is library-shaped

Symptoms like "popover doesn't show", "focus jumps", "click goes through", "two overlays fight" almost always trace back to a library invariant being violated. The library source under `node_modules/<lib>/dist/` is the source of truth — JSDoc and Stack Overflow are not. Pattern:

1. `find node_modules/<lib>/dist -name "<Component>*"` — locate the compiled module.
2. Read the render body. Look for: portals (`Overlay`, `createPortal`), conditional underlay/scrim divs, focus-scope mounts, `state.close()` callers, default prop values.
3. Walk the props you're passing through the library's branch logic. The popover bug surfaced this way: reading `Popover.mjs:94` showed `!props.isNonModal && state.isOpen && createElement('div', { ... position: 'fixed', inset: 0 })` — every modal popover injects a full-viewport underlay. Two popovers + same trigger = two stacked underlays + cross-dismiss via shared `onDismiss`.

If the library renders something you didn't expect (an extra wrapper, an extra portal, a focus trap), you've found the regression boundary inside the library — now you can decide whether to (a) change which props you pass, (b) restructure your JSX to satisfy the library's expectations, or (c) collapse the two consumers into one.

### Phase 4 — Form a single-sentence hypothesis, then verify before fixing

State the hypothesis in one sentence: _"X causes Y because Z."_ For the popover bug: _"Rendering two `<Popover>` siblings with default `isNonModal=false` and the same `onDismiss` causes the second underlay to cover the first popover's content and click-through dismisses both via the shared handler."_

Verify before patching:

- **Cheap verification** — re-read the library source path you cited (line numbers stay stable within a version); confirm the prop/branch you blamed actually exists in the installed version (`cat node_modules/<lib>/package.json | grep version`).
- **Mid verification** — temporarily comment out the suspect addition (e.g. remove the second `<Popover>`) and ask the user to confirm the original symptom returns to "works".
- **Expensive verification** — add scoped `console.log` at each phase-2 layer; ask the user which logs fire. Use this only when phases 1–3 didn't narrow it down.

Don't patch until the hypothesis names the *exact* line / prop / wiring that's wrong. "Something with the popover" is not a hypothesis.

### Phase 5 — Present 1–2 fix options to the user, don't auto-apply

When the regression is in the user's own code (not a library bug), offer 1 or 2 fix options labeled by tradeoff, and **wait for the user to pick** before editing. Format:

1. **Option 1 (recommended)** — the fix that addresses the root cause. State why it's the structural fix.
2. **Option 2 (band-aid)** — a smaller change that hides the symptom. State the trade-off (what stays broken, what re-emerges later).

Recommend option 1 by default. Use option 2 only when the user is under time pressure and explicitly asks for the cheapest possible patch. The popover bug example: option 1 was "combine both popovers into one Dialog inside one `<Popover>`" (collapses the two-overlay problem at the root); option 2 was "pass `isNonModal` to the picker so it stops rendering an underlay" (stops the immediate collision but leaves two independent popovers fighting for placement around the same anchor).

### Red flags — stop and restart Phase 1 if you catch yourself doing any of these

- Proposing a fix before you can name the line in library source or user code that's wrong.
- Reading a file from earlier in the session instead of re-diffing.
- Reasoning from "I think this is probably…" without having traced the event flow.
- Adding console logs as the first action (logs are a Phase-4 verification tool, not a Phase-1 investigation tool).
- Editing more than one file before the user has agreed to the fix approach.
- Trying a second fix on top of a failed first fix without re-running Phase 1.

If three patch attempts have failed, the architecture is wrong, not the patch — stop and discuss with the user before attempting a fourth.

---

## Git — branch and commit message conventions

Every piece of work tied to a Jira ticket follows this convention. Apply it for every branch you create and every commit you make.

### Branch names

Format: `<type>/<TICKET-ID>`

- `<type>` is `feat` for feature tickets, `fix` for bug-fix tickets. Match the Jira ticket type, not your guess.
- `<TICKET-ID>` is the bare Jira key (e.g. `PDT-2492`) — no description suffix.
- **No Jira ticket?** Use `PDT-0000` as the placeholder ticket id (e.g. `feat/PDT-0000`, `fix/PDT-0000`) and decide `<type>` from the nature of the work.

Examples:

- Feature ticket PDT-2492 → `feat/PDT-2492`
- Bug ticket PDT-3017 → `fix/PDT-3017`
- No ticket, ad-hoc feature work → `feat/PDT-0000`
- No ticket, ad-hoc bug fix → `fix/PDT-0000`

Never include the ticket title, the phase number, or any free-form description in the branch name. The ticket key (or `PDT-0000` placeholder) is the canonical identifier; everything else is in the commit message and PR description.

### Commit messages

Format: `<type>(<scope>): <ticket title>`

- `<type>` matches the branch type (`feat` / `fix`). Conventional Commits is enforced repo-wide via ESLint, so the type must be one of the allowed verbs.
- `<scope>` is the affected module — `chat`, `social`, `core`, `icons`, etc. Single scope; never plural.
- `<ticket title>` is the **Jira ticket title verbatim**, with the platform prefix stripped. The Jira ticket title is the source of truth — do not paraphrase, do not rename, do not append the phase number.

**Strip platform prefixes from the ticket title.** Tickets that span multiple UIKits typically open with a bracketed prefix like `[React UIKit v.4]`, `[Flutter UIKit]`, `[iOS UIKit]`. Drop that prefix when porting the title into the commit message — the repo itself identifies the platform.

Examples:

- Jira ticket `[React UIKit v.4] Copy Message` → `feat(chat): copy message`
- Jira ticket `[React UIKit v.4] Edit Message` → `feat(chat): edit message`
- Jira ticket `[React UIKit v.4] Fix message bubble overflow` → `fix(chat): message bubble overflow`

The title is lowercased to match Conventional Commits; everything else (including word order) stays as the ticket reads.

### One commit per phase / ticket by default

Stage and commit everything for a phase as a single atomic commit. Per-task commits are only used when the user explicitly asks for them. The pre-commit hook (`lint-staged` → `eslint --fix`) runs automatically — if it modifies files, those modifications go into the same commit (let the hook finish, do not amend).

---

## Pull Requests — title, body, reviewers, base

PR conventions diverge from commit conventions. Follow these exactly when opening a PR via `gh pr create`.

### Title format

`<type>: PDT-NNNN - <feature name>`

- `<type>` is `feat` / `fix` (no scope, no parentheses — different from the commit message).
- `PDT-NNNN` is the bare ticket key, surrounded by spaces and a hyphen.
- `<feature name>` is the human-readable feature, lowercase first word, free-form (does **not** have to match the Jira title verbatim — paraphrase to read naturally).

Examples:

- `feat: PDT-2483 - report and unreport messages`
- `fix: PDT-3017 - message bubble overflow on long urls`
- `feat: PDT-0000 - storybook for menu skeleton`

This is **not** Conventional Commits format. Don't write `feat(chat):` in PR titles — that's commit-only.

### Body — follow `.github/pull_request_template.md`

The repo has a PR template. Read it before creating the PR (`.github/pull_request_template.md`) and fill every section. As of this writing the template is:

```
**Jira ticket :**

-

**Description :**

-

**Check lists :**

- [ ] Test code
- [ ] Build local pass (optional)
- [ ] Code is the same level as origin/develop branch

**Screen shot :**


**Note (optional) :**
```

Filling rules:

- **Jira ticket** — full URL: `[PDT-NNNN](https://ekoapp.atlassian.net/browse/PDT-NNNN)`. Always linked, never bare key.
- **Description** — bulleted list of what this PR does. Group by area (e.g. main feature, then "Side fixes discovered during QA"). One bullet per logical change.
- **Check lists** — tick `[x]` only the boxes that genuinely apply. Don't tick "Test code" if no tests were added (the repo's testing culture is Storybook-first per CLAUDE.md). "Build local pass" gets ticked when `pnpm tsc` and `pnpm lint` are clean for touched files. "Same level as origin/develop" means the branch is current with develop or its base; tick only if true.
- **Screen shot** — leave blank when running headless. Tell the user to attach screenshots themselves via the GitHub UI before requesting review.
- **Note** — anything that doesn't fit description: stacking notes ("Stacked on `feat/PDT-XXXX-phase-N-...`"), explicit out-of-scope items per spec, breaking-change callouts.

Pass the body to `gh pr create --body "$(cat <<'EOF' ... EOF)"` so backticks and special chars survive verbatim.

### Base branch — stacked PRs are normal

In multi-phase work, a phase's PR base is the **previous phase's branch**, not `main` or `develop`. The chat-v4 work (PDT-2296) is the integration branch for all chat phases. Each phase stacks on the previous one:

```
develop
└── feat/PDT-2296-chat-v4 (integration)
    └── feat/PDT-2489-phase-6-preview-link
        └── feat/PDT-2483-phase-4-report-message  ← this PR
            └── feat/PDT-NNNN-phase-N-next        ← next PR
```

Pass `--base <previous-phase-branch>` to `gh pr create`. Confirm with the user which base if there's any ambiguity. To re-target after creating: `gh pr edit <num> --base <branch>`.

### Reviewers — login pitfalls

GitHub reviewer logins in this repo do **not** match the obvious guesses. Always verify before requesting:

- `chayanitbm` → wrong. Correct: **`ChayanitBm`** (capital `B`, capital `M`).
- `pichaya-sp` → wrong. Correct: **`pitchaya-sp`** (with the `t`).
- `copilot` → wrong. Correct: **`copilot-swe-agent`** (this repo's Copilot bot).

If a reviewer the user names doesn't resolve, list candidates from the repo's assignees / suggested actors:

```bash
# Find a user reviewer (case-sensitive, partial match)
gh api 'repos/AmityCo/Amity-Social-Cloud-UIKit-Web/assignees?per_page=100' --paginate \
  | python3 -c 'import sys,json; [print(n["login"]) for n in json.load(sys.stdin) if "<partial>" in n["login"].lower()]'

# Find bot reviewers (Copilot, etc.)
gh api graphql -f query='query { repository(owner:"AmityCo", name:"Amity-Social-Cloud-UIKit-Web") { suggestedActors(capabilities: [CAN_BE_ASSIGNED], first: 100) { nodes { ... on Bot { login id } } } } }'
```

### Adding human reviewers

```bash
gh pr edit <pr-num> --add-reviewer ChayanitBm,pitchaya-sp
```

Or at create time: `--reviewer ChayanitBm,pitchaya-sp`.

### Adding Copilot — must use GraphQL `botIds`

`gh pr edit --add-reviewer copilot-swe-agent` returns success silently but does **not** add the bot. The REST endpoint `pulls/:n/requested_reviewers` rejects bots with "not a collaborator" (HTTP 422). The only working path is the GraphQL `requestReviews` mutation with `botIds`:

```bash
PR_ID=$(gh api graphql -f query='query { repository(owner:"AmityCo", name:"Amity-Social-Cloud-UIKit-Web") { pullRequest(number: <pr-num>) { id } } }' --jq '.data.repository.pullRequest.id')

COPILOT_ID=$(gh api graphql -f query='query { repository(owner:"AmityCo", name:"Amity-Social-Cloud-UIKit-Web") { suggestedActors(capabilities: [CAN_BE_ASSIGNED], first: 100) { nodes { ... on Bot { login id } } } } }' --jq '.data.repository.suggestedActors.nodes[] | select(.login=="copilot-swe-agent") | .id')

gh api graphql -f query="mutation { requestReviews(input: {pullRequestId: \"$PR_ID\", botIds: [\"$COPILOT_ID\"], union: true}) { pullRequest { reviewRequests(first:10) { nodes { requestedReviewer { ... on User { login } ... on Bot { login } } } } } } }"
```

The mutation returns success even when Copilot review is **not enabled** for the repo/org — verify by reading back `reviewRequests` after. If Copilot doesn't appear, the org/repo lacks Copilot review entitlement; tell the user and don't keep retrying.

### Assignee — always the implementer

`--assignee <github-login>` (e.g. `--assignee htutwaiphyoe`). Confirm with the user; default to "I'll assign you" when in doubt.

### Full create command template

```bash
gh pr create \
  --base <previous-phase-branch> \
  --head <feature-branch> \
  --title "feat: PDT-NNNN - <feature name>" \
  --assignee <user> \
  --reviewer ChayanitBm,pitchaya-sp \
  --body "$(cat <<'EOF'
**Jira ticket :**

- [PDT-NNNN](https://ekoapp.atlassian.net/browse/PDT-NNNN)

**Description :**

- <bullet 1>
- <bullet 2>

**Check lists :**

- [x] Test code
- [x] Build local pass (optional)
- [x] Code is the same level as origin/develop branch

**Screen shot :**


**Note (optional) :**

- Stacked on `<base-branch>`.
EOF
)"
```

Then add Copilot via the GraphQL block above (separate step).
