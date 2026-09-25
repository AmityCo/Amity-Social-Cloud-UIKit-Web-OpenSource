---
name: release-uikit-web
description: 'Release React Web UIKit (@amityco/ui-kit) to NPM. Use when: "release uikit web", "release ui-kit", "publish uikit web", "release web uikit to npm".'
argument-hint: 'Specify the version type: patch, minor, major, or beta (pre-release)'
---

# Release React Web UIKit (`@amityco/ui-kit`)

**Repository:** https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web  
**NPM:** https://www.npmjs.com/package/@amityco/ui-kit  
**GitHub Action:** https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web/actions/workflows/production.yaml

## Pre-Release

> **IMPORTANT:** Before releasing, tag the person giving the green light and get them to acknowledge the message prior to releasing. Better safe than sorry.

- Ask the user for the release type: `patch`, `minor`, `major`, `stable`, or a pre-release tag (`alpha` / `beta`).
- Confirm PO has given approval.

## Procedure

### 1 — Check for pending release PRs

Check if there are any unmerged release PRs that need to be merged into `develop` first:

```sh
gh pr list --repo AmityCo/Amity-Social-Cloud-UIKit-Web --base develop --state open
```

If there are open release PRs, ask the user to review and merge them before proceeding.

### 2 — Sync develop with remote

```sh
git checkout develop
git fetch origin
git pull origin develop
```

### 3 — Ensure `@amityco/ts-sdk` is pinned to the latest NPM release

`@amityco/ts-sdk` is declared in **both** `peerDependencies` and `devDependencies`. Both entries must be a caret range on the `latest` tag on NPM (e.g. `^7.28.0`) — never an exact pin and never a dev/nightly pre-release version. Upgrade if either entry fails.

```sh
PEER_SDK=$(node -p "require('./package.json').peerDependencies['@amityco/ts-sdk']")
DEV_SDK=$(node -p "require('./package.json').devDependencies['@amityco/ts-sdk']")
LATEST_SDK=$(npm view @amityco/ts-sdk dist-tags.latest)
echo "peerDependencies: $PEER_SDK"
echo "devDependencies:  $DEV_SDK"
echo "NPM latest:       $LATEST_SDK"

# Upgrade unless both entries are exactly ^<latest>
if [ "$PEER_SDK" != "^$LATEST_SDK" ] || [ "$DEV_SDK" != "^$LATEST_SDK" ]; then
  echo "⚠️  ts-sdk is outdated, exact-pinned, or on a dev/nightly build — setting ^$LATEST_SDK"
  sed -i '' -E "s#\"@amityco/ts-sdk\": \"[^\"]+\"#\"@amityco/ts-sdk\": \"^$LATEST_SDK\"#g" package.json
  pnpm install --lockfile-only
  git add package.json pnpm-lock.yaml
  git commit -m "chore: upgrade @amityco/ts-sdk to $LATEST_SDK"
  git push
else
  echo "✅ @amityco/ts-sdk is already on ^$LATEST_SDK"
fi
```

Confirm with the user before pushing if they want to review the lockfile changes first.

### 4 — Verify local version matches latest NPM release

Check that the version in `package.json` matches the latest published version on NPM. If they differ, it means a previous release may have failed or the local branch is ahead — confirm with the user before continuing.

```sh
LOCAL_VERSION=$(node -p "require('./package.json').version")
NPM_VERSION=$(npm view @amityco/ui-kit version)
echo "Local:  $LOCAL_VERSION"
echo "NPM:    $NPM_VERSION"
if [ "$LOCAL_VERSION" = "$NPM_VERSION" ]; then
  echo "✅ Versions match — safe to proceed."
else
  echo "⚠️  Version mismatch! Confirm with the user before continuing."
fi
```

If the versions **do not match**, first check whether an unmerged release PR is the cause before asking the user how to proceed:

```sh
gh pr list --repo AmityCo/Amity-Social-Cloud-UIKit-Web --base develop --state open --search "release"
```

If a release PR is found, ask the user to merge it first and then re-sync `develop` (go back to step 2) before continuing. If no release PR is found, stop and ask the user how to proceed.

### 5 — Checkout a new release branch from develop

Always cut the release branch from a freshly pulled `develop`, so it includes the ts-sdk bump from step 3 and anything merged since step 2. Replace `<VERSION>` with the target version without the `v` prefix (e.g. `4.1.0`):

```sh
git checkout develop
git pull origin develop
git checkout -b release/v<VERSION>
```

### 6 — Push the release branch and open a PR immediately

```sh
git push -u origin release/v<VERSION>
```

Open the PR to merge the release branch back into `develop` right away (it can be merged once the pipeline succeeds):

```sh
gh pr create \
  --repo AmityCo/Amity-Social-Cloud-UIKit-Web \
  --base develop \
  --head release/v<VERSION> \
  --title "Release v<VERSION>" \
  --body ""
```

### 7 — Trigger the GitHub Actions production pipeline via GitHub CLI

**For a normal release** (patch / minor / major / stable), use:

```sh
gh workflow run production.yaml \
  --repo AmityCo/Amity-Social-Cloud-UIKit-Web \
  --ref release/v<VERSION> \
  -f release_as=<patch|minor|major|stable> \
  -f pre-release=none
```

**For a beta (or alpha) pre-release only** (no version bump type):

```sh
gh workflow run production.yaml \
  --repo AmityCo/Amity-Social-Cloud-UIKit-Web \
  --ref release/v<VERSION> \
  -f release_as=none \
  -f pre-release=<beta|alpha>
```

**For a pre-release with an explicit bump type** (e.g. patch + beta):

```sh
gh workflow run production.yaml \
  --repo AmityCo/Amity-Social-Cloud-UIKit-Web \
  --ref release/v<VERSION> \
  -f release_as=<patch|minor|major> \
  -f pre-release=<beta|alpha>
```

After triggering, share this link with the user to monitor the pipeline:

**https://github.com/AmityCo/Amity-Social-Cloud-UIKit-Web/actions/workflows/production.yaml**

### 8 — Verify the NPM release

```sh
npm view @amityco/ui-kit version
```

Or check: https://www.npmjs.com/package/@amityco/ui-kit

## Post-Release

Notify the PO in `Amity Deployment & Release Squad > Web` that the new version has been released.

## Notes

- The production pipeline uses [standard-version](https://www.npmjs.com/package/standard-version) for versioning.
- Workflow inputs for `release_as`: `none`, `major`, `minor`, `patch`, `stable`
- Workflow inputs for `pre-release`: `none`, `alpha`, `beta`
- For a pure pre-release bump (e.g. bumping `4.1.0-beta.0` → `4.1.0-beta.1`), set `release_as=none` and `pre-release=beta`.
- Always push the release branch **before** triggering the workflow — the workflow runs on the branch ref.
