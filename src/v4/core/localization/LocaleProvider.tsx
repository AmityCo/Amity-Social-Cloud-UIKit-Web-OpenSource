/**
 * LocaleProvider — React context for UIKit v4 localization (Levels 2–3).
 *
 * Wraps the UIKit tree and exposes:
 *   - setLocaleBundle  — Level 3: register a complete locale bundle (replace semantics)
 *   - clearLocaleBundle — Level 3: deactivate locale (falls through to Level 4)
 *   - setStringOverrides — Level 2: merge-override individual keys
 *   - clearStringOverrides — Level 2: clear all overrides
 *
 * Whenever any of these are called the context value changes, triggering
 * re-renders of all useString() consumers.
 *
 * @example — in AmityUIKitProvider:
 *   <LocaleProvider>
 *     {children}
 *   </LocaleProvider>
 *
 * @example — consumer sets locale at runtime:
 *   const { setLocaleBundle } = useLocale();
 *   useEffect(() => {
 *     setLocaleBundle(jaLocaleBundle);
 *   }, []);
 */

import React, { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import {
  setLocaleBundle as _setLocaleBundle,
  clearLocaleBundle as _clearLocaleBundle,
  setStringOverrides as _setStringOverrides,
  clearStringOverrides as _clearStringOverrides,
  type LocaleBundle,
} from './resolveString';

// ---------------------------------------------------------------------------
// Context shape
// ---------------------------------------------------------------------------

export interface LocaleContextValue {
  /** Monotonically increasing counter — changes whenever locale or overrides update. */
  revision: number;
  /** Level 3: Register a locale bundle (replace semantics). */
  setLocaleBundle: (bundle: LocaleBundle) => void;
  /** Level 3: Deactivate locale (falls through to Level 4). */
  clearLocaleBundle: () => void;
  /** Level 2: Merge-set individual key overrides. */
  setStringOverrides: (overrides: LocaleBundle) => void;
  /** Level 2: Clear all programmatic overrides. */
  clearStringOverrides: () => void;
}

const _defaultContext: LocaleContextValue = {
  revision: 0,
  setLocaleBundle: _setLocaleBundle,
  clearLocaleBundle: _clearLocaleBundle,
  setStringOverrides: _setStringOverrides,
  clearStringOverrides: _clearStringOverrides,
};

export const LocaleContext = createContext<LocaleContextValue>(_defaultContext);
LocaleContext.displayName = 'AmityLocaleContext';

// ---------------------------------------------------------------------------
// Provider props
// ---------------------------------------------------------------------------

export interface LocaleProviderProps {
  children: React.ReactNode;
  /**
   * Optional initial locale bundle applied before first render.
   * Equivalent to calling setLocaleBundle() immediately.
   * When provided, takes precedence over localeMap auto-detection.
   */
  initialLocaleBundle?: LocaleBundle;
  /**
   * Optional initial overrides applied before first render.
   * Equivalent to calling setStringOverrides() immediately.
   */
  initialOverrides?: LocaleBundle;
  /**
   * A map of locale code → bundle used for automatic device-language detection.
   * When `initialLocaleBundle` is not set, the provider checks `navigator.language`
   * (exact match first, then language-prefix match, e.g. "ja" from "ja-JP").
   * Falls back to English library defaults when no match is found.
   *
   * @example
   *   localeMap={{ ja: jaLocale, th: thLocale }}
   */
  localeMap?: Record<string, LocaleBundle>;
}

// ---------------------------------------------------------------------------
// Device-locale helper
// ---------------------------------------------------------------------------

/**
 * Try to match the browser/device language against a caller-supplied locale map.
 * Returns the matched bundle, or undefined if no match (falls through to EN defaults).
 */
export function resolveDeviceLocale(
  localeMap: Record<string, LocaleBundle>,
): LocaleBundle | undefined {
  if (typeof navigator === 'undefined') return undefined;
  const lang = navigator.language ?? '';
  // 1. Exact match  (e.g. "ja-JP" → localeMap["ja-JP"])
  if (localeMap[lang]) return localeMap[lang];
  // 2. Language-prefix match  (e.g. "ja-JP" → localeMap["ja"])
  const prefix = lang.split('-')[0];
  if (prefix && localeMap[prefix]) return localeMap[prefix];
  return undefined;
}

// ---------------------------------------------------------------------------
// Provider component
// ---------------------------------------------------------------------------

export function LocaleProvider({
  children,
  initialLocaleBundle,
  initialOverrides,
  localeMap,
}: LocaleProviderProps): React.ReactElement {
  const [revision, setRevision] = useState<number>(() => {
    // Apply any initial values synchronously before first render.
    // initialLocaleBundle wins; fall back to device-language detection via localeMap.
    const bundle = initialLocaleBundle ?? (localeMap ? resolveDeviceLocale(localeMap) : undefined);
    if (bundle) _setLocaleBundle(bundle);
    if (initialOverrides) _setStringOverrides(initialOverrides);
    return 0;
  });

  const bump = useCallback(() => setRevision((r) => r + 1), []);

  const setLocaleBundle = useCallback(
    (bundle: LocaleBundle) => {
      _setLocaleBundle(bundle);
      bump();
    },
    [bump],
  );

  const clearLocaleBundle = useCallback(() => {
    _clearLocaleBundle();
    bump();
  }, [bump]);

  const setStringOverrides = useCallback(
    (overrides: LocaleBundle) => {
      _setStringOverrides(overrides);
      bump();
    },
    [bump],
  );

  const clearStringOverrides = useCallback(() => {
    _clearStringOverrides();
    bump();
  }, [bump]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      revision,
      setLocaleBundle,
      clearLocaleBundle,
      setStringOverrides,
      clearStringOverrides,
    }),
    [revision, setLocaleBundle, clearLocaleBundle, setStringOverrides, clearStringOverrides],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

// ---------------------------------------------------------------------------
// Consumer hook
// ---------------------------------------------------------------------------

/**
 * Access the locale control API from any component inside LocaleProvider.
 *
 * @example
 *   const { setLocaleBundle } = useLocale();
 *   setLocaleBundle(jaBundle);
 */
export function useLocale(): LocaleContextValue {
  return useContext(LocaleContext);
}
