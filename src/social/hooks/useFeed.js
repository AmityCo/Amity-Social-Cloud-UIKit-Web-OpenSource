import { PostRepository, PostTargetType } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const { queryAllPosts, queryCommunityPosts, queryUserPosts, queryMyPosts } = PostRepository;
const QUERY_LIMIT = 10;

const useFeed = ({ targetType, targetId, feedType }) => {
  const FeedQueryTypes = {
    [PostTargetType.GlobalFeed]: queryAllPosts.bind(this, {
      limit: QUERY_LIMIT,
    }),
    [PostTargetType.CommunityFeed]: queryCommunityPosts.bind(this, {
      communityId: targetId,
      feedType,
      limit: QUERY_LIMIT,
    }),
    [PostTargetType.UserFeed]: queryUserPosts.bind(this, { userId: targetId, limit: QUERY_LIMIT }),
    [PostTargetType.MyFeed]: queryMyPosts.bind(this, { limit: QUERY_LIMIT }),
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
