/**
 * Unit tests for `injectColorTokenLayers` — the 3-layer color-token injector.
 *
 * Verifies:
 *  - Atomic layer: every theme key → `--asc-atomic-<kebab>` with its raw value.
 *  - Semantic layer: `{Alias}` → `var(--asc-atomic-<themeKey>)` via the alias map,
 *    `{theme.X}` → the atomic var directly, and raw `#hex` passed through literally.
 *  - Light/dark value-swap on the same `--asc-color-*` names (+ fallback when one mode is absent).
 *  - No-op guard when theme/tokens are missing.
 */
import {
  injectColorTokenLayers,
  DesignTokens,
  ThemeValue,
} from '~/v4/core/providers/CustomizationProvider/utils';

// Jest runs in the node environment (no jsdom), so stub a minimal `document` whose
// documentElement.style is backed by a Map we can assert against.
let store: Map<string, string>;

beforeEach(() => {
  store = new Map();
  (global as unknown as { document: unknown }).document = {
    documentElement: {
      style: {
        setProperty: (key: string, value: string) => store.set(key, value),
        getPropertyValue: (key: string) => store.get(key) ?? '',
      },
    },
  };
});

const theme: Partial<ThemeValue> = {
  primary_color: '#1054DE',
  white_color: '#FFFFFF',
  background_color: '#191919',
  transparent_black_600_color: '#00000099',
};

const tokens: DesignTokens = {
  alias: {
    'Secondary/White': '{theme.white_color}',
    'Primary/500': '{theme.primary_color}',
    'Background/Standard/Black/Default': '{theme.background_color}',
  },
  semantic: {
    'Border/ChatBubble/Inbound/Default': {
      light: '{Secondary/White}',
      dark: '{Background/Standard/Black/Default}',
    },
    'Surface/Tab/Pill/Active': { light: '{Primary/500}', dark: '{Primary/500}' },
    'Text/Direct/Theme': { light: '{theme.primary_color}', dark: '{theme.primary_color}' },
    'Surface/Literal/Hex': { light: '#FF0000', dark: '#00FF00' },
    'Surface/Dark/Only': { dark: '{Primary/500}' }, // no light → falls back to dark
    'Surface/Light/Only': { light: '{Primary/500}' }, // no dark → falls back to light
  },
};

describe('injectColorTokenLayers', () => {
  it('emits every theme key as --asc-atomic-* (snake_case → kebab)', () => {
    injectColorTokenLayers(theme, tokens, 'light');

    expect(store.get('--asc-atomic-primary-color')).toBe('#1054DE');
    expect(store.get('--asc-atomic-white-color')).toBe('#FFFFFF');
    expect(store.get('--asc-atomic-transparent-black-600-color')).toBe('#00000099');
  });

  it('resolves a semantic {Alias} ref through the alias map to the atomic var', () => {
    injectColorTokenLayers(theme, tokens, 'light');

    expect(store.get('--asc-color-border-chatbubble-inbound-default')).toBe(
      'var(--asc-atomic-white-color)',
    );
    expect(store.get('--asc-color-surface-tab-pill-active')).toBe(
      'var(--asc-atomic-primary-color)',
    );
  });

  it('resolves a direct {theme.X} ref to the atomic var', () => {
    injectColorTokenLayers(theme, tokens, 'light');

    expect(store.get('--asc-color-text-direct-theme')).toBe('var(--asc-atomic-primary-color)');
  });

  it('passes a raw #hex ref through as a literal', () => {
    injectColorTokenLayers(theme, tokens, 'light');

    expect(store.get('--asc-color-surface-literal-hex')).toBe('#FF0000');
  });

  it('value-swaps light/dark on the same var name', () => {
    injectColorTokenLayers(theme, tokens, 'dark');

    // dark ref points to a different alias → different atomic var
    expect(store.get('--asc-color-border-chatbubble-inbound-default')).toBe(
      'var(--asc-atomic-background-color)',
    );
    expect(store.get('--asc-color-surface-literal-hex')).toBe('#00FF00');
  });

  it('falls back to the other mode when one side is absent', () => {
    injectColorTokenLayers(theme, tokens, 'light');
    // Surface/Dark/Only has no light → uses its dark ref
    expect(store.get('--asc-color-surface-dark-only')).toBe('var(--asc-atomic-primary-color)');

    injectColorTokenLayers(theme, tokens, 'dark');
    // Surface/Light/Only has no dark → uses its light ref
    expect(store.get('--asc-color-surface-light-only')).toBe('var(--asc-atomic-primary-color)');
  });

  it('is a no-op when theme or tokens are undefined', () => {
    injectColorTokenLayers(undefined, tokens, 'light');
    injectColorTokenLayers(theme, undefined, 'light');

    expect(store.size).toBe(0);
  });
});
