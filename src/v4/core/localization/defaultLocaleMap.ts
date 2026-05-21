/**
 * UIKit v4 — Default locale map for automatic device-language detection.
 *
 * Pass this to AmityUIKitProvider to enable automatic language switching
 * based on the user's browser/device language setting:
 *
 *   import { defaultLocaleMap } from '~/v4/core/localization';
 *   <AmityUIKitProvider localization={{ localeMap: defaultLocaleMap }} ... />
 *
 * Add locale bundles here to enable automatic device-language detection.
 */

import type { LocaleBundle } from './resolveString';

export const defaultLocaleMap: Record<string, LocaleBundle> = {};
