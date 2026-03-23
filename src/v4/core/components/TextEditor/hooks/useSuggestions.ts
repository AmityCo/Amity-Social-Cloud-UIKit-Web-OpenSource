import { useState, useMemo, useRef } from 'react';
import type { EditorContentType } from '~/v4/core/components/TextEditor/TextEditor';
import { useMemberQueryByDisplayName } from '~/v4/social/hooks/useMemberQueryByDisplayName';
import { useUserQueryByDisplayName } from '~/v4/core/hooks/collections/useUsersCollection';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';
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

  const isSearchCommunityMembers = useMemo(() => {
    if (editorContentType === 'message') {
      return true; // Always search channel members for messages
    }
    return !!communityId && !isCommunityLoading && !community?.isPublic;
  }, [editorContentType, communityId, isCommunityLoading, community]);

  const {
    members,
    hasMore: hasMoreMember,
    isLoading: isLoadingMember,
    loadMore: loadMoreMember,
  } = useMemberQueryByDisplayName({
    communityId: editorContentType === 'message' ? channelId || '' : communityId || '',
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
    enabled: !isSearchCommunityMembers,
  });

  const onQueryChange = (newQuery: string | null) => {
    setQueryString(newQuery);
  };

  const suggestions = useMemo(() => {
    if (!!communityId && isCommunityLoading) return [];

    if (isSearchCommunityMembers) {
      return members.map(({ user, userId }) => ({
        userId: user?.userId || userId,
        displayName: user?.displayName,
      }));
    }

    return users.map(({ displayName, userId }) => ({
      userId: userId,
      displayName: displayName,
    }));
  }, [users, members, isSearchCommunityMembers, isCommunityLoading, communityId]);

  const hasMore = useMemo(() => {
    if (isSearchCommunityMembers) {
      return hasMoreMember;
    } else {
      return hasMoreUser;
    }
  }, [isSearchCommunityMembers, hasMoreMember, hasMoreUser]);

  const loadMore = () => {
    if (isLoading || !hasMore) return;
    if (isSearchCommunityMembers) {
      loadMoreMember();
    } else {
      loadMoreUser();
    }
  };

  const isLoading = useMemo(() => {
    if (isSearchCommunityMembers) {
      return isLoadingMember;
    } else {
      return isLoadingUser;
    }
  }, [isLoadingMember, isLoadingUser, isSearchCommunityMembers]);

  return { suggestions, queryString, onQueryChange, loadMore, hasMore, isLoading };
};
