import { FeedRepository, EkoPostTargetType } from 'eko-sdk';
import useLiveCollection from 'hooks/useLiveCollection';

const { getGlobalFeed, getCommunityFeed, getUserFeed, getMyFeed } = FeedRepository;

const useFeedSdk = ({ targetType, targetId }) => {
  const FeedQueryTypes = {
    [EkoPostTargetType.GlobalFeed]: getGlobalFeed,
    [EkoPostTargetType.CommunityFeed]: getCommunityFeed.bind(this, { communityId: targetId }),
    [EkoPostTargetType.UserFeed]: getUserFeed.bind(this, { userId: targetId }),
    [EkoPostTargetType.MyFeed]: getMyFeed,
  };

  const [posts, hasMore, loadMore] = useLiveCollection(FeedQueryTypes[targetType], [], () => {}, [
    targetId,
  ]);

  return [posts, hasMore, loadMore];
};

export default useFeedSdk;
