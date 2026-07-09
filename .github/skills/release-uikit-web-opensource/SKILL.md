---
name: release-uikit-web-opensource
description: 'Release React Web UIKit OpenSource (@amityco/ui-kit-open-source) to NPM. Use when: "release uikit open source", "release opensource uikit", "publish ui-kit-open-source", "release open source web uikit to npm".'
argument-hint: 'Specify the version type: patch, minor, major, or beta (pre-release)'
---

# Release React Web UIKit OpenSource (`@amityco/ui-kit-open-source`)

**Repository:** https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource  
**Upstream (private):** https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web  
**NPM:** https://www.npmjs.com/package/@amityco/ui-kit-open-source  
**GitHub Action:** https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource/actions/workflows/production.yaml

## Pre-Release

> **IMPORTANT:** Before releasing, tag the person giving the green light and get them to acknowledge the message prior to releasing. Better safe than sorry.

- Ask the user for the release type: `patch`, `minor`, `major`, `stable`, or a pre-release tag (`alpha` / `beta`).
- Confirm PO has given approval.
- Confirm the local clone of `Amity-Social-Cloud-UIKit-Web-OpenSource` is available and ask the user for its path if not already known.

## Procedure

### 1 — Check for pending release PRs

Check if there are any unmerged release PRs that need to be merged into `develop` first:

```sh
gh pr list --repo AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource --base develop --state open
```

If there are open release PRs, ask the user to review and merge them before proceeding.

### 2 — Sync develop with remote

```sh
git checkout develop
git fetch origin
git pull origin develop
```

### 3 — Verify local version matches latest git tag and NPM release

After syncing `develop`, confirm that the version in `package.json` is consistent with both the latest git tag in the repo and the latest published version on NPM. A mismatch means a previous release may be incomplete.

```sh
LOCAL_VERSION=$(node -p "require('./package.json').version")
LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null | sed 's/^v//')
NPM_VERSION=$(npm view @amityco/ui-kit-open-source version 2>/dev/null)

echo "package.json: $LOCAL_VERSION"
echo "Latest tag:   $LATEST_TAG"
echo "NPM latest:   $NPM_VERSION"

if [ "$LOCAL_VERSION" != "$LATEST_TAG" ]; then
  echo "⚠️  package.json version ($LOCAL_VERSION) doesn't match latest tag ($LATEST_TAG)!"
fi
if [ "$LOCAL_VERSION" != "$NPM_VERSION" ]; then
  echo "⚠️  package.json version ($LOCAL_VERSION) doesn't match NPM ($NPM_VERSION)!"
fi
if [ "$LOCAL_VERSION" = "$LATEST_TAG" ] && [ "$LOCAL_VERSION" = "$NPM_VERSION" ]; then
  echo "✅ All versions match — safe to proceed."
fi
```

If any version **does not match**, first check whether an unmerged release PR is the cause before asking the user how to proceed:

```sh
gh pr list --repo AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource --base develop --state open --search "release"
```

If a release PR is found, ask the user to merge it first and then re-sync `develop` (go back to step 2) before continuing. If no release PR is found, stop and ask the user how to proceed.

### 4 — Set up upstream remote (first time only)

Check if the upstream remote already exists:

```sh
git remote -v
```

If `upstream` is not listed, add it:

```sh
git remote add upstream https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web.git
```

### 5 — Checkout a new release branch from develop

Replace `<VERSION>` with the target version (e.g. `v4.16.0`):

```sh
git checkout -b release/v<VERSION>
```

### 6 — Fetch upstream and merge into the release branch

```sh
git fetch upstream
```

**Choose the correct upstream source branch before merging:**

| Situation | Merge from |
|-----------|------------|
| Upstream `develop` is clean and everything on it is ready to ship | `upstream/develop` |
| Upstream `develop` contains staging / in-progress features that must NOT ship in this release | the matching `upstream/release/v<VERSION>` branch (a curated cut that excludes unfinished work) |

Check whether a matching upstream release branch exists for this version:

```sh
git branch -r | grep "upstream/release/v<VERSION>"
```

If it exists and `develop` has unshippable work in flight, prefer the release branch:

```sh
# Default — upstream develop is clean:
git merge upstream/develop --allow-unrelated-histories

# OR, when develop has staging features that must not ship:
git merge upstream/release/v<VERSION> --allow-unrelated-histories
```

When unsure which branch to use, **ask the user** — they know whether `develop` currently holds features being staged.

This will produce conflicts. Resolve them following these rules — **accept all incoming changes EXCEPT:**

| File | Rule |
|------|------|
| `package.json` | Keep `name` and `version` from **current** (OpenSource). Take all `dependencies`, `devDependencies`, `peerDependencies` from **incoming** (upstream). |
| `pnpm-lock.yaml` | Accept **all current changes**, then run `pnpm install` to regenerate. |
| `CHANGELOG.md` | Keep **current** changes only. |

#### ⚠️ Watch for OpenSource-only removals being reverted

Accepting "all incoming" for source files can silently **re-introduce code this fork intentionally removed** (it lives in upstream but was deleted here). The known case is bundled translations — e.g. PR #145 removed the bundled **TH** language (`src/v4/core/localization/defaults/th.*` and the `th` entry in `defaultLocaleMap.ts`), and merging upstream re-adds it.

After resolving conflicts, check for any re-introduced TH (or other deliberately-removed) localization files:

```sh
git status --short | grep -i 'localization/defaults/' || echo "no new locale files"
grep -rn "defaults/th\b\|thLocaleBundle" src/v4/core/localization/ || echo "no TH references"
```

If TH was re-added, re-remove it to preserve the fork's decision:

```sh
git rm -f src/v4/core/localization/defaults/th.json src/v4/core/localization/defaults/th.ts
git checkout HEAD -- src/v4/core/localization/defaultLocaleMap.ts src/v4/core/localization/index.ts
```

Then re-run the build (step 7) to confirm nothing imports the removed files. When in doubt about whether a re-added file is intentional upstream content or a reverted removal, check `git log` for a prior "remove"/"fix: remove ... language" commit and confirm with the user.

Before running `pnpm install`, check whether `@amityco/ts-sdk` in `package.json` matches the `latest` tag on NPM and is not a dev/nightly pre-release version. Upgrade if either condition fails:

```sh
LOCAL_SDK=$(node -p "require('./package.json').peerDependencies['@amityco/ts-sdk']")
LATEST_SDK=$(npm view @amityco/ts-sdk dist-tags.latest)
echo "package.json: $LOCAL_SDK"
echo "NPM latest:   $LATEST_SDK"

if echo "$LOCAL_SDK" | grep -qE '(-[0-9a-f]{7,}\.|nightly|dev/)' || \
   ! echo "$LOCAL_SDK" | grep -q "$LATEST_SDK"; then
  echo "⚠️  ts-sdk is outdated or on a dev/nightly build — upgrading to >=$LATEST_SDK"
  node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const v = '>=' + require('child_process').execSync('npm view @amityco/ts-sdk dist-tags.latest').toString().trim();
    pkg.peerDependencies['@amityco/ts-sdk'] = v;
    pkg.devDependencies['@amityco/ts-sdk'] = v;
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
  "
else
  echo "✅ @amityco/ts-sdk is already on latest ($LOCAL_SDK)"
fi
```

After resolving conflicts (and updating ts-sdk if needed), run `pnpm install` to regenerate the lockfile:

```sh
pnpm install
```

If ts-sdk was upgraded, commit it along with the lockfile:

```sh
git add package.json pnpm-lock.yaml
git commit -m "chore: upgrade @amityco/ts-sdk to >=$LATEST_SDK"
```

### 7 — Run build to verify no errors after merge

Run both the library build and the Storybook build — Storybook catches story/import errors the library build alone can miss:

```sh
pnpm run build
pnpm run storybook:build
```

If either build fails, fix the errors before proceeding. Do **not** continue to the next step with a broken build.

### 8 — Human review: confirm upstream changes look correct

**Stop here and ask the user to review the merged changes before continuing.**

Show a summary of what changed:

```sh
git diff HEAD~1 --stat
```

Ask the user to confirm:
- The correct files were pulled from upstream
- `package.json` still has the OpenSource `name` (`@amityco/ui-kit-open-source`) and the expected `version`
- No private/internal files or secrets were accidentally included
- `CHANGELOG.md` was NOT overwritten by upstream

**Do not proceed until the user explicitly confirms the changes look correct.**

### 9 — Push the release branch and open a PR immediately

```sh
git push -u origin release/v<VERSION>
```

Open the PR to merge the release branch back into `develop` right away (it can be merged once the pipeline succeeds):

```sh
gh pr create \
  --repo AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource \
  --base develop \
  --head release/v<VERSION> \
  --title "Release v<VERSION>" \
  --body ""
```

### 10 — Trigger the GitHub Actions production pipeline via GitHub CLI

> **Always pass `--repo AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource` explicitly.** `gh` resolves the default repo from local config and frequently points at the **internal** repo `AmityCo/Amity-Social-Cloud-UIKit-Web`. Dispatching there fails with:
>
> ```
> HTTP 422: No ref found for: release/v<VERSION>
> ```
>
> If you hit this, the ref is fine — you dispatched against the wrong repo. Confirm with `gh repo view --json nameWithOwner -q .nameWithOwner` and re-run with the explicit `--repo` flag below. Also ensure the branch is pushed first (the workflow runs on the branch ref).

**For a normal release** (patch / minor / major / stable), use:

```sh
gh workflow run production.yaml \
  --repo AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource \
  --ref release/v<VERSION> \
  -f release_as=<patch|minor|major|stable> \
  -f pre-release=none
```

**For a beta (or alpha) pre-release only** (no version bump type):

```sh
gh workflow run production.yaml \
  --repo AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource \
  --ref release/v<VERSION> \
  -f release_as=none \
  -f pre-release=<beta|alpha>
```

**For a pre-release with an explicit bump type** (e.g. patch + beta):

```sh
gh workflow run production.yaml \
  --repo AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource \
  --ref release/v<VERSION> \
  -f release_as=<patch|minor|major> \
  -f pre-release=<beta|alpha>
```

After triggering, share this link with the user to monitor the pipeline:

**https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web-OpenSource/actions/workflows/production.yaml**

### 11 — Verify the NPM release

```sh
npm view @amityco/ui-kit-open-source version
```

Or check: https://www.npmjs.com/package/@amityco/ui-kit-open-source

## Post-Release

Notify the PO in `Amity Deployment & Release Squad > Web` that the new version has been released.

## Notes

- The production pipeline uses [standard-version](https://www.npmjs.com/package/standard-version) for versioning.
- Workflow inputs for `release_as`: `none`, `major`, `minor`, `patch`, `stable`
- Workflow inputs for `pre-release`: `none`, `alpha`, `beta`
- When merging from upstream, **always** keep the OpenSource `name` and `version` in `package.json` — never overwrite them with the upstream private package name.
- Always push the release branch **before** triggering the workflow — the workflow runs on the branch ref.
- The `pnpm-lock.yaml` conflict must always be resolved by keeping current and re-running `pnpm install`.
