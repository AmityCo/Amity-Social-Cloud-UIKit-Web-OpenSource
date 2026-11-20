/**
 * Tray item types this UIKit version can open.
 *
 * The server adds new tray item types before the UIKit learns about them, and
 * the item still arrives and renders from the server's own text. Without this
 * list, a type the tray does not know fell through to the post detail page
 * with a guessed, often empty, postId (as `reaction_on_poll` did before
 * PDT-7196). Add a value here only together with the branch in
 * `NotificationItem` that opens it.
 *
 * String literals rather than `Amity.TrayAction` members: the SDK declares
 * them as ambient const enums, which do not exist at runtime under Vite. The
 * template-literal types still catch a value the SDK does not list.
 */
const KNOWN_ACTION_TYPES: ReadonlyArray<`${Amity.TrayAction}`> = [
  'post',
  'poll',
  'comment',
  'reaction',
  'mention',
  'reply',
  'join_request',
  'user',
  'follow',
  'event',
  'invitation',
];

const KNOWN_CATEGORIES: ReadonlyArray<`${Amity.TrayItemCategoryType}`> = [
  'mention_in_post',
  'mention_in_comment',
  'mention_in_reply',
  'mention_in_poll',
  'reaction_on_post',
  'reaction_on_comment',
  'reaction_on_reply',
  'reaction_on_poll',
  'respond_on_join_request',
  'follow',
  'event_reminder',
  'event_started',
  'event_created',
  'room_cohost_invite',
  'user_profile_reset',
];

const knownActionTypes: ReadonlySet<string> = new Set<string>(KNOWN_ACTION_TYPES);
const knownCategories: ReadonlySet<string> = new Set<string>(KNOWN_CATEGORIES);

/**
 * Whether this UIKit version knows where a tray item leads.
 *
 * `trayItemCategory` is optional on the wire, so an item without one is
 * judged by its action type alone.
 */
export const isKnownTrayItem = (
  item: Pick<Amity.NotificationTrayItem, 'actionType' | 'trayItemCategory'>,
): boolean =>
  knownActionTypes.has(item.actionType) &&
  (item.trayItemCategory == null || knownCategories.has(item.trayItemCategory));
