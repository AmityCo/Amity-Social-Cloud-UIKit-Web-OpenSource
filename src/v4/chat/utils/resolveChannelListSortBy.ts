/** The subset of `Amity.ChannelSortBy` that `feature_flags.chat.channel_list_sort_by` accepts. */
export type ChannelListSortBy = Extract<Amity.ChannelSortBy, 'lastActivity' | 'lastMessage'>;

export const DEFAULT_CHANNEL_LIST_SORT_BY: ChannelListSortBy = 'lastActivity';

/**
 * Resolves `feature_flags.chat.channel_list_sort_by` to the sort the chat home
 * page queries with (AmityChatHomePage v3, REQ-019 – REQ-021).
 *
 * Only the two activity-based orders are accepted: a missing key, an unknown
 * string, or any other `AmityChannelSortBy` value (`lastCreated`, `firstCreated`,
 * `displayName`) falls back to `lastActivity`, so an integrator who does not set
 * the key sees no change.
 */
export function resolveChannelListSortBy(raw: unknown): ChannelListSortBy {
  return raw === 'lastMessage' ? 'lastMessage' : DEFAULT_CHANNEL_LIST_SORT_BY;
}
