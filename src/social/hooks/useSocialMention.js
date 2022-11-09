import { useEffect, useState, useCallback, useRef } from 'react';
import { useUnmount } from 'react-use';
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

  /*

    due to how the mention library works, the data parameter is expecting a type
    such as:

    (query: string, callback({ id: string, display: string }[]) => void) => void

    (see: https://github.com/signavio/react-mentions/blob/master/demo/src/examples/AsyncGithubUserMentions.js#L37)

    so we can't pass the result of a useLiveCollection directly.
    we tried to pass a function such as:

    (keyword, () => fromUseLiveCollection.models) => void

    but it wouldn't work properly, showing the previous results.

    There's no other choice but to create the liveCollection at the time of query,
    but then we need to use a useCallback to prevent creating millions of them as
    we type. The problem shifts then to how to dispose the previously created LC,
    for such we need to keep a reference to the latest active LC which is why we
    need to have a ref.
  */
  const fetcher = useRef();

  // here we force dispose in case there was a un-disposed live collection
  useUnmount(() => fetcher.current?.dispose());

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
        return;
      }

      // dispose previous LC instance...
      fetcher.current?.dispose();

      // ...and create a new one on the fly
      fetcher.current =
        isPublic || !isCommunityFeed
          ? UserRepository.queryUsers({ keyword })
          : CommunityRepository.getCommunityMembers({ communityId: targetId, search: keyword });

      fetcher.current.on('dataUpdated', (models) => {
        cb(formatMentionees(models));
      });
    },
    [isCommunityFeed, isPublic, targetId],
  );

  return { text, markup, mentions, onChange, clearAll, resetState, queryMentionees };
};

export default useSocialMention;
