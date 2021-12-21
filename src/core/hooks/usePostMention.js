import { useCallback } from 'react';
import { UserRepository, CommunityRepository, PostTargetType } from '@amityco/js-sdk';
import { formatMentionees } from '../../helpers/utils';
import useCommunity from '~/social/hooks/useCommunity';

const usePostMention = ({ targetId, targetType }) => {
  const { community } = useCommunity(targetId);
  const { isPublic } = community;

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

  return [queryMentionees];
};

export default usePostMention;
