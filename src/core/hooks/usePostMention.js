import { useCallback } from 'react';
import { UserRepository, CommunityRepository, PostTargetType } from '@amityco/js-sdk';
// import useLiveCollection from '~/core/hooks/useLiveCollection';
import { formatMentionees } from '../../helpers/utils';

const usePostMention = ({ targetId, targetType }) => {
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

      // if (targetType === PostTargetType.CommunityFeed && !community?.isPublic) {
      if (targetType === PostTargetType.CommunityFeed) {
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
    [targetId, targetType],
  );

  return [queryMentionees];
};

export default usePostMention;
