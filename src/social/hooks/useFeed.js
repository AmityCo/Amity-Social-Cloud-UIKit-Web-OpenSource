import { PostRepository, PostTargetType } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const { queryAllPosts, queryCommunityPosts, queryUserPosts, queryMyPosts } = PostRepository;

const useFeed = ({ targetType, targetId, feedType, limit }) => {
  const FeedQueryTypes = {
    [PostTargetType.GlobalFeed]: queryAllPosts.bind(this, { limit, useCustomRanking: true }),
    [PostTargetType.CommunityFeed]: queryCommunityPosts.bind(this, {
      communityId: targetId,
      feedType,
      limit,
    }),
    [PostTargetType.UserFeed]: queryUserPosts.bind(this, { userId: targetId, limit }),
    [PostTargetType.MyFeed]: queryMyPosts.bind(this, { limit }),
  };

  // Override default resolver because for MyFeed and GlobalFeed there does not need to be a targetId.
  // This means default resolver will return true and new liveCollection will not be created.
  const liveCollectionResolver = () => {
    if (!targetType) return true;
    return false;
  };

  return useLiveCollection(
    FeedQueryTypes[targetType],
    [targetType, targetId, feedType, limit],
    liveCollectionResolver,
    true,
  );
};

export default useFeed;
