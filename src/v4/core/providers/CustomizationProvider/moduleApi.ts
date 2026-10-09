import * as AmitySDK from '@amityco/ts-sdk';

import { AMITY_API_MODULE, AMITY_API_METHOD_MODULE } from './moduleGraph';

/**
 * Which module owns an SDK function, resolved from the function itself.
 *
 * The view layer already refuses to render a disabled module, but a React hook
 * cannot be called conditionally: every `useLiveCollection` sitting above an
 * `if (isExcluded) return null` still subscribes. The request goes out for a
 * feature the customer never bought, and the backend now answers those with an
 * error rather than an empty result.
 *
 * Resolving the owner from the fetcher means the guard lands in the five live
 * hooks instead of at every call site, so a call site cannot forget to pass it.
 * Identity, not name: two repositories may both expose `getPosts`, and a string
 * comparison would gate the wrong one.
 */
const OWNER = new WeakMap<object, string>();

let built = false;

const claim = (fn: unknown, module: string) => {
  if (typeof fn === 'function') OWNER.set(fn as object, module);
};

/** A repository's members are not all plain: the SDK hangs a cache reader off
 *  the query function itself, as `getCategory.locally`. A function is not an
 *  object to `typeof`, so walking only objects left those unclaimed — and an
 *  unclaimed function reads as base layer, which is to say always on. */
const members = (value: unknown): unknown[] =>
  value && (typeof value === 'object' || typeof value === 'function')
    ? Object.values(value as Record<string, unknown>)
    : [];

/** The SDK groups the follow graph under `UserRepository.Relationship`, so a
 *  repository's methods are not all one level down. */
const leaf = (repo: unknown, method: string): unknown => {
  const direct = (repo as Record<string, unknown>)?.[method];
  if (direct) return direct;
  for (const namespace of members(repo)) {
    const nested = (namespace as Record<string, unknown>)?.[method];
    if (nested) return nested;
  }
  return undefined;
};

/** Built on first use rather than at import time: this module must not depend
 *  on evaluating before or after the SDK's own module initialisation. */
const build = () => {
  if (built) return;
  built = true;

  const sdk = AmitySDK as unknown as Record<string, unknown>;

  // A repository entry owns every method on it, one namespace deep.
  Object.entries(AMITY_API_MODULE).forEach(([stem, module]) => {
    const repo = sdk[`${stem}Repository`];
    members(repo).forEach((member) => {
      claim(member, module);
      members(member).forEach((nested) => claim(nested, module));
    });
  });

  // A leaf entry overrides the repository it lives on: `User` is base identity
  // and always present, `User.follow` is a module a customer can decline.
  Object.entries(AMITY_API_METHOD_MODULE).forEach(([path, module]) => {
    const [stem, method] = path.split('.');
    claim(leaf(sdk[`${stem}Repository`], method), module);
  });
};

/**
 * The module that owns this SDK function, or undefined when no module does.
 *
 * Undefined means base layer — reading a user, building a file URL — which is
 * always on. It also means "not in the table", and those two are told apart by
 * `apollo check`, not at runtime: shipping a hard failure for an unclassified
 * api would take down surfaces that work.
 */
export const moduleOfSdkFn = (fn: unknown): string | undefined => {
  build();
  return typeof fn === 'function' ? OWNER.get(fn as object) : undefined;
};

/**
 * The same gate, for callers that are not React.
 *
 * `useSdkFnEnabled` covers the six live hooks, but a hook is not the only way to
 * reach a repository: `AdEngine` is a singleton the provider builds, and its
 * session listener fetched the network ads whether or not the customer bought
 * Ads. That is the Web counterpart of the native rule that a constructor may
 * fetch only if every instantiation of it is deferred — here the instantiation
 * sits in the provider body, above every gate.
 *
 * The resolver is injected rather than imported so this file keeps no copy of
 * the bundle traversal. A second copy of that walk is a second answer to the
 * same question, and the two drift.
 */
let gate: ((fn: unknown) => boolean) | null = null;

/**
 * Resolved the first time a resolver is installed.
 *
 * The install order is not ours to choose: `AmityUIKitProvider` establishes the
 * session from an effect, and `CustomizationProvider` — the only thing that
 * knows the config — may not have rendered by the time the session comes up. A
 * caller that asked in that window got `true` for every module, which is how
 * the ads fetch went out for a customer who had switched Ads off.
 */
let ready: (() => void) | null = null;
let readyPromise: Promise<void> | null = null;

const gateReady = () => {
  if (!readyPromise) {
    readyPromise = gate
      ? Promise.resolve()
      : new Promise<void>((resolve) => {
          ready = resolve;
        });
  }
  return readyPromise;
};

export const setSdkFnGate = (resolver: ((fn: unknown) => boolean) | null) => {
  gate = resolver;
  if (resolver && ready) {
    ready();
    ready = null;
  }
};

/**
 * Wait for the config to be known, then ask.
 *
 * Bounded, because a host that never mounts a provider must still get its ads
 * rather than hang: past the deadline this answers the way it did before the
 * gate existed. `settle` is short enough that a session round trip has not
 * finished and long enough that a render always has.
 */
export const isSdkFnEnabledWhenReady = async (fn: unknown, settle = 4000): Promise<boolean> => {
  if (!gate) {
    await Promise.race([gateReady(), new Promise((r) => setTimeout(r, settle))]);
  }
  return isSdkFnEnabledNow(fn);
};

/**
 * Whether the module behind an SDK function is on, right now.
 *
 * Answers `true` until the provider has installed a resolver: the config is not
 * known yet, and refusing every call before it loads would break the session
 * itself. Once installed it is the provider's own `isFeatureEnabled`.
 */
export const isSdkFnEnabledNow = (fn: unknown): boolean => (gate ? gate(fn) : true);
