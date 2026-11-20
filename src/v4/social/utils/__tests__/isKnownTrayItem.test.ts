import { isKnownTrayItem } from '~/v4/social/utils/isKnownTrayItem';

/**
 * The tray only opens items it knows where to send. Anything newer than this
 * UIKit version gets the "unavailable" toast instead of a guessed page.
 */
const item = (actionType: string, trayItemCategory?: string | null) =>
  ({ actionType, trayItemCategory }) as unknown as Amity.NotificationTrayItem;

describe('isKnownTrayItem', () => {
  it.each([
    ['reaction', 'reaction_on_post'],
    ['reaction', 'reaction_on_poll'],
    ['comment', 'mention_in_comment'],
    ['follow', 'follow'],
    ['event', 'event_created'],
    ['invitation', 'room_cohost_invite'],
    ['user', 'user_profile_reset'],
    ['join_request', 'respond_on_join_request'],
  ])('knows %s / %s', (actionType, category) => {
    expect(isKnownTrayItem(item(actionType, category))).toBe(true);
  });

  it('judges an item without a category by its action type', () => {
    expect(isKnownTrayItem(item('comment'))).toBe(true);
    expect(isKnownTrayItem(item('comment', null))).toBe(true);
    expect(isKnownTrayItem(item('story'))).toBe(false);
  });

  it('does not know an action type the backend added later', () => {
    expect(isKnownTrayItem(item('story', 'reaction_on_post'))).toBe(false);
  });

  it('does not know a category the backend added later', () => {
    expect(isKnownTrayItem(item('reaction', 'reaction_on_story'))).toBe(false);
  });
});
