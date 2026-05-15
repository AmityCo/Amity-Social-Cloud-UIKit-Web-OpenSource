/**
 * UIKit v4 Localization — Automated tests
 *
 * Covers all test cases specified in Cross-Platform Localization Spec §7:
 *   §7.1  Resolution priority order
 *   §7.2  Override behavior
 *   §7.3  Locale bundle behavior
 *   §7.5  Format string arguments
 *
 * Note: §7.4 (Config removal fallback / Level 1) is tested in
 * CustomizationProvider.test.tsx because it depends on useAmityElement.
 * §7.6 (Bypass detection) is enforced via ESLint — see .eslintrc.js.
 */

import {
  resolveString,
  setStringOverrides,
  clearStringOverrides,
  setLocaleBundle,
  clearLocaleBundle,
  applyFormat,
  _resetLocalizationState,
} from '~/v4/core/localization/resolveString';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

beforeEach(() => {
  _resetLocalizationState();
});

// ---------------------------------------------------------------------------
// §7.1 — Resolution priority order
// ---------------------------------------------------------------------------

describe('§7.1 Resolution priority order', () => {
  it('Level 2 override wins over locale bundle', () => {
    setStringOverrides({ amity_common_cancel: 'A' });
    setLocaleBundle({ amity_common_cancel: 'B' });
    expect(resolveString('amity_common_button_cancel')).toBe('A');
  });

  it('Level 3 locale bundle wins over library default', () => {
    // amity_common_cancel has a library default of 'Cancel' (from en.ts)
    setLocaleBundle({ amity_common_cancel: 'C' });
    expect(resolveString('amity_common_button_cancel')).toBe('C');
  });

  it('Level 4 library default used when nothing else is set', () => {
    // amity_common_cancel library default is 'Cancel'
    expect(resolveString('amity_common_button_cancel')).toBe('Cancel');
  });

  it('Level 5 key-name fallback when no default exists', () => {
    const key = 'amity_nonexistent_key_xyz_test';
    expect(resolveString(key)).toBe(key);
  });
});

// ---------------------------------------------------------------------------
// §7.2 — Override behavior
// ---------------------------------------------------------------------------

describe('§7.2 Override behavior', () => {
  it('multiple setStringOverrides calls merge', () => {
    setStringOverrides({ amity_common_cancel: 'A' });
    setStringOverrides({ amity_common_delete: 'B' });
    expect(resolveString('amity_common_button_cancel')).toBe('A');
    expect(resolveString('amity_common_button_delete')).toBe('B');
  });

  it('later value wins when same key set twice', () => {
    setStringOverrides({ amity_common_cancel: 'A' });
    setStringOverrides({ amity_common_cancel: 'B' });
    expect(resolveString('amity_common_button_cancel')).toBe('B');
  });

  it('empty-string override is valid (does NOT fall through)', () => {
    setStringOverrides({ amity_common_cancel: '' });
    expect(resolveString('amity_common_button_cancel')).toBe('');
  });

  it('clearStringOverrides falls through to locale bundle', () => {
    setStringOverrides({ amity_common_cancel: 'A' });
    setLocaleBundle({ amity_common_cancel: 'B' });
    clearStringOverrides();
    expect(resolveString('amity_common_button_cancel')).toBe('B');
  });
});

// ---------------------------------------------------------------------------
// §7.3 — Locale bundle behavior
// ---------------------------------------------------------------------------

describe('§7.3 Locale bundle behavior', () => {
  it('setLocaleBundle replaces entire bundle (not merge)', () => {
    setLocaleBundle({ amity_common_cancel: 'A', amity_common_delete: 'B' });
    setLocaleBundle({ amity_common_cancel: 'C' }); // K2 removed
    expect(resolveString('amity_common_button_cancel')).toBe('C');
    // amity_common_delete should fall through to library default now
    const libDefault = resolveString('amity_common_button_delete');
    // It must NOT be 'B' (the old locale value)
    expect(libDefault).not.toBe('B');
  });

  it('partial bundle works — missing keys fall through to library default', () => {
    setLocaleBundle({ amity_common_cancel: 'キャンセル' }); // only cancel
    expect(resolveString('amity_common_button_cancel')).toBe('キャンセル');
    // amity_common_delete has a library default; should not be the locale value
    const del = resolveString('amity_common_button_delete');
    expect(typeof del).toBe('string');
    expect(del.length).toBeGreaterThan(0);
    expect(del).not.toBe('キャンセル');
  });

  it('clearLocaleBundle falls through to library default', () => {
    setLocaleBundle({ amity_common_cancel: 'A' });
    clearLocaleBundle();
    expect(resolveString('amity_common_button_cancel')).toBe('Cancel');
  });
});

// ---------------------------------------------------------------------------
// §7.5 — Format string arguments
// ---------------------------------------------------------------------------

describe('§7.5 Format string arguments', () => {
  it('applies format args through setStringOverrides', () => {
    setStringOverrides({ amity_test_fmt: 'Hello, %s! You have %d items.' });
    expect(resolveString('amity_test_fmt', 'Alice', 5)).toBe('Hello, Alice! You have 5 items.');
  });

  it('applies format args through locale bundle', () => {
    setLocaleBundle({ amity_test_fmt: 'こんにちは、%s！%d件あります。' });
    expect(resolveString('amity_test_fmt', 'Alice', 5)).toBe('こんにちは、Alice！5件あります。');
  });

  it('indexed format args (%1$s, %2$d) work correctly', () => {
    setStringOverrides({ amity_test_idx: '%2$d items for %1$s' });
    expect(resolveString('amity_test_idx', 'Bob', 3)).toBe('3 items for Bob');
  });

  it('iOS-style %@ placeholder works', () => {
    setStringOverrides({ amity_test_ios: 'Posted by %@' });
    expect(resolveString('amity_test_ios', 'Alice')).toBe('Posted by Alice');
  });

  it('returns raw key when key is unknown (format not applied to key name)', () => {
    const key = 'amity_unknown_key_test_xyz';
    // Format args should not corrupt the key fallback
    expect(resolveString(key, 'Alice', 5)).toBe(key);
  });
});

// ---------------------------------------------------------------------------
// applyFormat unit tests
// ---------------------------------------------------------------------------

describe('applyFormat', () => {
  it('returns template unchanged when no args', () => {
    expect(applyFormat('Hello world', [])).toBe('Hello world');
  });

  it('replaces positional %s in order', () => {
    expect(applyFormat('%s and %s', ['A', 'B'])).toBe('A and B');
  });

  it('replaces indexed %1$s, %2$s', () => {
    expect(applyFormat('%2$s first, %1$s second', ['B', 'A'])).toBe('A first, B second');
  });

  it('handles mixed indexed and positional', () => {
    expect(applyFormat('%1$s is %d years old', ['Alice', 30])).toBe('Alice is 30 years old');
  });
});
