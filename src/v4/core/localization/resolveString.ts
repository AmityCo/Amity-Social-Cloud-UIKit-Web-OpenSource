/**
 * UIKit v4 — String Resolution Chain (Levels 2–5)
 *
 * Implements the priority chain from the UIKit Cross-Platform Localization Spec §1:
 *
 *   Level 1: Config text (remote)  — handled by useAmityElement / CustomizationProvider
 *   Level 2: Programmatic override — setStringOverrides / clearStringOverrides
 *   Level 3: Locale bundle         — setLocaleBundle / clearLocaleBundle
 *   Level 4: Library default       — defaultLocaleBundle (auto-generated en.ts)
 *   Level 5: Key name fallback     — returns the raw key string
 *
 * Usage:
 *   import { resolveString } from '~/v4/core/localization/resolveString';
 *   const text = resolveString('amity_social_create_post');
 *   const text = resolveString('amity_social_items_count', 42);  // format arg
 */

import { defaultLocaleBundle } from './defaults/en';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type LocaleBundle = Record<string, string>;

/** A format arg can be a string or number (matches iOS/Android %s / %d). */
export type FormatArg = string | number;

// ---------------------------------------------------------------------------
// In-memory runtime state (module singletons — reset between test runs via reset())
// ---------------------------------------------------------------------------

let _overrides: LocaleBundle = {};
let _localeBundle: LocaleBundle | null = null;

// ---------------------------------------------------------------------------
// Public API — Level 2: Programmatic overrides
// ---------------------------------------------------------------------------

/**
 * Register key–value overrides that win over locale bundles and library defaults.
 * Multiple calls MERGE (not replace). Later value wins for the same key.
 *
 * @example
 *   setStringOverrides({ amity_common_cancel: 'Dismiss' });
 */
export function setStringOverrides(overrides: LocaleBundle): void {
  _overrides = { ..._overrides, ...overrides };
}

/**
 * Clear all programmatic overrides. Keys fall through to Level 3 / Level 4.
 */
export function clearStringOverrides(): void {
  _overrides = {};
}

// ---------------------------------------------------------------------------
// Public API — Level 3: Locale bundle
// ---------------------------------------------------------------------------

/**
 * Set (or replace) the active locale bundle.
 * REPLACE semantics: calling this again with a partial dict discards previous keys.
 *
 * @param bundle  key → translated string for the desired locale
 *
 * @example
 *   setLocaleBundle({ amity_common_cancel: 'キャンセル', amity_common_delete: '削除' });
 */
export function setLocaleBundle(bundle: LocaleBundle): void {
  _localeBundle = { ...bundle };
}

/**
 * Deactivate the locale bundle. Keys fall through to Level 4 (library defaults).
 */
export function clearLocaleBundle(): void {
  _localeBundle = null;
}

// ---------------------------------------------------------------------------
// Core resolver
// ---------------------------------------------------------------------------

/**
 * Resolve a localization key to its English (or translated) string.
 *
 * Resolution order:
 *   1. Config text (Level 1) — not resolved here; handled by useAmityElement
 *   2. Programmatic override (Level 2)
 *   3. Active locale bundle  (Level 3)
 *   4. Library default       (Level 4)
 *   5. Raw key name          (Level 5 — indicates a missing library default)
 *
 * @param key         Canonical amity_* key e.g. 'amity_social_create_post'
 * @param formatArgs  Optional positional arguments applied to %s / %d / %1$s placeholders
 *
 * @example
 *   resolveString('amity_social_create_post')          // → 'Create post'
 *   resolveString('amity_social_items_count', 5)       // → '5 items'
 */
export function resolveString(key: string, ...formatArgs: FormatArg[]): string {
  // Level 2
  if (Object.prototype.hasOwnProperty.call(_overrides, key)) {
    return applyFormat(_overrides[key], formatArgs);
  }

  // Level 3
  if (_localeBundle !== null && Object.prototype.hasOwnProperty.call(_localeBundle, key)) {
    return applyFormat(_localeBundle[key], formatArgs);
  }

  // Level 4
  if (Object.prototype.hasOwnProperty.call(defaultLocaleBundle, key)) {
    return applyFormat(defaultLocaleBundle[key], formatArgs);
  }

  // Level 5 — safety net; should never fire for UIKit-internal keys
  return key;
}

// ---------------------------------------------------------------------------
// Format string helpers
// ---------------------------------------------------------------------------

/**
 * Apply positional format arguments to a string.
 *
 * Supports:
 *   %s  / %1$s  / %2$s  — string substitution
 *   %d  / %1$d  / %2$d  — integer substitution
 *   %@              — iOS-style string substitution
 *
 * Arguments are consumed in order of their declared index (1-based $n or positional).
 */
export function applyFormat(template: string, args: FormatArg[]): string {
  if (args.length === 0) return template;

  // Indexed: %1$s, %2$d, …
  let maxIndexUsed = 0;
  let result = template.replace(/%(\d+)\$[sd@]/g, (_, idx) => {
    const n = parseInt(idx, 10);
    if (n > maxIndexUsed) maxIndexUsed = n;
    const arg = args[n - 1];
    return arg !== undefined ? String(arg) : _;
  });

  // Positional: %s, %d, %@ — replaced left-to-right, starting after any indexed args
  let pos = maxIndexUsed;
  result = result.replace(/%[sd@]/g, () => {
    const arg = args[pos];
    pos++;
    return arg !== undefined ? String(arg) : '%s';
  });

  return result;
}

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

/** Reset all runtime state. Use this in test beforeEach / afterEach. */
export function _resetLocalizationState(): void {
  _overrides = {};
  _localeBundle = null;
}

/** Read-only snapshot of current state (for testing assertions). */
export function _getLocalizationState(): {
  overrides: Readonly<LocaleBundle>;
  localeBundle: Readonly<LocaleBundle> | null;
} {
  return { overrides: _overrides, localeBundle: _localeBundle };
}
