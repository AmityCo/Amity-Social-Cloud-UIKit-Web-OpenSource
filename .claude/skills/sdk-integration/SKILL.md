---
name: sdk-integration
description: Use when reading from or writing to the Amity SDK anywhere in src/v4/ — adding a hook, calling a repository method, or wiring live objects, live collections and one-shot queries
---

# SDK Integration

Every SDK read and write in `src/v4/` goes through a hook in one of three folders.

---

## The spec says which kind it is

**The SDK spec defines whether an API is a live object, a live collection, or a normal
async call. Read it there — do not infer it from the method name or guess from the return
type.**

| Spec says                    | Folder               | Primitive             |
| ---------------------------- | -------------------- | --------------------- |
| Live object                  | `hooks/objects/`     | `useLiveObjectV4`     |
| Live collection              | `hooks/collections/` | `useLiveCollectionV4` |
| Normal async — one-shot read | `hooks/queries/`     | `useQuery`            |
| Normal async — write         | `hooks/queries/`     | `useMutation`         |

Each module — `core`, `social`, `chat` — has its own copy of these folders. Put the hook in
the module that owns the feature.

---

## Naming

| Folder               | Suffix                        | Example                                          |
| -------------------- | ----------------------------- | ------------------------------------------------ |
| `hooks/objects/`     | `Object`                      | `useChannelObject`                               |
| `hooks/collections/` | `Collection`, **plural noun** | `useMessagesCollection`, `useChannelsCollection` |
| `hooks/queries/`     | `Query`                       | `useFlagMessageQuery`                            |

Import from the **folder barrel**, never the file:

```ts
import { useChannelObject } from '~/v4/chat/hooks/objects';
import { useChannelsCollection } from '~/v4/chat/hooks/collections';
import { useMessageDeleteQuery } from '~/v4/chat/hooks/queries';
```

Don't reuse a hook name that already exists in another module — imports come from a barrel,
so the wrong one type-checks fine.

---

## Live objects

```ts
const { channel, isLoading, error } = useChannelObject({ channelId });
```

- Wrap `useLiveObjectV4` — never call it from a component.
- Return `{ item, isLoading, error }` with `item` renamed to the SDK noun.
- One file per SDK noun.
- Pass `shouldCall: !!param` to skip fetching until the param is ready.

Reference: `src/v4/chat/hooks/objects/useChannelObject.ts`

---

## Live collections

```ts
const { items, isLoadingFirstPage, hasMore, loadMore, isLoading } = useChannelsCollection({ … });
```

- Wrap `useLiveCollectionV4` — never call it from a component.
- The names are `hasMore` / `loadMore` — **not** `hasNextPage` / `loadNextPage`.
- `isLoadingFirstPage` → full-screen skeleton. `isLoading && !isLoadingFirstPage` → skeleton
  rows appended at the bottom.
- One file per SDK list method.
- **Name the noun plural** — `useMessagesCollection`, not `useMessageCollection`.
  Existing singular hooks stay as they are.
- Pass `shouldCall: false` until params are ready.

Reference: `src/v4/chat/hooks/collections/useChannelsCollection.ts`

---

## Type params from the SDK

Never hand-roll `string` or `string[]` for something the SDK already types:

```ts
type FlagMessageParam = Parameters<typeof MessageRepository.flagMessage>;
type FlagMessagePayload = Awaited<ReturnType<typeof MessageRepository.flagMessage>>;
```

---

## Mutations

A `Query` hook is the single owner of one SDK side-effect: it holds the `useMutation`, the
toast wiring, and exposes one verb. It does **not** own UI state — overlay and sheet
open/close state belongs to a feature-local hook under `features/<feature>/hooks/` that
consumes this one.

```ts
const { mutateAsync } = useMutation<Payload, Error, Param>({
  mutationFn: MessageRepository.deleteMessage,
  onError: () => error({ content: TOAST.DELETE.FAILED, alignment }),
});

async function deleteMessage(payload: Param): Promise<void> {
  await mutateAsync(payload, { onSuccess, onError });
}
```

1. **Explicit generics** — `useMutation<Payload, Error, Param>`.
2. **`mutationFn` points straight at the SDK function.** No wrapper arrow. If the SDK takes
   positional args, define a local payload object type and adapt inside `mutationFn` — never
   expose positional args to callers.
3. **`await mutateAsync(params, { onSuccess, onError })`.** No `try`/`catch` — awaiting keeps
   the caller's flow linear and works with `react-hook-form`'s `isSubmitting`.
4. **Bare verb names** — `addReaction`, `block`, `deleteMessage`. Never `requestX` or `handleX`.
5. **The hook's `onError` owns the toast.** Callers don't pass error callbacks for toast-only
   failures. Resolve `toastAlignment` from `useResponsive()`.
6. **Return `Promise<void>`.** Drop SDK return values at the hook boundary unless a caller
   needs them.
7. **Plain function, not `useCallback`** — the verb is called from event handlers.
8. **Pair semantic opposites in one hook, two `useMutation` blocks** — flag/unflag,
   mute/unmute, add/remove members. Return both verbs side by side. Don't combine unrelated
   operations.
9. **Read the created resource in `onSuccess`** — `onSuccess: (result) => result?.data?.channelId`.
   Route failures through the existing providers (`useNotifications`, `useConfirmContext`).
   Never rethrow.
10. **Optional `afterX` in the verb's options** — `{ afterDelete }`, `{ afterResend }`, for
    closing a sheet or viewer. Declare an explicit `<Verb>Options` type next to the hook (no
    `Request` prefix) and re-export it from the barrel.

Reference: `src/v4/chat/hooks/queries/useFlagMessageQuery.ts`

---

## Read queries

```ts
export function useUserReportQuery({ userId, enabled = true }: Param) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['asc-uikit', 'UserReport', userId],
    queryFn: () => UserRepository.isUserFlaggedByMe(userId),
    enabled: enabled && !!userId,
    staleTime: STALE_TIME_5_MINUTES,
  });

  return { data, isLoading, error };
}
```

- **Gate on the params, not the client.** `enabled: enabled && !!userId`. `AmityUIKitProvider`
  guarantees a non-null client before mount, so `!!client` is noise — use `client!.http`
  directly where you need it.
- Take an `enabled?: boolean` prop defaulting to `true`. (Live objects and collections use
  `shouldCall` instead — keep the two distinct.)
- **Lean return** — `{ <name>, isLoading, error }`. No `XxxResult` interface, no `refetch`
  unless a caller uses it.
- **`staleTime: STALE_TIME_*`** from `~/v4/constants/query`. Inline a literal only when the
  value is genuinely specific, like `0` for live polling.
- **queryKey** starts `['asc-uikit', …]`.
- **The key must include everything that changes the result.** If a response is
  viewer-specific, the viewer belongs in the key — keying on topic alone will serve one
  user's data to another.

---

## Gate

`pnpm verify:sdk-hooks` checks every rule above. It also runs on staged `src/v4/` files via
lint-staged, so a commit is only judged on the files it touches.

```
node governance/gates/06-check-sdk-hooks.mjs                  # whole tree
node governance/gates/06-check-sdk-hooks.mjs path/to/hook.ts  # one file
node governance/gates/06-check-sdk-hooks.mjs --json           # machine-readable
```
