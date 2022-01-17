import { useEffect, useState, useCallback } from 'react';
import { UserRepository, CommunityRepository, PostTargetType } from '@amityco/js-sdk';
import { formatMentionees } from '../../helpers/utils';
import useCommunity from '~/social/hooks/useCommunity';

const useSocialMention = ({ targetId, targetType, remoteText, remoteMarkup }) => {
  const { community } = useCommunity(targetId);
  const [text, setText] = useState(remoteText ?? '');
  const [markup, setMarkup] = useState(remoteMarkup ?? remoteText);
  const [mentions, setMentions] = useState([]);

  useEffect(() => {
    setText(remoteText);
    setMarkup(remoteMarkup ?? '');
  }, [remoteText, remoteMarkup]);

  const { isPublic } = community;

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

  const mentioneeCommunityFetcher = (communityId, query) =>
    CommunityRepository.getCommunityMembers({
      communityId,
      search: query,
    });

  const queryMentionees = useCallback(
    (query, cb) => {
      let keyword = query;
      let liveCollection;

      if (keyword.match(/^@$/) || keyword === '') {
        keyword = undefined;
      }

      // Private communities should only look up to their own members
      // !isPublic would be truthy when it's undefined
      if (targetType === PostTargetType.CommunityFeed && isPublic === false) {
        liveCollection = mentioneeCommunityFetcher(targetId, keyword);
      } else {
        liveCollection = UserRepository.queryUsers({ keyword });
      }

      // utilize useLiveCollection method here
      liveCollection.on('dataUpdated', models => {
        cb([...formatMentionees(models)]);
        // setMentionees(formatMentionees(models));
      });
    },
    [targetId, targetType, community],
  );

  return { text, markup, mentions, onChange, clearAll, queryMentionees };
};

export default useSocialMention;
