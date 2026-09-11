import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ChannelRepository,
  CommunityRepository,
  SearchUsersByEnum,
  UserRepository,
} from '@amityco/ts-sdk';
import { extractMetadata, formatMentionees, isNonNullable } from '~/v4/helpers/utils';
import { useCommunity } from './useCommunity';

interface UseMentionProps {
  targetId?: string;
  targetType?: 'user' | 'community' | 'channel' | string;
  remoteText?: string;
  remoteMarkup?: string;
}

export type QueryMentioneesFnType = (query?: string) => Promise<
  {
    id: string;
    display: string;
    avatar?: string;
    isLastItem: boolean;
  }[]
>;

const useMention = ({ targetId, targetType, remoteText, remoteMarkup }: UseMentionProps) => {
  const isCommunityFeed = targetType === 'community';
  const isChannel = targetType === 'channel';
  const { community } = useCommunity({ communityId: targetId });

  const [text, setText] = useState(remoteText ?? '');
  const [markup, setMarkup] = useState(remoteMarkup ?? remoteText);
  const [mentions, setMentions] = useState<
    { plainTextIndex: number; id: string; display: string }[]
  >([]);

  useEffect(() => {
    setText(remoteText || '');
    setMarkup(remoteMarkup ?? '');
  }, [remoteText, remoteMarkup]);

  const onChange = ({
    text: markupText,
    plainText,
    mentions: localMentions,
  }: {
    text: string;
    plainText: string;
    mentions: { plainTextIndex: number; id: string; display: string }[];
  }) => {
    setText(plainText);
    setMarkup(markupText);
    setMentions(localMentions);
  };

  const clearAll = () => {
    setText('');
    setMarkup('');
    setMentions([]);
  };

  const resetState = () => {
    setText(remoteText || '');
    setMarkup(remoteMarkup);
    setMentions([]);
  };

  const queryMentionees = useCallback<QueryMentioneesFnType>(
    async (query?: string) => {
      type SearchMembersResponse = Parameters<
        Parameters<typeof CommunityRepository.Membership.searchMembers>[1]
      >[0];
      type GetMembersResponse = Parameters<
        Parameters<typeof ChannelRepository.Membership.getMembers>[1]
      >[0];
      type SearchUsersResponse = Parameters<Parameters<typeof UserRepository.searchUsers>[1]>[0];
      type SearchedUser = SearchUsersResponse['data'][number];

      let users: SearchedUser[];
      let keyword: string | undefined = query || '';
      let unsub: (() => void) | undefined;

      if (keyword.match(/^@$/) || keyword === '') {
        keyword = undefined;
      }

      if (isCommunityFeed && !community?.isPublic && targetId != null) {
        users = await new Promise<SearchedUser[]>((resolve) => {
          unsub?.();
          unsub = CommunityRepository.Membership.searchMembers(
            {
              communityId: targetId,
              search: keyword,
              limit: 20,
            },
            (response: SearchMembersResponse) => {
              if (response.loading) return;
              const members = response.data as { user?: SearchedUser }[];
              resolve(members.map((member) => member.user).filter(isNonNullable) as SearchedUser[]);
            },
          );
        });
      } else if (isChannel) {
        users = await new Promise<SearchedUser[]>((resolve) => {
          unsub?.();
          unsub = ChannelRepository.Membership.getMembers(
            {
              channelId: targetId!,
              search: keyword,
              limit: 20,
            },
            (response: GetMembersResponse) => {
              if (response.loading) return;
              const members = response.data as { user?: SearchedUser }[];
              resolve(members.map((member) => member.user).filter(isNonNullable) as SearchedUser[]);
            },
          );
        });
      } else {
        users = await new Promise<SearchedUser[]>((resolve) => {
          unsub?.();
          unsub = UserRepository.searchUsers(
            {
              displayName: keyword,
              limit: 20,
              searchBy: [SearchUsersByEnum.DISPLAY_NAME],
            },
            (response: SearchUsersResponse) => {
              if (response.loading) return;
              resolve(response.data);
            },
          );
        });
      }

      return formatMentionees(users);
    },
    [isCommunityFeed, isChannel, community?.isPublic, targetId],
  );

  const { mentionees, metadata } = useMemo(() => {
    const { mentionees, metadata } = extractMetadata(mentions);
    return { mentionees, metadata };
  }, [mentions]);

  return {
    text,
    markup,
    mentions,
    mentionees,
    metadata,
    onChange,
    clearAll,
    resetState,
    queryMentionees,
  };
};

export default useMention;
