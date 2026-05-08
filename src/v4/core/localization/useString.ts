/**
 * useString — React hook wrapper for the UIKit localization resolver.
 *
 * Returns the resolved string for a key, re-rendering automatically when the
 * locale bundle or overrides change via the LocaleProvider context.
 *
 * @example
 *   const label = useString('amity_common_button_cancel');
 *   const msg   = useString('amity_social_items_count', count);
 */

import { useContext } from 'react';
import { LocaleContext } from './LocaleProvider';
import { resolveString, type FormatArg } from './resolveString';

/**
 * Resolve a localization key to its display string.
 *
 * Thin wrapper around {@link resolveString} that subscribes to the
 * {@link LocaleContext} so the component re-renders whenever locale or
 * overrides change.
 *
 * @param key         Canonical amity_* key
 * @param formatArgs  Optional positional format arguments (%s / %d / %@)
 */
export function useString(key: string, ...formatArgs: FormatArg[]): string {
  // Subscribe to context updates — triggers re-render when locale changes
  useContext(LocaleContext);
  return resolveString(key, ...formatArgs);
}
