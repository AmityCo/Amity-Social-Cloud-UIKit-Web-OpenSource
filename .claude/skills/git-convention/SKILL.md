---
name: git-convention
description: Branch / commit / PR conventions for the Amity Social Cloud UIKit Web repo. Use at the end of any feature or fix that needs a PR.
---

# Git convention

## Branch

```
<type>/PDT-<num>-<short-kebab-summary>
```

- `<type>` matches the commit verb (`feat`, `fix`, `chore`, `refactor`) and the Jira issue type —
  `Bug` → `fix`, everything else → `feat`.
- The separator after `<type>` is a **slash**, not a hyphen.
- The slug is 3–6 meaningful words. Strip Jira noise like `[Web UIKit : Chat 4.0]`. It is for
  humans scanning a branch list, so capture the essence, not the whole title.
- No ticket → `PDT-0000`. Never omit the key.

Examples: `feat/PDT-3387-sdk-integration-gate`, `fix/PDT-5768-reaction-list-name-truncation`.

## Stage

```bash
git add -A
```

If something shouldn't ship, revert it instead of partial-staging.

## Commit

Single line, no body, no footer. No `Co-Authored-By`, no generated-with line.

```
<verb>: PDT-<num> - <short summary>
```

- Verb: `feat` (Task/Story), `fix` (Bug), `chore` / `refactor` (no behaviour change).
- **No scope.** `feat(chat):` is the SDK repo's convention, not this one.
- **`PDT-` is uppercase here.** The SDK forces lowercase via commitlint; this repo has no
  commitlint and its history is uppercase throughout.
- 3–5 words after the ticket key.

```bash
git commit -m "fix: PDT-5768 - truncate reaction list name"
```

The pre-commit hook (`lint-staged`) runs eslint, stylelint, prettier and the governance gates on
the staged files. If it fails: fix the code, `git add`, make a **new** commit. Never `--amend`
after a failed hook.

## Gates

The gates in `governance/gates/` run on staged files at commit time, so a commit is judged only
on what it touches. Before pushing something that spans many files, run the whole tree:

```bash
pnpm verify:gates          # every gate
pnpm verify:pages          # 01 — page naming chain + page scaffolding
pnpm verify:components     # 04 — component chain, componentId, public export
pnpm verify:typography     # 05 — Typography owns the type scale
pnpm verify:sdk-hooks      # 06 — SDK hook folders, naming, mutations
```

Each gate takes file paths and `--json`, and grades findings SAFE / BREAKING / ADVISORY. A
BREAKING finding touches consumer-facing API — resolve it or call it out in the PR body.

## Push

```bash
git push -u origin <branch>
```

## PR

Template: [`.github/pull_request_template.md`](../../../.github/pull_request_template.md).

- **Title = commit subject, identical.** Don't reword or lengthen it.
- **Base**: ask the user; it is usually `develop`.
- Body: fill the template's fields and add nothing else — no "QA coverage", no "Test plan".
  Leave `**Screen shot :**` blank for the user to attach.
- **A dated `Release/` label is required.** CI check `it-has-a-release-label` fails without it.
  The label rolls forward each release (`Release/9th-Oct-2026` at time of writing), so read the
  current one off a recently merged PR rather than guessing:

  ```bash
  gh pr list --state merged --limit 3 --json labels --jq '.[].labels[].name' | grep '^Release/'
  ```

### Reviewers — attach them in the create call

The web team pool is `htutwaiphyoe`, `chayanitbm`, `pitchaya-sp`. Request **everyone except the
author** — GitHub rejects requesting a review from yourself, so compute it rather than hardcoding:

```bash
ME=$(gh api user --jq '.login')
REVIEWERS=$(printf '%s\n' htutwaiphyoe chayanitbm pitchaya-sp | grep -viFx "$ME" | paste -sd, -)
```

Pass `--reviewer "$REVIEWERS" --assignee @me` **inside `gh pr create`**, never as a later
`gh pr edit`. The repo's `notify_code_review.yaml` only posts to the Eko "Code review" channel
when the PR is _opened_ with a reviewer already attached; adding one afterwards is silently
skipped.

```bash
gh pr create --base develop \
  --title "<verb>: PDT-<num> - <short summary>" \
  --reviewer "$REVIEWERS" --assignee @me \
  --label "Release/9th-Oct-2026" \
  --body "$(cat <<'EOF'
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

**If the notification didn't post** — the PR was opened without reviewers, or you need to re-fire
it — emit a clean `review_requested` with **exactly one** reviewer on a PR older than 60s:

```bash
gh pr edit <pr-number> --remove-reviewer chayanitbm --remove-reviewer pitchaya-sp
gh pr edit <pr-number> --add-reviewer pitchaya-sp
```

Adding two at once, or adding within 60s of creation, is skipped by the workflow's de-dupe.
Verify with `gh run list --workflow notify_code_review.yaml` — the Send step logs
`Eko webhook responded HTTP 200`.

## Jira

Keep the ticket in step with the work: **In Progress** when you pick it up, **Code Review** when
the PR opens. Read the transition list with `getTransitionsForJiraIssue` — workflow ids vary, do
not hardcode them.
