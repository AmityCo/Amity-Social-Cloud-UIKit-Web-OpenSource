import { useEffect, useState, useCallback, useMemo } from 'react';
import { UserRepository, CommunityRepository } from '@amityco/ts-sdk';
import { extractMetadata, formatMentionees, isNonNullable } from '~/helpers/utils';
import useCommunity from '~/social/hooks/useCommunity';

interface UseSocialMentionProps {
  targetId?: string;
  targetType?: 'user' | 'community' | string;
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

const useSocialMention = ({
  targetId,
  targetType,
  remoteText,
  remoteMarkup,
}: UseSocialMentionProps) => {
  const isCommunityFeed = targetType === 'community';
  const community = useCommunity(targetId);

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
      let users: Amity.User[];
      let keyword: string | undefined = query || '';
      let unsub: (() => void) | undefined;

      if (keyword.match(/^@$/) || keyword === '') {
        keyword = undefined;
      }

      if (isCommunityFeed && !community?.isPublic && targetId != null) {
        users = await new Promise((resolve) => {
          unsub?.();
          unsub = CommunityRepository.Membership.getMembers(
            {
              communityId: targetId,
              search: keyword,
              limit: 20,
            },
            (response) => {
              if (response.loading) return;
              resolve(response.data.map(({ user }) => user).filter(isNonNullable));
            },
          );
        });
      } else {
        users = await new Promise((resolve) => {
          unsub?.();
          unsub = UserRepository.getUsers(
            { displayName: keyword, limit: 20, sortBy: 'displayName' },
            (response) => {
              if (response.loading) return;
              resolve(response.data);
            },
          );
        });
      }

      return formatMentionees(users);
    },
    [isCommunityFeed, community?.isPublic, targetId],
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

export default useSocialMention;
