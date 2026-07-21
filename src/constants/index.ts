export const LIKE_REACTION_KEY = 'like';
export const LOVE_REACTION_KEY = 'love';
export const FIRE_REACTION_KEY = 'fire';

export const EVENT_TRAY_CATEGORIES = ['event_reminder', 'event_started', 'event_created'];

// meetperry reaction set. Re-exported here so the kit's public `./constants`
// subpath exposes them. Keep this module pure data (no component imports) — it
// is a standalone build entry that server consumers import without evaluating
// the client-only barrel.
export {
  MEETPERRY_DEFAULT_REACTION,
  MEETPERRY_LEGACY_REACTIONS,
  MEETPERRY_REACTIONS,
  withLegacyReactions,
} from '../v4/core/constants/meetperryReactions';
