---
name: issue-resolver
description: Use when resolving a QA-filed Jira ticket (PDT-XXXX) in the Amity Social Cloud UIKit Web repo. Triggers on a pasted Atlassian Jira URL. Orchestrates: ticket + Figma analysis → plan approval gate → branch and implementation → manual QA gate → pnpm build → conventional-commit and push. Use after chat v4 milestone work is feature-complete and QA bug tickets are being worked through.
---

# Issue Resolver

This skill turns a single QA-filed Jira ticket into a pushed branch ready for the user to open a PR. It runs in five sequential stages (plus an optional Stage 6 for tickets that need no code change), each gated on user approval before moving forward.

| Stage | Output | When |
|---|---|---|
| 1 — Analyze | Ticket moved to **In Progress** + expected-vs-actual summary in chat | After the user pastes a Jira URL |
| 2 — Plan + approval gate | Approved fix plan via `ExitPlanMode` | After Stage 1 |
| 3 — Branch + implement | New branch + applied code changes, file paths listed first in each handoff | After plan approval |
| 4 — Manual QA gate | User says "ok to commit" | After implementation |
| 5 — Build + commit + push | Pushed branch + compare URL targeting Stage 3 base | After QA sign-off |
| 6 — Jira transition (optional) | Ticket moved (e.g. "Deployed to Dev") | Only if user decides no code change is needed in Stage 1 |

**Never skip ahead.** The user reviews and approves at every stage gate. Do not begin Stage 3 until the plan is approved. Do not begin Stage 5 until the user has manually QA'd the change.

## When to use

The user pastes an Atlassian Jira URL (e.g. `https://amity.atlassian.net/browse/PDT-2900`) and asks for the issue to be resolved. Also use when the user invokes the skill by name with a URL.

**Do not** invoke this skill for:

- Open-ended feature work — use [`feature-implementation`](../feature-implementation/SKILL.md) directly.
- Multi-ticket batch fixes — run the skill once per ticket.
- Non-PDT projects — this skill assumes the `PDT-` Jira key prefix and the Amity Social Cloud UIKit Web repo conventions.

---

# Stage 1 — Analyze

Parse the ticket key from the URL (regex `PDT-\d+`). If the URL does not contain a `PDT-\d+` key, stop and ask the user for the correct URL — do not guess.

## Stage 1 — Fetch the ticket

Run in a single tool batch:

1. `mcp__7e52d879-aec1-446e-a191-61e16ba56c0e__getAccessibleAtlassianResources` to get the `cloudId`.
2. `mcp__7e52d879-aec1-446e-a191-61e16ba56c0e__getJiraIssue` with the ticket key and the resolved `cloudId`.

From the returned issue, extract:

- **Title** and **issue type** (`Bug`, `Task`, `Story`). The issue type drives the commit verb in Stage 5 (`Bug` → `fix:`, otherwise `feat:`).
- **Description** and **acceptance criteria** — read the full body.
- **Figma links** — scan description and comments for any `figma.com/...` URL.
- **Referenced files / components** — scan for file paths, component names, error stacks.
- **Linked PRs or related tickets** if any.
- **Current status** — read `fields.status.name`. If it is already `In Progress`, skip the transition step below; otherwise transition it now.

## Stage 1 — Transition ticket to "In Progress"

As soon as Stage 1 has fetched the ticket and confirmed it is the right one, move it to **In Progress** so QA and PMs can see work has started. Do not wait for plan approval — picking up the ticket is the trigger, not committing code.

1. `mcp__claude_ai_Atlassian__getTransitionsForJiraIssue` with the ticket key + cloudId.
2. Find the transition whose `name` is `In Progress` (case-insensitive). Workflow IDs vary per project — read the list, do not hardcode.
3. `mcp__claude_ai_Atlassian__transitionJiraIssue` with that transition `id`.
4. Confirm to the user in one line: "Moved PDT-XXXX to In Progress."

Skip silently if the ticket is already `In Progress` or if no matching transition exists (some workflows gate it behind a different name — surface that to the user instead of forcing).

## Stage 1 — Figma policy

If the description contains a Figma URL:

1. Authenticate via `mcp__figma__authenticate` + `mcp__figma__complete_authentication` if not already authenticated.
2. Start with `mcp__figma__get_metadata` on the cited node to understand the frame's children and overall structure. Avoid calling `get_design_context` on huge canvas-level nodes — the response can exceed token limits.
3. Call `mcp__figma__get_design_context` on the relevant frame to get the actual rendered layout: positions of elements, flex direction, alignment, gaps, typography variants, and which states/components are inline vs. stacked.
4. Note dimensions, colors, typography, and states that the spec implies. Pay attention to **where** an element sits in the layout (e.g. inline in a header row vs. stacked below) — the Jira description often describes behavior but the Figma is the truth for placement.

If no Figma URL is in the ticket, ask the user **once** via `AskUserQuestion`:

| Option | Effect |
|---|---|
| Provide Figma link | User pastes a URL; skill fetches it and continues. |
| Proceed without Figma | Skill uses Jira description alone as source of truth. |
| Cancel | Stop the skill. |

Do not block the workflow on a missing Figma — many QA bugs are pure regressions with no design reference.

## Stage 1 — Read the current code

Open the files the ticket implicates. For chat v4 tickets, that is usually under `src/v4/chat/`. Use `grep` to find the relevant component, hook, or page. Do not skim — read enough to identify the actual defect.

## Stage 1 — Synthesize

Write the user a short **expected vs. actual** summary in chat (5–10 lines):

- **Expected** (per Jira description + Figma, if any): what the ticket says should happen.
- **Actual** (per current code): what the code does today and where the gap is.
- **Hypothesised root cause**: one sentence.

Do **not** persist this summary to a file — plan mode in Stage 2 handles persistence.

---

# Stage 2 — Plan + approval gate

## Stage 2 — Enumerate root causes and fix approaches first

**Before writing the plan, brainstorm.** A QA bug rarely has a single obvious fix — and the first idea is often not the cleanest. In chat (briefly, before entering plan mode), enumerate:

1. **All plausible root causes** — not just the most obvious. For a "stuck modal" bug, that could be: SDK hangs, React Query pauses, missing error handler, missing network guard, race condition in confirm provider, etc. Read the relevant code paths thoroughly enough to rule causes in or out.

2. **All plausible fix approaches** for the most-likely root cause. Examples of categories to consider:
   - **Library-native primitive** (e.g. React Query's `networkMode: 'always'`, AbortController, error boundary) — usually the cleanest, look for it first by grepping the codebase for similar usage.
   - **Local guard** (e.g. pre-check `useNetworkState()` and short-circuit).
   - **Timeout / race** (wrap the hanging call).
   - **Optimistic / background** (close the modal immediately, surface errors via toast).
   - **Prevent the action entirely** (disable the button when the precondition fails).
   - **Combination** (e.g. pre-check + timeout safety net).

3. **Evaluate trade-offs** for each: complexity, robustness, UX, alignment with existing patterns in the repo. **Prefer the approach that matches an established codebase pattern** — `grep` for similar fixes (e.g. `networkMode: 'always'`, `useNetworkState`, `Promise.race`) before inventing a new one.

4. If two or three approaches are roughly equivalent, **surface the choice to the user via `AskUserQuestion`** before drafting the plan. The user often has context (existing conventions, future direction, design intent) that makes one option clearly better.

Only once the approach is settled — either confidently by you, or explicitly by the user — write the plan. **The plan contains only the chosen approach**, not the alternatives. Alternatives are conversational, not persisted.

Skip the enumeration only if the fix is genuinely one obvious line (e.g. typo, missing prop, off-by-one). Otherwise enumerate — it is cheap and prevents the user from pushing back with "any other workarounds?" after you've already committed to an approach.

## Stage 2 — Write the plan

Enter plan mode. Draft a fix plan covering:

1. **Root cause** — one paragraph, citing file paths and line ranges. State what was ruled in vs. ruled out during enumeration.
2. **Files to change** — explicit paths, with one-line description per file.
3. **Reusable utilities / components leveraged** — per the [`feature-implementation`](../feature-implementation/SKILL.md) skill rules. Check `~/v4/core/components/` and `~/v4/chat/elements/` before proposing new code. Cite the file paths of the established pattern you're following (e.g. *"matches `networkMode: 'always'` usage in `usePostFlaggedByMe.ts`, `useEventMutation.ts`, …"*).
4. **L10n impact** — if the fix touches strings, list the keys. Net-new l10n keys require user approval per the memory rule `feedback_l10n_keys`. Pre-allocated empty keys may be populated freely.
5. **Manual QA steps** — how the user will verify the fix locally (Storybook story name, or page + interaction sequence in the dev server).

Call `ExitPlanMode` to request approval. **Do not proceed past this stage without explicit approval.** If the user requests changes, revise the plan in place and ask again.

---

# Stage 3 — Branch + implement

## Stage 3 — Choose the base branch

Ask the user via `AskUserQuestion`:

| Option | When |
|---|---|
| Current chat-v4 feature branch (Recommended) | QA tickets filed against the chat-v4 milestone — PR targets the chat-v4 integration branch. |
| `develop` | Bug also affects already-shipped v3 or non-chat code. |
| Other (specify) | User names the branch. |

Confirm with `git status` that the working tree is clean. If it is dirty, stop and ask the user how to proceed — do not stash, do not discard.

## Stage 3 — Branch naming

Format: `<type>/PDT-<num>-<slug>`, where `<type>` is `fix` for Jira `Bug`/`Issue` types and `feat` otherwise. The separator between `<type>` and `PDT-` is a **slash**, not a hyphen. (Memory: `feedback_branch_pr_format`.)

Keep `<slug>` **short and meaningful** (3–6 words). Strip filler like `[Web Mobile UIKit Chat 4.0]`, "should", "no" prefixes, and Jira tag noise. The slug is for humans to scan a branch list — capture the essence, not the full Jira title.

1. Identify the 3–6 most descriptive words from the title (the actual subject of the bug).
2. Lowercase, replace non-alphanumerics with `-`, collapse runs, trim.

Examples:

- Title `[Web Mobile UIKit Chat 4.0) chat list no internet connection state` + key `PDT-2777` → `fix/PDT-2777-chat-list-no-network-state`
- Title `[Web UIKit : Chat 4.0] No error modal for message >10K characters` + key `PDT-2729` → `fix/PDT-2729-chat-message-too-long-modal`

If unsure, pick the shorter version. Do not mechanically truncate the full title — it produces ugly, hard-to-read branch names.

Run:

```bash
git checkout <base-branch>
git pull --ff-only
git checkout -b <branch>
```

## Stage 3 — Implement

For any change inside `src/v4/`, **invoke the [`feature-implementation`](../feature-implementation/SKILL.md) skill** so its conventions apply automatically:

- `~/` alias only — no relative imports.
- No explicit `/index` suffix in import paths.
- SDK hook folder convention (`hooks/objects/`, `hooks/collections/`, `hooks/queries/`).
- Query hooks expose bare verbs (`block`, `unblock`, `mute`, `report`) — not `requestX` or `handleX`. (Memory: `feedback_query_hook_verb_naming`.)
- CSS values in `rem`, never `px`. (Memory: `feedback_css_rem`.)
- Icon CSS sets both `color` and `fill`. (Memory: `feedback_icon_color_fill`.)
- Shared visual styles go under `v4/<module>/elements/` with a Storybook story; clickable elements use `Button` from `react-aria-components`. (Memory: `feedback_reusable_elements`.) Prefer **self-managing elements** — if the element has its own visibility/state logic (e.g. "show only when offline"), put that logic inside the element so consumers only drop it in without conditionals.
- New hook param types derived from SDK signatures via `Parameters<typeof SDK_FN>[N]`. (Memory: `feedback_sdk_param_types`.)

For any change outside `src/v4/` (legacy v3, build config, docs), apply the change directly — `feature-implementation` does not apply.

## Stage 3 — Verify against Figma after implementation

For any visual fix, **re-open the Figma frame** after editing and cross-check layout/alignment/centering — not just functionality. Common gaps from the Jira description alone:

- The Jira description tells you *what* should appear; the Figma tells you *where* it sits (inline vs. stacked, centered vs. left-aligned, in the header vs. as a separate block).
- If the Figma shows three sibling regions in a row (e.g. title / status / actions), match its flex sizing — typically both outer regions get equal `flex: 1 0 0` and the middle region uses `flex-shrink: 0` so it stays centered.

Iterate on layout until it matches the spec. Do not assume Jira description and Figma agree on placement.

## Stage 3 — Post-implement checks

Run in parallel:

```bash
pnpm tsc
pnpm lint
```

If either fails, surface the error to the user verbatim. Do not silently ignore. Fix the failures before moving to Stage 4.

## Stage 3 — Reporting changes back to the user

**Always lead with the file paths AND show the diff.** Whenever you finish a step — initial implementation, a refactor, a layout fix — your response must contain:

1. A bulleted list of the absolute or repo-relative paths of every file you created or modified, **at the top of the response**.
2. The actual diff of each change, rendered inline via `git diff` (or `git diff HEAD~1 HEAD` after a commit). Run the diff command in a `Bash` call so the panel renders the change visibly. Never describe a change in prose without also showing the diff — the user expects to see the code, not just hear about it.

This applies on **every** report in Stage 3 (after the first implementation, after each refactor pass, after each user-requested adjustment) and on the Stage 4 handoff. Do not wait for the user to ask "where is the change" — surface it proactively in the panel.

If you split your work into a new element/component folder, list every file in that folder (the `.tsx`, the `.module.css`, the `.stories.tsx`, the `index.ts`) plus any consumer-side wiring (the parent component that imports it, and the `elements/index.ts` re-export). For new files where `git diff` would not show contents until staged, use `git diff --no-index /dev/null <new-file>` or stage them first and then `git diff --cached`.

---

# Stage 4 — Manual QA gate

Print a handoff summary with the file list at the very top:

1. **Files touched** — list every created/modified path as a plain bulleted list. This is the first thing the user reads. Do not put it after the verification steps.
2. **How to reproduce the fix locally** — name the Storybook story (`pnpm storybook`, then navigate to `Chat/<Component>/<Story>`) or describe the in-app steps. For new elements with their own story, mention the standalone story path too.
3. **Acceptance check** — restate each acceptance criterion from the ticket and mark which is now satisfied.

Ask the user via `AskUserQuestion`:

| Option | Effect |
|---|---|
| Ok to commit | Proceed to Stage 5. |
| Needs changes | User describes what; skill loops back into Stage 3 implement. |
| Cancel | Stop without committing. |

**Do not commit until the user picks "Ok to commit".**

---

# Stage 5 — Build + commit + push

## Stage 5 — Final build gate

Run:

```bash
pnpm build
```

If `pnpm build` fails, **stop**. Surface the error to the user verbatim. Do not stage, commit, or push. `pnpm tsc` and `pnpm lint` in Stage 3 catch most issues but `pnpm build` validates the actual tsup bundle output that ships to consumers — a green build is the precondition for a push.

## Stage 5 — Stage changes

Always use `git add -A` to stage every modified file (user preference — matches `feedback_git_add_all` memory). If something shouldn't be included, revert it rather than skipping the stage step:

```bash
git add -A
```

## Stage 5 — Commit

Determine the commit verb from the Jira issue type captured in Stage 1:

- `Bug` → `fix:`
- `Task` / `Story` / anything else → `feat:`

**Keep the commit message simple and short — single line, no body, no Co-Authored-By footer.** The user prefers terse, scannable history that matches the repo style (e.g. `feat: PDT-2517 - chat v4 localization`, `fix: PDT-3091 - add dot on toast`). Aim for **3–5 words** after the ticket key. (Memory: `feedback_branch_pr_format`.)

Format:

```
<verb>: PDT-<num> - <short summary>
```

Use a single `-m` flag — no HEREDOC needed since there is no body. The Jira key in the subject is the entire audit trail; descriptive content lives on the Jira ticket and the PR description, not in the commit body.

The **PR title** uses the **same string** as the commit subject — not a longer reworded version.

If the pre-commit hook (lint-staged) fails, fix the issue and create a **new** commit. Never `--amend` after a failed hook — that modifies the previous commit.

## Stage 5 — Push

```bash
git push -u origin <branch>
```

## Stage 5 — Open the PR

Open the PR via `gh pr create` against the Stage 3 base branch, using the project's [pull_request_template.md](../../../../.github/pull_request_template.md) as the body. The `--base` is **always the branch chosen in Stage 3** (the branch we created from). Never default to `develop` or `main` if the user picked the chat-v4 feature branch — the PR target must match the base.

The **PR title** must be **identical to the commit subject** (e.g. `fix: PDT-3091 - add dot on toast`). Do not invent a longer title. (Memory: `feedback_branch_pr_format`.)

The PR body fills in the template fields:

- `**Jira ticket :**` → `- https://socialplus.atlassian.net/browse/PDT-<num>`
- `**Description :**` → 1–3 short bullets summarizing what changed and why. Don't restate the entire ticket.
- `**Check lists :**` → check all three (`Test code`, `Build local pass (optional)`, `Code is the same level as origin/develop branch`).
- `**Screen shot :**` → leave blank; the user attaches screenshots after open.
- `**Note (optional) :**` → leave blank unless there's something the reviewer needs to know that isn't in the description.

Do **not** add extra sections (no "QA coverage", no "Test plan") — the template is the contract.

Example HEREDOC form:

```bash
gh pr create --base <base> --title "<verb>: PDT-<num> - <short summary>" --body "$(cat <<'EOF'
**Jira ticket :**

- https://socialplus.atlassian.net/browse/PDT-<num>

**Description :**

- <one-line summary of the change>

**Check lists :**

- [x] Test code
- [x] Build local pass (optional)
- [x] Code is the same level as origin/develop branch

**Screen shot :**


**Note (optional) :**
EOF
)"
```

## Stage 5 — Assign reviewers and self

Immediately after `gh pr create` returns the PR URL, attach the standard reviewer pair and set the current user as assignee:

```bash
gh pr edit <pr-number> --add-reviewer chayanitbm,pitchaya-sp --add-assignee @me
```

If the user has named different reviewers in this session, prefer their explicit list over the defaults.

---

# Stage 6 — Optional: Jira status transition

If after Stage 1 the user decides the ticket needs **no code change** (existing behavior is intentional, fix would be too disruptive, etc.), skip Stages 2–5 and instead:

1. Ask the user whether to transition the Jira ticket. If yes, use `mcp__7e52d879-...__getTransitionsForJiraIssue` to list available transitions, then `transitionJiraIssue` with the chosen ID. Typical target after a "won't fix as filed" decision is **Deployed to Dev** (status id varies per workflow — read it from the transitions list, do not hardcode).
2. Confirm to the user the ticket status changed. Stop.

For the normal code-fix flow, the user typically transitions the ticket themselves after the PR merges and the build deploys — do not auto-transition after `git push`.

---

# Out of scope (v1)

This skill does not handle:

- Auto-transitioning the Jira ticket after a code push (the deploy happens first; user transitions manually once the build lands on dev).
- Posting a Jira comment or worklog write-back.
- Multi-ticket batch mode.

If any of those become useful, expand Stage 6 and update this section.

---

# Verification

To dry-run this skill on a real ticket:

1. Paste a real PDT Jira URL. Confirm Stage 1 fetches the ticket and (if linked) the Figma frame.
2. Confirm Stage 2 enters plan mode and `ExitPlanMode` pauses for approval.
3. Approve a small change; confirm Stage 3 creates a branch named `PDT-<num>-<slug>` off the chosen base, and `pnpm tsc` + `pnpm lint` run after the edits.
4. Confirm Stage 4 stops at the QA gate and does not auto-commit.
5. After approving the QA gate, confirm `pnpm build` runs and passes before staging happens; if it fails, the skill stops.
6. Confirm the commit message is the **single-line** form `<verb>: PDT-<num> - <summary>` (no body, no Co-Authored-By footer) and `git push -u origin <branch>` runs.
7. Confirm the printed compare URL targets the base branch chosen in Stage 3 (not `develop`/`main`).

If any stage skips its gate, applies the wrong conventions, or misnames the branch, update this `SKILL.md` rather than working around it inline.
