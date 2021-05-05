import { FeedRepository, PostTargetType } from '@amityco/js-sdk';
import useLiveCollection from '~/core/hooks/useLiveCollection';

const { getGlobalFeed, getCommunityFeed, getUserFeed, getMyFeed } = FeedRepository;

const useFeed = ({ targetType, targetId }) => {
  const FeedQueryTypes = {
    [PostTargetType.GlobalFeed]: getGlobalFeed,
    [PostTargetType.CommunityFeed]: getCommunityFeed.bind(this, { communityId: targetId }),
    [PostTargetType.UserFeed]: getUserFeed.bind(this, { userId: targetId }),
    [PostTargetType.MyFeed]: getMyFeed,
  };

  // Override default resolver because for MyFeed and GlobalFeed there does not need to be a targetId.
  // This means default resolver will return true and new liveCollection will not be created.
  const liveCollectionResolver = () => {
    if (!targetType) return true;
    return false;
  };

  const [posts, hasMore, loadMore] = useLiveCollection(
    FeedQueryTypes[targetType],
    [targetType, targetId],
    liveCollectionResolver,
  );

  return [posts, hasMore, loadMore];
};

export default useFeed;
