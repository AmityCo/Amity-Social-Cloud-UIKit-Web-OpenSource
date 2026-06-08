/**
 * UIKit v4 Localization — public API barrel
 *
 * String resolution (Levels 2–5):
 *   import { resolveString, setStringOverrides, clearStringOverrides,
 *            setLocaleBundle, clearLocaleBundle } from '~/v4/core/localization';
 *
 * React hook:
 *   import { useString } from '~/v4/core/localization';
 *
 * Provider (wrap your app tree):
 *   import { LocaleProvider, useLocale } from '~/v4/core/localization';
 *
 * Types:
 *   import type { LocaleBundle, FormatArg } from '~/v4/core/localization';
 *
 * Default bundles / locale map (device-language detection):
 *   import { defaultLocaleBundle, thLocaleBundle, defaultLocaleMap } from '~/v4/core/localization';
 */

export {
  resolveString,
  setStringOverrides,
  clearStringOverrides,
  setLocaleBundle,
  clearLocaleBundle,
  applyFormat,
  _resetLocalizationState,
  _getLocalizationState,
} from './resolveString';

export type { LocaleBundle, FormatArg } from './resolveString';

export { LocaleProvider, LocaleContext, useLocale } from './LocaleProvider';
export type { LocaleContextValue, LocaleProviderProps } from './LocaleProvider';

export { useString } from './useString';

export { defaultLocaleBundle } from './defaults/en';
export { defaultLocaleMap } from './defaultLocaleMap';
