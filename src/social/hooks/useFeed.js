import { PostRepository, PostTargetType } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const { queryAllPosts, queryCommunityPosts, queryUserPosts, queryMyPosts } = PostRepository;

const useFeed = ({ targetType, targetId, feedType }) => {
  const FeedQueryTypes = {
    [PostTargetType.GlobalFeed]: queryAllPosts,
    [PostTargetType.CommunityFeed]: queryCommunityPosts.bind(this, {
      communityId: targetId,
      feedType,
    }),
    [PostTargetType.UserFeed]: queryUserPosts.bind(this, { userId: targetId }),
    [PostTargetType.MyFeed]: queryMyPosts,
  };

  // Override default resolver because for MyFeed and GlobalFeed there does not need to be a targetId.
  // This means default resolver will return true and new liveCollection will not be created.
  const liveCollectionResolver = () => {
    if (!targetType) return true;
    return false;
  };

  return useLiveCollection(
    FeedQueryTypes[targetType],
    [targetType, targetId, feedType],
    liveCollectionResolver,
  );
};

export default useFeed;
