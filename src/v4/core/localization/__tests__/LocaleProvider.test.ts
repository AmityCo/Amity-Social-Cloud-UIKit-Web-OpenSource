/**
 * UIKit v4 Localization — LocaleProvider device-language detection tests
 *
 * Tests for the exported `resolveDeviceLocale` helper from LocaleProvider.tsx.
 * The real implementation is imported directly so any changes to it are caught.
 *
 * All imports use relative paths because Jest's moduleNameMapper does not
 * configure the `~` alias separately from ts-jest (which does inherit tsconfig
 * paths, but we use relative imports here to be explicit and safe).
 */

import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
// eslint-disable-next-line no-restricted-imports
import { resolveString, setLocaleBundle, _resetLocalizationState } from '../resolveString';
// eslint-disable-next-line no-restricted-imports
import { resolveDeviceLocale, LocaleProvider } from '../LocaleProvider';

/**
 * Mount <LocaleProvider> synchronously via SSR renderToStaticMarkup.
 * This triggers the useState initializer (which sets the locale bundle)
 * without requiring jsdom or @testing-library/react.
 */
function mountLocaleProvider(props: Omit<React.ComponentProps<typeof LocaleProvider>, 'children'>) {
  renderToStaticMarkup(
    React.createElement(LocaleProvider, {
      ...props,
      children: React.createElement('span', null, 'test'),
    }),
  );
}

// ---------------------------------------------------------------------------
// Minimal locale bundles for testing
// ---------------------------------------------------------------------------

const EN_BUNDLE = { amity_social_button_cancel: 'Cancel', amity_common_ok: 'OK' };
const TH_BUNDLE = { amity_social_button_cancel: 'ยกเลิก', amity_common_ok: 'ตกลง' };
const JA_BUNDLE = { amity_social_button_cancel: 'キャンセル', amity_common_ok: 'OK' };

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mockNavigatorLanguage(lang: string) {
  Object.defineProperty(navigator, 'language', {
    configurable: true,
    get: () => lang,
  });
}

beforeEach(() => {
  _resetLocalizationState();
});

afterEach(() => {
  // Restore to a neutral value so tests don't bleed into each other
  mockNavigatorLanguage('en-US');
});

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('resolveDeviceLocale', () => {
  it('returns undefined when localeMap is empty', () => {
    mockNavigatorLanguage('th');
    expect(resolveDeviceLocale({})).toBeUndefined();
  });

  it('exact match: "th" matches localeMap["th"]', () => {
    mockNavigatorLanguage('th');
    expect(resolveDeviceLocale({ th: TH_BUNDLE })).toBe(TH_BUNDLE);
  });

  it('exact match: "ja-JP" matches localeMap["ja-JP"] (full tag wins)', () => {
    mockNavigatorLanguage('ja-JP');
    expect(resolveDeviceLocale({ 'ja-JP': JA_BUNDLE, ja: EN_BUNDLE })).toBe(JA_BUNDLE);
  });

  it('prefix match: "th-TH" matches localeMap["th"] when no "th-TH" key', () => {
    mockNavigatorLanguage('th-TH');
    expect(resolveDeviceLocale({ th: TH_BUNDLE })).toBe(TH_BUNDLE);
  });

  it('prefix match: "ja-JP" falls back to localeMap["ja"]', () => {
    mockNavigatorLanguage('ja-JP');
    expect(resolveDeviceLocale({ ja: JA_BUNDLE })).toBe(JA_BUNDLE);
  });

  it('no match: "fr-FR" returns undefined when map only has "th"', () => {
    mockNavigatorLanguage('fr-FR');
    expect(resolveDeviceLocale({ th: TH_BUNDLE })).toBeUndefined();
  });

  it('no match: returns undefined when navigator.language is empty string', () => {
    mockNavigatorLanguage('');
    expect(resolveDeviceLocale({ th: TH_BUNDLE })).toBeUndefined();
  });
});

describe('resolveString after device-locale bundle applied', () => {
  it('resolves Thai string when TH bundle is active', () => {
    mockNavigatorLanguage('th');
    const bundle = resolveDeviceLocale({ th: TH_BUNDLE });
    if (bundle) setLocaleBundle(bundle);
    expect(resolveString('amity_social_button_cancel')).toBe('ยกเลิก');
  });

  it('falls through to English default when no match (navigator = "en-US")', () => {
    mockNavigatorLanguage('en-US');
    // No bundle applied — library default (en.json) kicks in via Level 4
    // In this test environment en.json is NOT loaded, so the key returns itself.
    const bundle = resolveDeviceLocale({ th: TH_BUNDLE });
    expect(bundle).toBeUndefined();
    // No setLocaleBundle call → resolveString falls through to its own default
    expect(resolveString('amity_social_button_cancel', 'Cancel')).toBe('Cancel');
  });
});

// ---------------------------------------------------------------------------
// Integration: real <LocaleProvider> mounting via react-dom/server SSR.
// renderToStaticMarkup runs synchronously in Node and triggers the useState
// initializer (LocaleProvider.tsx:125) — exercising the real component logic.
// ---------------------------------------------------------------------------

describe('LocaleProvider wiring — initialLocaleBundle wins over localeMap', () => {
  it('initialLocaleBundle takes precedence over localeMap when both provided', () => {
    mockNavigatorLanguage('th');

    const explicitBundle = { amity_social_button_cancel: 'EXPLICIT' };
    const localeMap = { th: TH_BUNDLE };

    mountLocaleProvider({ initialLocaleBundle: explicitBundle, localeMap });

    expect(resolveString('amity_social_button_cancel')).toBe('EXPLICIT');
  });

  it('localeMap auto-detects Thai when navigator.language is "th" and no explicit bundle', () => {
    mockNavigatorLanguage('th');

    const localeMap = { th: TH_BUNDLE };
    mountLocaleProvider({ localeMap });

    expect(resolveString('amity_social_button_cancel')).toBe('ยกเลิก');
  });

  it('localeMap auto-detects Thai for "th-TH" (prefix match) when no explicit bundle', () => {
    mockNavigatorLanguage('th-TH');

    const localeMap = { th: TH_BUNDLE };
    mountLocaleProvider({ localeMap });

    expect(resolveString('amity_social_button_cancel')).toBe('ยกเลิก');
  });

  it('falls back to English library defaults when device language has no match in localeMap', () => {
    mockNavigatorLanguage('fr-FR');

    const localeMap = { th: TH_BUNDLE };
    mountLocaleProvider({ localeMap });

    // No bundle applied — resolveString falls through to key fallback in test env
    expect(resolveString('amity_common_ok')).toBe('amity_common_ok');
  });

  it('no localeMap and no initialLocaleBundle → English library defaults', () => {
    mockNavigatorLanguage('th');

    mountLocaleProvider({});

    // No bundle set → resolveString falls through to Level 4 / key fallback in test env
    expect(resolveString('amity_common_ok')).toBe('amity_common_ok');
  });
});
