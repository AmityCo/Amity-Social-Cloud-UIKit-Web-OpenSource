/**
 * UIKit v4 — Default Locale Bundle (Level 4 Library Defaults)
 *
 * The canonical source of all English strings is `en.json` in this directory.
 * This file re-exports them as a typed TypeScript object.
 *
 * To add or update strings: edit `en.json`.
 * To provide translations: pass a locale bundle to AmityUIKitProvider.
 *
 * Key format: amity_{module}_{descriptive_name}
 * Modules: social, common, chat
 */

import bundle from './en.json';

export const defaultLocaleBundle: Record<string, string> = bundle;
