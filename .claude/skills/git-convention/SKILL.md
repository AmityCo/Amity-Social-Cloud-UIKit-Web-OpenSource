---
name: git-convention
description: SDK branch / commit / PR conventions for `@amityco/ts-sdk`. Use at the end of any feature/fix that needs a PR.
---

# Git convention (SDK)

## Branch

```
<type>/PDT-<num>-<short-kebab-summary>
```

- `<type>` matches the commit verb (`feat`, `fix`, `chore`, `refactor`).
- No ticket → `PDT-0000`. Never omit; CI parses this segment.
- Examples: `feat/PDT-3182-get-for-you-feed`, `fix/PDT-5678-unread-count-race`.

## Stage

```bash
git add -A
```

If something shouldn't ship, revert it instead of partial-staging.

## Commit

Single line, no body, no footer.

```
<verb>(sdk): pdt-<num> - <short summary>
```

- Verb: `feat` (Task/Story), `fix` (Bug), `chore` / `refactor` (no behaviour change).
- `(sdk)` scope required.
- **Subject is all lowercase** (commitlint `subject-case` enforces it — yes, `pdt-<num>` lowercase too).
- 3–8 words after the ticket key.

```bash
git commit -m "feat(sdk): pdt-3182 - for you feed"
```

If `lint-staged` (pre-commit) fails: fix the code, `git add`, new commit. Never `--amend`.

## Push

```bash
git push -u origin <branch>
```

CI publishes a prerelease tag (`<base>-<short-sha>.0`) for downstream consumers.

## PR

Template: [`.github/pull_request_template.md`](../../../.github/pull_request_template.md).

- Title = commit subject (identical).
- Body: tick the 3 required + 2 optional checkboxes, fill `### Short description` with a few bullets and the Jira link. No extra sections.
- Base: ask the user, don't assume.

```bash
gh pr create --base <base> --title "<verb>(sdk): pdt-<num> - <summary>" --body "$(cat <<'EOF'
### Checklist

* [x] There is an associated JIRA issue: [PDT-<num>](https://socialplus.atlassian.net/browse/PDT-<num>)
* [x] The title of your PR is formatted properly
* [x] Code is up-to-date with the \`<base>\` branch
* [x] You've successfully run \`yarn test\` locally
* [x] There are new or updated unit tests validating the change

### Short description

- <one-line summary>
EOF
)"
```

Reviewers + assignee:

```bash
gh pr edit <pr-number> --add-reviewer <reviewer1>,<reviewer2> --add-assignee @me
```

Ask the user for reviewer handles once per session.

## Cross-repo

If a change spans the SDK + UIKit, ship the SDK PR first → wait for the CI prerelease tag → bump the UIKit's `package.json` to that tag → open the UIKit PR. Revert any `file:/Users/...` dev links before pushing the UIKit branch (machine-specific, breaks CI).
