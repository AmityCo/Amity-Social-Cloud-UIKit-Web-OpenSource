/**
 * UIKit v4 — Default locale map for automatic device-language detection.
 *
 * Pass this to AmityUIKitProvider to enable automatic language switching
 * based on the user's browser/device language setting:
 *
 *   import { defaultLocaleMap } from '~/v4/core/localization';
 *   <AmityUIKitProvider localization={{ localeMap: defaultLocaleMap }} ... />
 *
 * Resolution order:
 *   1. Exact match: navigator.language === "th" → Thai bundle
 *   2. Prefix match: navigator.language === "th-TH" → Thai bundle
 *   3. No match: falls through to English library defaults
 *
 * Add more bundles here as additional locale files are created.
 */

import { thLocaleBundle } from './defaults/th';
import type { LocaleBundle } from './resolveString';

export const defaultLocaleMap: Record<string, LocaleBundle> = {
  th: thLocaleBundle,
};
