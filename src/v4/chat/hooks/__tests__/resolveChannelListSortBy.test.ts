import { resolveChannelListSortBy } from '~/v4/chat/utils/resolveChannelListSortBy';

/**
 * Spec: UIKIT/pages/AmityChatHomePage/v3.md REQ-019 – REQ-021.
 * Only the two activity-based orders are accepted by
 * `feature_flags.chat.channel_list_sort_by`; everything else is `lastActivity`.
 */
describe('resolveChannelListSortBy', () => {
  test.each([
    ['"lastActivity"', 'lastActivity', 'lastActivity'],
    ['"lastMessage"', 'lastMessage', 'lastMessage'],
    ['a missing key', undefined, 'lastActivity'],
    ['null', null, 'lastActivity'],
    ['an unknown string', 'newest', 'lastActivity'],
    ['a non-string', 42, 'lastActivity'],
    ['"lastCreated" (valid on the SDK, not on this key)', 'lastCreated', 'lastActivity'],
    ['"firstCreated" (valid on the SDK, not on this key)', 'firstCreated', 'lastActivity'],
    ['"displayName" (valid on the SDK, not on this key)', 'displayName', 'lastActivity'],
  ])('%s resolves to the expected sort', (_label, raw, expected) => {
    expect(resolveChannelListSortBy(raw)).toBe(expected);
  });
});
