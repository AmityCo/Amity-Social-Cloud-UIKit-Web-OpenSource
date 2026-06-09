import { useState, useMemo, useRef } from 'react';
import type { EditorContentType } from '~/v4/core/components/TextEditor/TextEditor';
import { useMemberQueryByDisplayName } from '~/v4/social/hooks/useMemberQueryByDisplayName';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
import { useChannelMembersCollection } from '~/v4/chat/hooks/collections/useChannelMembersCollection';
import { useMentionAllConfig } from '~/v4/chat/hooks/useMentionAllConfig';
import { TEXT } from '~/v4/chat/constants';
import { SEARCH_USER_MINIMUM_CHARACTER } from '~/social/constants';

export interface SuggestionData {
  userId: string;
  displayName?: string;
}

export const useSuggestions = (
  editorContentType: EditorContentType,
  communityId?: string | null,
  channelId?: string,
) => {
  const [queryString, setQueryString] = useState<string | null>(null);
  const lastValidUserQueryRef = useRef<string>('');

  // Only update user query when empty or >= 3 characters, retain last result for 1-2 chars
  const effectiveUserQuery = useMemo(() => {
    const query = queryString || '';
    if (query.length === 0 || query.length >= SEARCH_USER_MINIMUM_CHARACTER) {
      lastValidUserQueryRef.current = query;
      return query;
    }
    return lastValidUserQueryRef.current;
  }, [queryString]);

  const { community, isLoading: isCommunityLoading } = useCommunity({ communityId });

  const isChatMode = editorContentType === 'message';
  const isSearchChannelMembers = isChatMode && !!channelId;
  const isSearchCommunityMembers =
    !isChatMode && !!communityId && !isCommunityLoading && !community?.isPublic;

  const {
    members: channelMembers,
    hasMore: hasMoreChannelMember,
    isLoading: isLoadingChannelMember,
    loadMore: loadMoreChannelMember,
  } = useChannelMembersCollection({
    channelId: isSearchChannelMembers ? channelId! : '',
    memberships: ['member', 'muted'],
    search: queryString ?? undefined,
    limit: 10,
  });

  const {
    members,
    hasMore: hasMoreMember,
    isLoading: isLoadingMember,
    loadMore: loadMoreMember,
  } = useMemberQueryByDisplayName({
    communityId: communityId || '',
    displayName: queryString || '',
    limit: 10,
    enabled: isSearchCommunityMembers,
  });

  const {
    users,
    hasMore: hasMoreUser,
    loadMore: loadMoreUser,
    isLoading: isLoadingUser,
  } = useUserQueryByDisplayName({
    displayName: effectiveUserQuery,
    limit: 10,
    enabled: !isChatMode && !isSearchCommunityMembers,
  });

  const onQueryChange = (newQuery: string | null) => {
    setQueryString(newQuery);
  };

  const isMentionAllEnabled = useMentionAllConfig();

  const baseSuggestions: { userId: string; displayName?: string }[] = isSearchChannelMembers
    ? channelMembers
        .filter((member) => !member.user?.isGlobalBanned)
        .map((member) => ({
          userId: member.user?.userId ?? member.userId,
          displayName: member.user?.displayName,
        }))
        .filter((s) => !!s.userId)
    : !!communityId && isCommunityLoading
      ? []
      : isSearchCommunityMembers
        ? members.map(({ user, userId }) => ({
            userId: user?.userId || userId,
            displayName: user?.displayName,
          }))
        : users.map(({ displayName, userId }) => ({
            userId: userId,
            displayName: displayName,
          }));

  const isEmptyQuery = (queryString ?? '').trim().length === 0;
  const shouldShowAll = isChatMode && isEmptyQuery && isMentionAllEnabled;

  const suggestions = shouldShowAll
    ? [{ userId: 'all', displayName: TEXT.MENTION.PICKER.ALL_LABEL }, ...baseSuggestions]
    : baseSuggestions;

  const hasMore = isSearchChannelMembers
    ? hasMoreChannelMember
    : isSearchCommunityMembers
      ? hasMoreMember
      : hasMoreUser;

  const isLoading = isSearchChannelMembers
    ? isLoadingChannelMember
    : isSearchCommunityMembers
      ? isLoadingMember
      : isLoadingUser;

  const loadMore = () => {
    if (isLoading || !hasMore) return;
    if (isSearchChannelMembers) {
      loadMoreChannelMember();
    } else if (isSearchCommunityMembers) {
      loadMoreMember();
    } else {
      loadMoreUser();
    }
  };

  return { suggestions, queryString, onQueryChange, loadMore, hasMore, isLoading };
};
