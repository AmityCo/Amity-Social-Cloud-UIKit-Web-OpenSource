---
name: chat-implementation-plan
description: Use to take a chat-milestone phase from Flutter parity + Figma screens to a written specification, an implementation plan, and an executed phase. Three sequential stages — Stage 1 produces the spec, Stage 2 produces the plan, Stage 3 executes the plan in code. Run only after the user names the phase to work on.
---

# Chat Implementation Plan

This skill turns a single phase of a chat milestone from "Flutter
parity plus Figma references" into a shipped phase. It runs in three
sequential stages, each gated on user approval before moving forward:

| Stage | Output | When |
|---|---|---|
| 1 — Flutter Chat Functionality Specification | `.claude/specs/chat-milestone-<N>.md` (appended) | After the user names the phase + provides Figma URLs |
| 2 — Web Chat Implementation Plan | `.claude/plans/chat-milestone-<N>.md` (appended) | After the user approves the spec |
| 3 — Web Chat Implementation Execution | Source-code changes for the phase | After the user approves the plan |

**Never skip ahead.** The user reviews and approves at every stage
gate. Don't begin Stage 2 until the spec is approved; don't begin
Stage 3 until the plan is approved.

## When to use

The user names a phase, e.g. *"let's do phase 3 — edit message"*, and
points at:

- The Flutter v4 chat module
  (`Amity-Social-Cloud-UIKit-Flutter/lib/v4/chat/`).
- One or more Figma `figma.com/design/…` URLs for the feature.
- The target milestone document
  (`.claude/specs/chat-milestone-<N>.md`,
  `.claude/plans/chat-milestone-<N>.md`).

Also use this skill when the user says *"continue the next phase"*
and the milestone is established. **Do not** invoke during free-form
brainstorming — the spec/plan/execute pipeline assumes a defined phase
title and a Flutter reference.

---

# Stage 1 — Flutter Chat Functionality Specification

The first stage produces a written functional spec for one phase. The
spec is the contract for Stage 2's plan and Stage 3's code, so getting
it precise — and getting the user to lock the open decisions — is the
whole job here.

## Stage 1 — Inputs required

Before drafting:

1. **Phase title** (e.g. `Phase 3 — Edit Message`). The user names it.
2. **Flutter feature path.** Identify the relevant files under
   `Amity-Social-Cloud-UIKit-Flutter/lib/v4/chat/` for the feature.
   Always include the bloc / state file, the composer or
   message-bubble widget, and the bloc events that reach the SDK. Read
   these at research time — do not defer.
3. **Figma node URLs.** Fetch every URL the user supplied via the
   Figma MCP server. Run all fetches in parallel — they are
   independent and the response set is needed before drafting.
4. **Target spec file.**
   `.claude/specs/chat-milestone-<N>.md`. The spec section is appended
   after the phase's slot in the "Milestone phases" table at the top.
5. **Web-side conventions.** Re-read
   `.claude/skills/feature-implementation/SKILL.md` for the API
   contracts the spec will commit to (live collections / objects /
   queries naming, hook-folder convention, `Menu` primitive, etc.).

## Stage 1 — The four-step research loop

### Step 1.1 — Set up tracking

Use `TodoWrite` to create a four-item todo list:

1. Fetch Figma screens
2. Research Flutter implementation
3. Synthesize findings + ask clarifying questions
4. Append the phase section to the spec file

Mark them in/completed as work progresses. The user expects to see
forward motion.

### Step 1.2 — Fetch Figma in parallel + read Flutter

Run these in a single tool batch:

- `mcp__figma__get_design_context` for each Figma URL the user
  supplied. Don't drop any — even screens that look like duplicates
  often differ in one component state (e.g. send button enabled vs
  disabled, edit panel present vs absent).
- `Read` / `Bash grep` over the Flutter feature path. Look for: bloc
  state fields, bloc events, SDK builder calls (e.g.
  `editTextMessage`, `createMessage`, `delete`), message-bubble
  rendering branches keyed on state.

Take notes inline — extract:

- **Visible states** (Figma): what the UI looks like in each
  permutation.
- **Triggers** (Flutter): what user action transitions the state.
- **SDK contract** (Flutter): which `MessageRepository` /
  `ChannelRepository` call the feature ultimately makes, and what
  payload it sends.
- **Error surfaces** (Flutter): which SDK error codes / messages
  produce which toasts / dialogs / silent failures.
- **Toast behaviour** (Flutter): for **every** save / commit /
  destructive action, open the Flutter page/cubit and answer two
  questions verbatim from the source: (a) does Flutter fire a
  **success toast** after the action completes? (b) does Flutter
  fire a **failure toast** on error? Quote the call site
  (e.g. `BlocProvider.of<AmityToastBloc>().add(AmityToastShort(...))`,
  `ScaffoldMessenger.of(context).showSnackBar(...)`) and the
  l10n key. Common patterns to watch for:

   - **Save-button UX** (most edit pages): success + failure
     toasts after pop. Spec/plan should mirror.
   - **Auto-save / toggle UX** (Figma omits the Save button):
     usually NO success toast — the toggle position IS the
     confirmation. Failure toast only. Don't reflexively add a
     success toast just because the SDK call succeeds.
   - **Destructive action with confirm dialog** (delete, leave
     group): typically silent on success (the row disappears),
     toast on failure.
   - **Silent commit**: some flows (per-message reactions, mark
     as read) fire neither — the visual change IS the feedback.
     Spec only shows toasts for the cases Flutter shows them.

   This was a recurring source of mistakes — spec'ing a success
   toast on an auto-save toggle, or adding a success toast that
   Flutter explicitly doesn't show. Always extract Flutter's
   actual toast call sites at research time; never infer from
   "we usually toast on success".
- **L10n strings** (Flutter): every visible string the feature uses,
  copied verbatim. The spec records them so the web ports them
  identically.
- **Page identity (Flutter)**: the page **class name** (e.g.
  `AmityEditGroupMemberPermissionsPage`,
  `AmityGroupNotificationPreferencePage`) and the **`pageId`
  string** literal (e.g. `'edit_group_member_permissions_page'`,
  `'group_notification_preference_page'`). Quote both verbatim
  from the Flutter file. These flow into the spec's "SDK contract"
  / "Strings" sections AND into the plan's file map. Stage 2 will
  re-cite them — easier to extract once at research time than to
  re-derive later. Common gotchas to watch for: singular vs
  plural (`Permission` vs `Permissions`) and prefix presence
  (`Group` / no prefix).

### Step 1.3 — Synthesize and present findings

Once research is done, write the user a short synthesis: 5–10 lines
covering what Figma shows, what Flutter does, and what is already
covered by previous phases (so the new spec doesn't re-specify).
Then list the **decisions to lock**.

A decision is anything where:

- Figma alone is ambiguous (e.g. send-button enable rule across two
  states).
- Flutter and Figma differ (e.g. Flutter has one toast, Figma shows
  three captions).
- The web SDK shape may differ from Flutter's (e.g.
  `createMessage(uri)` vs `uploadImage` + `createMessage(fileId)`).
- The spec must commit user-visible behaviour but the SDK path is
  not yet known (resolve in Stage 2 plan; the spec defers).
- Phase boundaries are unclear (e.g. mentions, reply previews,
  classification — could go in this phase or another).

For every decision, present **2–3 numbered options** (A/B/C) with
**your recommendation and one-line reasoning**, then ask "Which?".
Use multiple choice — not open-ended — because that's what produces a
crisp lock.

### Step 1.4 — Ask one question at a time

Never bundle questions. The format is:

> **Q1.** <decision title>.
>
> - **A** — <option>.
> - **B** — <option>.
> - **C** — <option>.
>
> My recommendation: **<letter>**. <reason>.
>
> Which?

After the user answers, acknowledge with one line ("Locked: **B** —
…"), then ask Q2. Repeat until all decisions are locked.

This pattern matters: bundling questions d invites the user to skim
and under-specify; one-by-one keeps each decision rigorous.

## Stage 1 — Spec section structure

Append a new `## Phase <K> — <Title>` section to
`.claude/specs/chat-milestone-<N>.md`, immediately before the next
phase's section (or at the end if it's the last). Required
subsections, in order:

1. `### Scope` — what this phase ships, in 1–3 numbered visual /
   behavioural surfaces. Define the gating predicate (e.g. "editable
   only when own + text + synced + not deleted").
2. `### Out of scope (Phase <K>)` — bulleted, with one-line reason
   each. Explicitly defer mentions, classification variants, edit
   history, etc. when the user said so.
3. `### <Surface> — <subtitle>` — one section per visual surface.
   Spec dimensions / colours / typography from Figma where they
   exist; state transitions from Flutter. Use small markdown tables
   for field/value lists where it reads cleaner than prose.
4. `### SDK contract` — name the likely SDK call and parameters.
   Mark unresolved details as "implementation plan to confirm".
5. `### Error handling & feedback` — success path (typically silent)
   plus every error case. Mirror Flutter's handling unless the user
   said otherwise.
6. `### Strings` — table of `key | value`, taken from Flutter l10n
   verbatim where possible.
7. `### Acceptance criteria` — checkbox list. One bullet per visible
   behaviour. Cover the happy path, every error case, and at least
   one negative case ("X never renders for Y").

### Spec writing rules

- **Pin every Figma reference.** Cite the node id (e.g.
  `3763:20320`) next to the visual it specifies.
- **Pin every Flutter reference.** Cite the file path (and line
  range when load-bearing) for the behaviour you copied.
- **Use existing CSS tokens by name** (e.g.
  `var(--asc-color-base-shade4)`, not `#ebecef`). The plan stage
  inherits these.
- **No code in the spec.** Behaviour, dimensions, strings, error
  branches — yes. React / TypeScript snippets — no.
- **Update the "Milestone phases" table** at the top of the spec
  doc to mark this phase as defined (replace `Edit — TBD.` with
  `Edit — this document, section below.`).

## Stage 1 — Stop after writing

Do **not** start the plan immediately. Tell the user:

> "Phase <K> spec appended to `.claude/specs/chat-milestone-<N>.md`.
> <highlights line>. Ready for you to review the spec — flag any
> change before I move to the implementation plan."

Wait for explicit approval before invoking Stage 2. If the user
requests changes, edit the spec in place and ask again.

---

# Stage 2 — Web Chat Implementation Plan

Once the user approves the spec, draft the plan that turns it into
code. Append a new phase section to
`.claude/plans/chat-milestone-<N>.md`.

## Stage 2 — Architecture decisions to resolve before drafting

These are commonly deferred from spec → plan. Resolve each before
writing Task 1:

1. **SDK call shape.** Inspect `@amityco/ts-sdk` types under
   `node_modules/.pnpm/@amityco+ts-sdk@*/node_modules/@amityco/ts-sdk/dist/`
   to confirm the exact function signature, payload, and return
   type. Read repository folders like `dist/messageRepository/api/`,
   `dist/channelRepository/api/`, `dist/fileRepository/`. If the
   spec assumed a native call (e.g. `message.resend()`) and it
   doesn't exist, pick the documented composition (e.g.
   `delete + recreate`) and write the substitution into the
   Architecture decision log.
2. **State ownership.** Decide whether the new state lives in
   `useChat` / `useGroupChat` (per-conversation), in a shared hook
   (`features/shared/hooks/`) used by both, or in `useChatMessage`
   (the existing shared aggregator). Default to shared when both
   `Chat` and `GroupChat` need the same behaviour.
3. **Mutation orchestrator.** Anything that calls the SDK + opens
   an overlay + handles toasts goes in a single
   `use<Verb><Noun>Query` hook in `~/v4/chat/hooks/queries/`.
   The naming is verb-first, mirroring the SDK call shape: SDK
   `editMessage` → hook `useEditMessageQuery`, SDK `deleteMessage`
   → `useDeleteMessageQuery`, SDK `createMessage`+`deleteMessage`
   composition → `useResendMessageQuery`. Pattern: explicit
   `useMutation<Response, Error, Params>` generics, derive types
   via `Awaited<ReturnType<...>>` and `Parameters<...>[0]`, surface
   errors via `useNotifications().error` with `TOAST.*` constants.
4. **Existing components first.** Before proposing a new component,
   check `~/v4/core/components/` (especially `Menu`),
   `~/v4/chat/elements/`, and
   `~/v4/chat/features/shared/components/`. Reuse beats create.
5. **Figma node coverage.** Every visual change in the plan has at
   least one Figma node id cited. If a visual exists in code without
   a Figma reference, note it as "Web-only" with a reason.
6. **Flutter parity check on every name the plan introduces.**
   Before writing the file map or any task, open the Flutter
   feature folder under
   `Amity-Social-Cloud-UIKit-Flutter/lib/v4/chat/<feature>/` and
   extract three things, verbatim:

   - The page **class name** (e.g. `AmityEditGroupMemberPermissionsPage`,
     `AmityGroupNotificationPreferencePage`).
   - The page **`pageId` value** (the literal string, e.g.
     `'edit_group_member_permissions_page'`,
     `'group_notification_preference_page'`).
   - The Flutter **folder name** (e.g. `edit_group_member_permission/`,
     `notification_preference/`).

   Then translate each into the web-side counterparts and lock those
   names BEFORE drafting:

   - Web page class name = drop the `Amity` prefix
     (`EditGroupMemberPermissionsPage`,
     `GroupNotificationPreferencePage`). Singular vs plural,
     `Group` prefix vs no prefix — match Flutter exactly. Do NOT
     guess: `EditGroupMemberPermission*` (singular) and
     `EditGroupMemberPermissions*` (plural) are NOT the same
     symbol, and `NotificationPreferencePage` vs
     `GroupNotificationPreferencePage` is NOT the same symbol. The
     last several phases each had a 10+ symbol cascading rename
     because the Flutter name was not extracted up-front.
   - Web `pageId` constant value = the Flutter `pageId` string
     **verbatim**. Do not transform.
   - Web feature folder under `~/v4/chat/features/group/` = a
     short kebab-case name. The Flutter folder name is a hint
     but not authoritative — `Group` prefix on the page does NOT
     mean the feature folder needs it. Strip the `group_` /
     `edit_group_` prefix if it would make the folder name
     redundant inside `features/group/` (e.g. Flutter
     `edit_group_member_permission/` → web `edit-permission/`).

   Run this command in the Flutter repo root to extract both at
   once:

   ```bash
   grep -rn "pageId:" lib/v4/chat/<feature>/ | head -3
   grep -rn "class Amity[A-Z][^ ]* extends NewBasePage" lib/v4/chat/<feature>/
   ```

   Cite the extracted values in the plan's Architecture decisions
   section under a "Naming (Flutter parity)" bullet so the
   executor sees the source of truth without re-deriving.

## Stage 2 — Re-explore the codebase before listing tasks

Phases overlap. The spec describes the user-visible behaviour for
the *whole* feature; some of that behaviour is already shipped by an
earlier phase. Before drafting Task 1, run a fresh pass over every
file the spec references and answer two questions:

1. **Is this already shipped?** If yes, the plan's job is to extend
   or refactor — not to re-implement. Move it to the "Not touched
   (out of scope per spec)" table with a one-line note pointing at
   the prior phase.
2. **What is actually missing?** Diff the spec against the code and
   write tasks only for the delta.

Use `grep` + targeted reads — do not trust the spec's wording alone.
Read the actual hook, component, and CSS file.

## Stage 2 — Distinguish surfaces by trigger, not by feature

A single feature often spans multiple UI surfaces driven by
different states. When the spec says "the menu opens", confirm
*which* surface:

- **Popover** (`react-aria-components` `Popover`, anchored to a DOM
  node) — typically triggered by long-press / right-click on a synced
  element. Adds rows by extending the content component's `items[]`.
- **Drawer** (`useDrawer().setDrawerData` + global
  `<DrawerContainer>`, iOS-style on mobile only) — typically
  triggered by tap on an error / overflow icon. Content is inlined
  as `<Menu container="drawer">…` inside the drawer-data call.

Both can coexist for the same feature when they handle different
states. The plan must name the surface explicitly — never just "the
menu" — and never propose to replace one with the other unless the
spec calls for it.

## Stage 2 — Plan section structure

Each phase section MUST follow this order. Sections in **bold** are
required; the rest may be omitted only when not applicable.

1. **`## Phase <K> — <Title>`**
2. **`**Spec:** [<phase anchor>](../specs/chat-milestone-<N>.md#phase-<k>--<slug>)`**
3. **`**Status:** 🟡 ready to implement`** (status icons: 🕓 pending
   spec, 🟡 ready, 🟢 in progress, ✅ complete)
4. `> Date started: YYYY-MM-DD` directly under the heading.
5. **`**Goal:** <one paragraph, ≤80 words>`** — the user-visible
   outcome.
6. **`**Architecture:**`** — bullets covering surfaces touched,
   primitives reused, new abstractions introduced, cross-feature
   shared state, and SDK contract decisions resolved here.
7. **`**Tech Stack:**`** — single line listing the main libraries
   and patterns used by this phase.
8. **`**Reference Figma:**`** — bullet list of every relevant Figma
   node id with a 1-line description. If wiring-only, state
   explicitly.
9. **`### Files map`** — three sub-tables:
   - `#### New files` (path + responsibility)
   - `#### Modified files` (path + change)
   - `#### Not touched (out of scope per spec)` (path + reason)
10. **`### Task 1 — <imperative title>`** … `### Task N — <…>` —
    see "Task format" below.
11. **`### Task N+1 — Verify`** — final task that runs `pnpm tsc`,
    `pnpm lint`, exercises Storybook stories where relevant, and
    clicks through the feature in the dev server.

## Stage 2 — Task format

Every task is a numbered atom: it can be implemented and
type-checked in one sitting without depending on later tasks. Each
task MUST contain:

```md
### Task <N> — <imperative title>

**Files:**
- Create: `<path>`
- Modify: `<path>`

- [ ] **Step <N>.1: <what>**

<short rationale or pointer to surrounding code>

\`\`\`<lang>
<paste-ready code or diff>
\`\`\`

- [ ] **Step <N>.2: …**

…

- [ ] **Step <N>.X: Run type check**

Run: `pnpm tsc`
Expected: PASS.
```

Rules for task content:

- **Code blocks must be paste-ready.** Real imports, real types,
  real CSS custom properties. No `// ...` placeholders, no "fill in
  the rest".
- **Modify-existing-file tasks use delete-block + add-block, never
  prose.** When a step changes an existing file, choose one of:
  - **Full replacement.** "Replace the entire file with:" followed
    by the complete new file. Preferred for files under ~100 lines
    (e.g. `useFailedMessageSheet.ts`, `useBubbleMenu.ts`).
  - **Targeted edit.** A *delete-block* showing the exact text
    currently in the file, followed by an *add-block* showing the
    exact text to put in its place. One pair per logical change.
    Anchor each pair with "Replace this:" / "with this:" or
    "Delete this:" plus a line-range citation
    (e.g. *currently lines 63–88*).
  Never write "remove the now-unused X", "drop the unused
  imports", or "replace the call site" without the surrounding
  text. Prose pointers force the implementer to re-derive the diff,
  which is exactly the "fill in the rest" failure mode.
- **Use `~/` aliases**, never relative paths. Never import the
  index barrel with explicit `/index`.
- **Never write `.test.ts` / `.test.tsx` files** — phase
  verification is manual + Storybook.
- **Match `feature-implementation/SKILL.md` exactly** for every
  concern it covers (CSS rem-only, theme tokens, AriaButton over
  native button, no inline conditional class strings, no comments
  in CSS, etc.).
- **Never paste a magic number.** Constants live in
  `src/v4/chat/constants/*.ts` and are imported. Add them to the
  constants task at the top of the plan.
- **Single final commit per phase** by default. Don't include
  per-task commit steps unless the user explicitly asks for them.

## Stage 2 — Task ordering: leaves → orchestrators → consumers → UI → wiring → verify

Tasks must be orderable so each one type-checks against an already-
modified codebase without forward references. Apply this ordering
consistently:

1. **Leaf utilities and constants.** New `*.ts` constant entries,
   pure utility functions extracted from existing code, icon
   registry entries — anything that has no chat-internal
   dependencies.
2. **Mutation orchestrators.** `use<Verb>Query` hooks under
   `~/v4/chat/hooks/queries/`. They consume leaves but no consumer
   hooks.
3. **Consumer hooks.** `useBubbleMenu`, `useChatMessage`,
   `useMessageComposer`, etc. — they consume the orchestrators.
   Order child-first (e.g. extend `useBubbleMenu` before
   `useChatMessage` since the latter wires the former's callback).
4. **UI components.** `MessageBubble`, `MessageComposer`, etc. —
   consume the hooks.
5. **Page wiring.** `Chat.tsx` / `GroupChat.tsx` — destructure new
   hook returns and pass new props to the components.
6. **Verify.** Always last.

If a task depends on another not yet written, you ordered them
wrong — re-arrange before drafting.

## Stage 2 — Expose identity-derived values from the hook, not the consumer

When a consumer needs to react to a hook input's identity (e.g. a
`key` to remount a child when the input changes), expose the
identifier directly from the hook return:

```ts
// In useMessageComposer return:
return { …, editingMessageId: editingMessage?.messageId ?? null };
```

```tsx
// In MessageComposer.tsx:
<TextEditor key={composer.editingMessageId ?? 'create'} … />
```

Don't synthesise it in the component by hashing other returned
values (e.g. `originalText.length + originalText.slice(0, 8)`).
The hash works most of the time but breaks in corner cases (two
messages with identical first-8-chars-and-length), and the
indirection hides which input drove the remount. The hook owns the
input, so the hook owns the identity.

This applies to any "which instance of X are we on right now"
value the consumer needs — message id, conversation id, edit
target id, draft session id, etc.

## Stage 2 — Decision log

For every architecture choice with a viable alternative, write 1–2
lines inline under the Architecture bullets:

> **Why X over Y:** <reason>.

Includes: drawer vs popover, optimistic vs live-observer update,
shared hook vs per-feature, native SDK call vs delete+recreate,
synthesizing local state vs trusting the SDK. The spec already
locked user-visible behaviour; the plan locks implementation
choices.

## Stage 2 — Verification gate

The final `### Task N+1 — Verify` MUST list every check that has to
pass before the phase is marked complete:

- `pnpm tsc` — clean run for the touched scope.
- `pnpm lint` — clean run.
- `pnpm storybook` — relevant stories render and exercise new
  states.
- Manual click-through walking each acceptance criterion in the
  spec.
- (Optional) `pnpm build` if the phase touches public exports.

Each acceptance criterion from the spec maps to at least one
verification step.

## Stage 2 — Stop after writing

Tell the user:

> "Plan written and appended to
> `.claude/plans/chat-milestone-<N>.md` under Phase <K>. Please
> review before I start implementing."

Wait for explicit approval ("looks good", "proceed", "go") before
beginning Task 1. If the user requests changes, revise the plan in
place, then ask again.

---

# Stage 3 — Web Chat Implementation Execution

Once the user approves the plan, switch into execution mode.

## Stage 3 — Source of truth: `pnpm tsc | grep <scope>`, not IDE diagnostics

IDE diagnostics lag the file system, especially right after a
multi-edit sequence. Stale errors keep flagging removed identifiers
and non-existent imports. Before reacting to any diagnostic that
"doesn't match the file you just wrote", do one of:

- `grep -n "<symbol>" <file>` to confirm the actual current state,
  or
- `pnpm tsc 2>&1 | grep <scope>` filtered to the files you changed.

Only edit again if the source-of-truth tools agree. Treat IDE
markers as suggestions, not facts.

## Stage 3 — Inspect `node_modules` before assuming SDK shape

When the spec depends on an SDK call (`createMessage`,
`editMessage`, `resendMessage`, etc.) and the plan deferred the SDK
contract:

```bash
find node_modules/.pnpm/@amityco+ts-sdk@*/node_modules/@amityco/ts-sdk/dist \
  -name "*.d.ts" -path "*<area>*"
```

Read the actual `.d.ts`. If the assumed call doesn't exist, pick
the documented composition (e.g. `delete + recreate`) and record
the substitution in the plan's Architecture decision log. Don't
guess.

## Stage 3 — Cross-module duplication → hoist to `~/v4/core/`

If you find yourself editing the same shape in
`~/v4/social/elements/` and `~/v4/chat/elements/` (or any two
modules), stop and merge first:

1. Move the primitive to `~/v4/core/components/<Name>/`.
2. Generalize the API only as much as both consumers need (e.g.
   `Menu.Item.icon` accepting a registered name *or* a React
   component *or* an element).
3. Update both modules' consumers in the same change.
4. Delete the duplicate folders.

## Stage 3 — Module-variant prop on shared core primitives, not consumer-side overrides

When a `~/v4/core/` primitive needs different chrome per consuming
module (chat vs social), add a `variant` prop to the primitive
itself and gate the rules with a `[data-variant='<name>']` selector
inside the primitive's own CSS module. Do not pipe overrides
through the consumer's `className`.

The default value of `variant` must be the *less invasive*
option — typically the existing look, so adding the prop never
silently re-themes already-shipping consumers. New module-specific
consumers opt in by passing `variant="<their-module>"`.

Why: CSS-module overrides at the consumer fight specificity at the
end of the cascade and break when the primitive renames a class.
The variant flag makes the per-module styling discoverable from the
primitive's own source and survives downstream className refactors.

## Stage 3 — Don't lift `useSDK()` into page components

If a page component (`Chat.tsx`, `GroupChat.tsx`) needs an SDK-
derived value (`currentUserId`, `client`, etc.) and the chat hook
already calls `useSDK()` for other reasons, expose the value from
the chat hook's return — do not let the page import `useSDK`
directly. Page components stay declarative consumers; the chat
hook is the single SDK-aware aggregator for all pages that share
its core. Keeps `useSDK` out of the leaf surfaces and routes
test/storybook mocking through one shim.

## Stage 3 — Single-ordering-authority helpers live with the surface

When 2+ consumers compute the same items list (popover rows,
drawer rows, navigation entries) and the *order* of those items is
spec-mandated, hoist the builder to the same module as the surface
component and re-export it from the module's `index.ts`. Both
consumers call the builder; the builder owns the predicate and the
order in one place.

Why: prevents ordering drift between consumers and gives the next
phase (a new row to insert in a spec-mandated slot) a single
extension point.

## Stage 3 — Cross-feature duplication → extract a shared hook

When two feature-local hooks duplicate the bulk of their logic
(`useChat` ↔ `useGroupChat`, etc.):

1. Diff the two hooks. Identify the shared core and the
   per-feature delta.
2. Create a shared hook (e.g. `useChatMessage`) under
   `features/shared/hooks/` that owns the core. Parameterize the
   small per-feature differences (e.g. `loadingToastIdPrefix`).
3. Each consumer becomes a thin wrapper that calls the shared hook
   and adds its delta.

Don't wait for a third consumer to appear; two is enough.

## Stage 3 — Inline thin wrappers; don't create files for two-line components

If a component is one `<Menu container="drawer">…</Menu>` plus two
`Menu.Item`s, inline it inside the hook that constructs the drawer
content. Don't create a `MyContent.tsx` + `index.ts` +
`.module.css` just to render that. The `useFailedMessageSheet.tsx`
pattern (drawer content inlined inside
`setDrawerData({ content: <…/> })`) is the canonical example.

A separate component file is justified when:

- It has its own state.
- It's reused in 2+ places.
- It carries non-trivial CSS.

Otherwise, inline.

## Stage 3 — Synthetic state when the SDK shape mismatches Flutter

If the spec assumes Flutter-style behaviour but the web SDK exposes
a different surface (e.g. Flutter's
`createMessage(...).image(uri).send()` runs upload + create + sync
in one optimistic message; the web SDK requires `uploadImage`
first, then `createMessage(fileId)`), the gap is filled by
synthesising the missing layer in the composer/hook:

- Track local-only state with a `clientId` and a `__synthetic*`
  marker.
- Merge it into the same data structure consumers already render
  (`items`, `messages`, etc.) — same visual treatment, no separate
  branch.
- Branch downstream actions (resend / delete) by detecting the
  marker with a type predicate (e.g.
  `isSyntheticPendingMessage(message)`).
- Drop any toast that the gap previously surfaced — the unified
  visual is now the user-visible signal.

Don't paper over the SDK shape with new toasts. Synthesise the
state and flow it through the same rendering path.

## Stage 3 — Error code as source of truth, not error-message substrings

For SDK error classification (moderation, blocked word, link not
allowed, etc.), match on the SDK error code constant, not on the
human-readable error message:

```ts
function isModerationError(error: unknown): boolean {
  return error instanceof Error && error.message.includes(ERROR_CODE.IMAGE_NUDITY);
}
```

Codes are stable; error strings are localised, formatted, and may
change across SDK versions. Add new codes to
`src/v4/chat/constants/errorResponse.ts` (or the matching module
constants file).

## Stage 3 — Stash before switching branches; never mid-phase to verify

Phase work touches dozens of files. If you `git checkout` to
another branch with uncommitted Phase work, the IDE may overwrite
your changes silently. Before any branch switch:

```bash
git stash push -u -m "phase-<N>-WIP"
```

Then `git stash list` and `git stash pop stash@{0}` after
switching back. If work is lost despite this, `git reflog --all`
and `git stash list` together usually find the orphaned stash.

**Corollary: do not `git stash` mid-phase as a diagnostic
shortcut.** Don't stash to "see what tsc looks like on develop"
or to verify pre-existing errors. Phase work routinely involves
file renames; stashing a half-renamed tree and popping later
produces merge conflicts on the *new* path (git treats rename as
add+delete) and forces you to hand-resolve files you already
finished. Use `pnpm tsc 2>&1 | grep <your-paths>` to filter to
your touched scope instead — pre-existing errors outside that
scope are not phase blockers.

## Stage 3 — Filter the verify step to your touched scope

`pnpm tsc` runs over the whole repo and surfaces unrelated
pre-existing errors (legacy v3 components, story files with stale
prop shapes, etc.). Filter to your phase's scope before deciding
whether to fix:

```bash
pnpm tsc 2>&1 | grep -E "(<phase-touched-paths>)" | head -20
```

Errors in files you did not touch in this phase are pre-existing
and out of scope — note them in the implementation log if
relevant, but do not block the phase on them. Errors in files you
*did* touch must be zero before marking the phase complete.

## Stage 3 — Update the plan with an implementation log on deviations

When implementation diverges from the original plan — renames,
scope expansions, new architectural decisions, deleted files —
record the deviations in an `### Implementation log — deviations
from the original plan` section appended to the phase. Cover:

- Renames (file paths, hook names, prop names).
- Tasks that moved out of scope or expanded mid-flight.
- Patterns introduced that weren't in the original plan (e.g.
  synthetic state, drawer migration, cross-module merge).
- A delta files map (new beyond the plan / deleted beyond the plan
  / modified beyond the plan).

The original tasks stay as-written historical record; the log
captures reality. Future readers diff the two to understand what
shipped.

Also update the Phase Overview status row to ✅ complete and the
section's status line.

## Stage 3 — Single final commit per phase

By default do not commit after each task. Stage and verify
everything together at the end of the phase so the diff matches
the spec's acceptance criteria as one atomic change. Per-task
commits are only used when the user explicitly asks for them.

---

# Plan file header (only when creating a fresh plan file)

```md
# Chat Milestone <N> — Implementation Plan

> Porting [chat-milestone-<N>.md](../specs/chat-milestone-<N>.md) spec from the Flutter UIKit to the React UIKit.
> Date started: <YYYY-MM-DD>

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

---

## Phase Overview

| Phase | Scope | Status |
|---|---|---|
| [Phase 1](#phase-1--<slug>) | <short scope> | <status> |
| Phase 2 | <short scope> | <status> |
| …       | …               | …        |

---
```
