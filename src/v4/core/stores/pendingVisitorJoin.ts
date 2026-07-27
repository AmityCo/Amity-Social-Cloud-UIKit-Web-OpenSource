/**
 * Module-level store that bridges a visitor's "Join community" intent across the
 * visitor -> signed-in transition.
 *
 * Why a module singleton (not React context)?
 * The Join button lives deep in the social component tree, while the sign-in
 * completion is observed at the root (AmityUIKitProvider). On web the visitor ->
 * signed-in transition typically remounts the provider (the host re-renders
 * AmityUIKitProvider with a real `userId`, or the CreateUserProfilePage flow
 * logs in and the host swaps to signed-in mode), which tears down any React
 * state living between those two points. A module-level value survives that
 * remount because it lives outside React entirely.
 *
 * This mirrors the React Native UIKit's `core/stores/pendingVisitorJoin` store.
 */

let pendingCommunityId: string | undefined;

/**
 * Record the community a visitor tried to join, to be auto-joined once they
 * finish signing in. Passing `undefined` clears any recorded intent.
 */
export const setPendingVisitorJoin = (communityId?: string): void => {
  pendingCommunityId = communityId;
};

/**
 * Read and clear the recorded community id (consume-once). Returns `undefined`
 * when there is no pending join. Clearing on read prevents a stale intent from
 * re-triggering on a later reconnect / re-render.
 */
export const consumePendingVisitorJoin = (): string | undefined => {
  const id = pendingCommunityId;
  pendingCommunityId = undefined;
  return id;
};

/**
 * Lifecycle of the post-sign-in auto-join:
 * - `idle`: nothing to do (no visitor join was pending, or it already settled).
 * - `in-progress`: a pending join was consumed and is being joined + allowed to
 *   propagate. The newsfeed uses this to stay in a loading state instead of
 *   flashing an empty / pre-join feed.
 * - `completed`: the join settled; the newsfeed can render (once) with the
 *   just-joined community included.
 */
export type VisitorAutoJoinStatus = 'idle' | 'in-progress' | 'completed';

let status: VisitorAutoJoinStatus = 'idle';

type Listener = () => void;

const statusListeners = new Set<Listener>();

const emit = () => {
  statusListeners.forEach((listener) => listener());
};

/**
 * Mark the auto-join as started. Called by the provider right after it consumes
 * a pending community id and before the network join, so any newsfeed that
 * mounts during the transition knows to wait rather than render the pre-join
 * feed.
 */
export const beginVisitorAutoJoin = (): void => {
  status = 'in-progress';
  emit();
};

/**
 * Mark the auto-join as settled (joined + propagated, or failed — either way the
 * newsfeed should stop waiting and render). Safe to call when idle.
 */
export const completeVisitorAutoJoin = (): void => {
  status = 'completed';
  emit();
};

/**
 * Current auto-join status. Pair with `subscribeVisitorAutoJoinStatus` via
 * `useSyncExternalStore` for a render-safe subscription.
 */
export const getVisitorAutoJoinStatus = (): VisitorAutoJoinStatus => status;

/**
 * Subscribe to auto-join status changes. Returns an unsubscribe function.
 * Designed for `useSyncExternalStore(subscribe, getVisitorAutoJoinStatus)`.
 */
export const subscribeVisitorAutoJoinStatus = (listener: Listener): (() => void) => {
  statusListeners.add(listener);
  return () => {
    statusListeners.delete(listener);
  };
};

// A monotonic counter that increments on every "refresh the feed now" pulse.
// Unlike the `status` value (which drives the newsfeed skeleton and can get
// stuck at 'completed'), this always changes, so a listener re-runs on EVERY
// signal — needed for auto-joins that happen while already signed-in (e.g. the
// Explore pinned-community auto-join) and for propagation-lag retry pulses.
let feedRefreshSignal = 0;
// The last signal value the newsfeed has already acted on. When a pulse fires
// while the newsfeed is UNMOUNTED (e.g. the user is on the Explore tab — tabs
// are conditionally rendered, so the newsfeed subscriber does not exist yet),
// there is no live listener to catch it. Tracking the consumed value lets the
// newsfeed detect, on its next mount, that a refresh is pending and act on it.
let feedRefreshConsumed = 0;
const feedRefreshListeners = new Set<Listener>();

/**
 * Pulse "a community was just auto-joined — refresh the global feed". Safe to
 * call repeatedly; each call re-notifies live subscribers AND bumps the signal
 * so a not-yet-mounted newsfeed can catch it on mount. Does NOT touch the
 * newsfeed skeleton status.
 */
export const signalFeedRefresh = (): void => {
  feedRefreshSignal += 1;
  feedRefreshListeners.forEach((listener) => listener());
};

/**
 * True if a feed-refresh pulse has fired that the newsfeed has not consumed yet
 * (e.g. it was unmounted when the Explore pinned auto-join completed). The
 * newsfeed checks this on mount and refreshes if so.
 */
export const hasPendingFeedRefresh = (): boolean => feedRefreshSignal > feedRefreshConsumed;

/** Mark all outstanding feed-refresh pulses as consumed. */
export const consumeFeedRefresh = (): void => {
  feedRefreshConsumed = feedRefreshSignal;
};

/** Subscribe to feed-refresh pulses. Returns an unsubscribe function. */
export const subscribeFeedRefresh = (listener: Listener): (() => void) => {
  feedRefreshListeners.add(listener);
  return () => {
    feedRefreshListeners.delete(listener);
  };
};
