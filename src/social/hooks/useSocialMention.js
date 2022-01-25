import { useEffect, useState, useCallback } from 'react';
import { UserRepository, CommunityRepository, PostTargetType } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';
import { formatMentionees } from '~/helpers/utils';
import useCommunity from '~/social/hooks/useCommunity';

const useSocialMention = ({ targetId, targetType, remoteText, remoteMarkup }) => {
  const isCommunityFeed = targetType === PostTargetType.CommunityFeed;
  const { community } = useCommunity(targetId);
  const { isPublic } = community;

  const [text, setText] = useState(remoteText ?? '');
  const [markup, setMarkup] = useState(remoteMarkup ?? remoteText);
  const [mentions, setMentions] = useState([]);

  const [search, setSearch] = useState();

  const [members] = useLiveCollection(
    () => CommunityRepository.getCommunityMembers({ communityId: targetId, search }),
    [targetId, search],
    () => isPublic === false || !targetId,
  );

  const [users] = useLiveCollection(
    () => UserRepository.queryUsers({ keyword: search }),
    [targetId, search],
    () => isPublic || !targetId,
  );

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

  const dataCallback = useCallback(
    (cb) => {
      return isCommunityFeed ? cb(formatMentionees(members)) : cb(formatMentionees(users));
    },
    [isCommunityFeed, members, users],
  );

  const queryMentionees = useCallback(
    (query, cb) => {
      let keyword = query;

      if (keyword.match(/^@$/) || keyword === '') {
        keyword = undefined;
      }

      setSearch(keyword);
      dataCallback(cb);
    },
    [dataCallback],
  );

  return { text, markup, mentions, onChange, clearAll, resetState, queryMentionees };
};

export default useSocialMention;
