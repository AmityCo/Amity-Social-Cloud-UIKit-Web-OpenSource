---
name: localization
description: Use when adding, changing or resolving any user-visible string in src/v4/ — picking a key, populating en.json and th.json, or choosing between useString and resolveString.
---

# Localization

Every visible string resolves from the catalog. The keys are a **cross-platform contract** shared
with iOS and Android, which is why adding one is not a local decision.

## Resolving a string

| Where                                                                               | Use                                                                                 |
| ----------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Component body (render)                                                             | `useString('amity_chat_dm_action_block_user')` — re-renders on language change      |
| Callback fired outside render — `onSuccess`, `onError`, `onPress`, a confirm dialog | `resolveString('amity_chat_block_success')` — reads the current value when it fires |
| Inside a component that may be config-overridden                                    | `resolveText(key)` from `useAmityElement` — config text wins, then the catalog      |

A `Query` hook resolves its toast strings with `resolveString`, because the toast fires from a
React Query callback rather than render. Same for every string passed to
`useConfirmContext().confirm({ title, content, okText, cancelText })`.

## Placeholders are `%s` / `%d`

Not `{0}`, not `{name}` — the format matches iOS and Android.

```json
"amity_chat_dm_block_user_message": "%s won't be able to send you the message."
```

```ts
resolveString('amity_chat_dm_block_user_message', displayName);
```

Substitution is left-to-right; multiple placeholders take multiple positional args. **Every locale
must carry the same number of placeholders for a key** — the gate checks this.

## Before adding a key

Net-new keys need the user's approval. In order:

1. **Search the catalog for an empty pre-allocated key** that matches the surface —
   `grep -nE '"amity_chat_<verb>_' src/v4/core/localization/defaults/en.json`. Many ship as `""`
   waiting to be populated; populating one needs no approval.
2. **Reuse a close match.** A "Cancel" button uses the canonical cancel key, not a per-feature
   variant. Search before inventing.
3. **Check iOS and Android** — `AmityUIKitIOS` and `Amity-Social-Cloud-UIKit-Android` — for the
   canonical key name and its EN/TH values, and reuse them. The key is the contract; inventing a
   Web-only spelling for a string the other platforms already have forks it.
4. **Only then propose the key and value to the user, and wait.** Never add one silently.

When a new key is unavoidable, mirror its populated siblings — confirm buttons follow
`amity_<area>_<verb>_confirm_button`, failure toasts follow `amity_<area>_toast_<verb>_failed`.

## Both locales, every time

`defaults/en.json` is the source of truth; `defaults/th.json` must carry the same keys. A key added
to one and not the other renders the raw key name to half the users.

## Naming

`amity_<area>_<topic>_<purpose>` — `amity_chat_dm_block_user_title`,
`amity_social_toast_cancel_invitation_failed_toast`.

## Gate

`pnpm verify:localization` checks the catalog against the code.

```
node governance/gates/07-check-localization.mjs                  # whole tree
node governance/gates/07-check-localization.mjs path/to/X.tsx    # one file
node governance/gates/07-check-localization.mjs --json           # machine-readable
```

It reports a key resolved but absent from the catalog, a key that resolves to an empty string,
keys present in one locale and not the other, placeholder counts that disagree between locales,
and keys nothing resolves. Findings are **advisory** by nature: because the keys are a
cross-platform contract, no fix here is purely local — check the other platforms before deleting
or renaming.
