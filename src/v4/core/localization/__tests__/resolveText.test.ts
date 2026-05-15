/**
 * UIKit v4 Localization — §7.4 Config text (Level 1) tests
 *
 * Tests the `resolveText()` function returned by `useAmityElement`.
 * Verifies that config.text wins when non-empty and falls through to
 * resolveString() (Levels 2-5) when empty or absent.
 *
 * All scenarios from spec §7.4:
 *   - Config text present → returns config text
 *   - Config text removed (set to empty string) → falls through to locale
 *   - Config text is empty string → falls through (empty string treated as absent)
 *   - Config text absent (null/undefined) → falls through to library default
 */

// Minimal renderHook implementation — calls hook directly since all deps are mocked
function renderHook<T>(hookFn: () => T): { result: { current: T } } {
  return { result: { current: hookFn() } };
}
import {
  setStringOverrides,
  setLocaleBundle,
  clearStringOverrides,
  clearLocaleBundle,
  _resetLocalizationState,
} from '~/v4/core/localization/resolveString';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Build a minimal mock of the CustomizationProvider context so we can control
 * config.text without loading the full provider tree.
 */

const mockGetConfig = jest.fn();
const mockIsExcluded = jest.fn().mockReturnValue(false);

jest.mock('~/v4/core/providers/CustomizationProvider', () => ({
  getDefaultConfig: jest.fn().mockReturnValue({ icon: '', text: '', background_color: '' }),
  useCustomization: () => ({
    getConfig: mockGetConfig,
    isExcluded: mockIsExcluded,
  }),
}));

jest.mock('~/v4/core/providers/ThemeProvider', () => ({
  useGenerateStylesShadeColors: jest.fn().mockReturnValue({}),
  useTheme: jest.fn().mockReturnValue({ currentTheme: 'light' }),
}));

// Import AFTER mocking to get the mocked version
import { useAmityElement } from '~/v4/core/hooks/uikit';

const TEST_KEY = 'amity_common_cancel';
const ELEM_ARGS = { pageId: 'test_page', componentId: 'test_comp', elementId: 'test_elem' };

beforeEach(() => {
  _resetLocalizationState();
  mockGetConfig.mockReset();
  mockIsExcluded.mockReturnValue(false);
});

// ---------------------------------------------------------------------------
// §7.4 — Config removal fallback
// ---------------------------------------------------------------------------

describe('§7.4 Config text (Level 1) — resolveText()', () => {
  it('Config text present → returns config text (wins over everything)', () => {
    mockGetConfig.mockReturnValue({ text: 'Remote Override', icon: '' });
    setStringOverrides({ [TEST_KEY]: 'Override Value' });
    setLocaleBundle({ [TEST_KEY]: 'Locale Value' });

    const { result } = renderHook(() => useAmityElement(ELEM_ARGS));
    expect(result.current.resolveText(TEST_KEY)).toBe('Remote Override');
  });

  it('Config text removed (set to empty string) → falls through to Level 2 override', () => {
    mockGetConfig.mockReturnValue({ text: '', icon: '' });
    setStringOverrides({ [TEST_KEY]: 'Override Value' });

    const { result } = renderHook(() => useAmityElement(ELEM_ARGS));
    // Empty string config.text is treated as absent per spec §7.4
    expect(result.current.resolveText(TEST_KEY)).toBe('Override Value');
  });

  it('Config text absent (null) → falls through to locale bundle (Level 3)', () => {
    mockGetConfig.mockReturnValue({ text: null, icon: '' });
    setLocaleBundle({ [TEST_KEY]: 'Locale Bundle Value' });

    const { result } = renderHook(() => useAmityElement(ELEM_ARGS));
    expect(result.current.resolveText(TEST_KEY)).toBe('Locale Bundle Value');
  });

  it('Config text absent, no locale → uses library default (Level 4)', () => {
    mockGetConfig.mockReturnValue({ text: undefined, icon: '' });

    const { result } = renderHook(() => useAmityElement(ELEM_ARGS));
    // amity_common_cancel has library default 'Cancel' in en.ts
    expect(result.current.resolveText(TEST_KEY)).toBe('Cancel');
  });

  it('Config text absent, no locale, no default → returns raw key (Level 5)', () => {
    mockGetConfig.mockReturnValue({ text: undefined, icon: '' });
    const unknownKey = 'amity_nonexistent_key_test_xyz';

    const { result } = renderHook(() => useAmityElement(ELEM_ARGS));
    expect(result.current.resolveText(unknownKey)).toBe(unknownKey);
  });

  it('Config text whitespace-only → does NOT fall through (truthy non-empty)', () => {
    // Spec: only empty string '' is treated as absent. Non-empty (even whitespace) is used as-is.
    // This is intentional — allows admin to effectively blank an element with spaces if desired.
    mockGetConfig.mockReturnValue({ text: '   ', icon: '' });
    setLocaleBundle({ [TEST_KEY]: 'Should Not Appear' });

    const { result } = renderHook(() => useAmityElement(ELEM_ARGS));
    expect(result.current.resolveText(TEST_KEY)).toBe('   ');
  });

  it('resolveText passes format args through to resolveString', () => {
    mockGetConfig.mockReturnValue({ text: null, icon: '' });
    setStringOverrides({ amity_test_fmt: 'Hello, %s!' });

    const { result } = renderHook(() => useAmityElement(ELEM_ARGS));
    expect(result.current.resolveText('amity_test_fmt', 'World')).toBe('Hello, World!');
  });

  it("Level 2 wins when config text absent and locale doesn't have the key", () => {
    mockGetConfig.mockReturnValue({ text: '', icon: '' });
    clearLocaleBundle();
    setStringOverrides({ [TEST_KEY]: 'Programmatic' });

    const { result } = renderHook(() => useAmityElement(ELEM_ARGS));
    expect(result.current.resolveText(TEST_KEY)).toBe('Programmatic');
  });

  it('clearStringOverrides falls through to locale after config is absent', () => {
    mockGetConfig.mockReturnValue({ text: '', icon: '' });
    setStringOverrides({ [TEST_KEY]: 'Override' });
    setLocaleBundle({ [TEST_KEY]: 'Locale' });
    clearStringOverrides();

    const { result } = renderHook(() => useAmityElement(ELEM_ARGS));
    expect(result.current.resolveText(TEST_KEY)).toBe('Locale');
  });
});
