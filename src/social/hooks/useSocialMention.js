import { useEffect, useState, useCallback } from 'react';
import { UserRepository, CommunityRepository, PostTargetType } from '@amityco/js-sdk';
import { formatMentionees } from '~/helpers/utils';
import useCommunity from '~/social/hooks/useCommunity';

const useSocialMention = ({ targetId, targetType, remoteText, remoteMarkup }) => {
  const isCommunityFeed = targetType === PostTargetType.CommunityFeed;
  const { community } = useCommunity(targetId);
  const { isPublic } = community;

  const [text, setText] = useState(remoteText ?? '');
  const [markup, setMarkup] = useState(remoteMarkup ?? remoteText);
  const [mentions, setMentions] = useState([]);

  useEffect(() => {
    setText(remoteText);
    setMarkup(remoteMarkup ?? '');
  }, [remoteText, remoteMarkup]);

  const onChange = ({ text: markupText, plainText, mentions: localMentions }) => {
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
    setText(remoteText);
    setMarkup(remoteMarkup);
    setMentions([]);
  };

  const queryMentionees = useCallback(
    (query, cb) => {
      let keyword = query;

      if (keyword.match(/^@$/) || keyword === '') {
        keyword = undefined;
      }

      const fetcher =
        isPublic || !isCommunityFeed
          ? UserRepository.queryUsers({ keyword })
          : CommunityRepository.getCommunityMembers({ communityId: targetId, search: keyword });

      fetcher.on('dataUpdated', (models) => cb(formatMentionees(models)));
    },
    [isPublic, isCommunityFeed, targetId],
  );

  return { text, markup, mentions, onChange, clearAll, resetState, queryMentionees };
};

export default useSocialMention;
