import { PostRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

export default function useCommunityLiveRoomPosts({
  communityIds,
  shouldCall = true,
}: {
  communityIds: string[];
  shouldCall?: boolean;
}) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: PostRepository.getCommunityLiveRoomPosts,
    params: { communityIds },
    shouldCall,
  });

  return {
    posts: items,
    ...rest,
  };
}
