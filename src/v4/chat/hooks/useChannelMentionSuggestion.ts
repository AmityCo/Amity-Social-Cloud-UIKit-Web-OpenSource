import { useMemo, useState } from 'react';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import { useSearchChannelUser } from '~/v4/chat/hooks/collections/useSearchChannelUser';
import { resolveString } from '~/v4/core/localization/resolveString';

export const useChannelMentionSuggestion = (channelId?: string | null) => {
  const [queryString, setQueryString] = useState<string | null>(null);

  const { isModerator } = useChannelPermission(channelId || undefined);

  const { channelMembers } = useSearchChannelUser({
    search: queryString,
    channelId: channelId as string,
    memberships: ['member'],
    limit: 20,
  });

  const onQueryChange = (newQuery: string | null) => {
    setQueryString(newQuery);
  };

  const suggestions = useMemo(() => {
    const baseSuggestion = channelMembers.map(({ user, userId }) => ({
      userId: user?.userId || userId,
      displayName: user?.displayName,
    }));

    return isModerator && (queryString === '' || /^al*l*$/i.test(queryString || ''))
      ? [{ userId: 'all', displayName: resolveString('amity_chat_tab_all') }, ...baseSuggestion]
      : baseSuggestion;
  }, [isModerator, channelMembers]);

  return { suggestions, queryString, onQueryChange };
};
