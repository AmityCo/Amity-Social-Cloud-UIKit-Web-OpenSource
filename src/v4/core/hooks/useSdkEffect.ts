import { DependencyList, EffectCallback, useEffect } from 'react';

import { useSdkFnEnabled } from '~/v4/core/providers/CustomizationProvider/CustomizationProvider';

/**
 * useEffect that does not run while the module behind `fn` is switched off.
 *
 * The live hooks cover every sdk call that arrives as a `fetcher`. What is left
 * is the hand-rolled kind: a repository called straight out of an effect. Those
 * cannot be stopped by the caller's `if (isExcluded) return null`, because the
 * effect is declared before a component ever reaches that line — so the module
 * is asked here, inside the effect's own gate.
 *
 * `fn` is the sdk function the effect calls. It is passed for identity, never
 * called: the owner is resolved from the function itself, the same way the live
 * hooks resolve it, so the two paths cannot disagree about who owns what.
 */
export const useSdkEffect = (fn: unknown, effect: EffectCallback, deps: DependencyList) => {
  const enabled = useSdkFnEnabled(fn);

  useEffect(() => {
    if (!enabled) return;

    return effect();
  }, [...deps, enabled]);
};

export default useSdkEffect;
