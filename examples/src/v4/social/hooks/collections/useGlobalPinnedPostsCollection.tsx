import { PostRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function useGlobalPinnedPostsCollection() {
  const { items, ...rest } = useLiveCollection({
    fetcher: PostRepository.getGlobalPinnedPosts,
    params: { limit: 10 },
    shouldCall: true,
  });

  return {
    globalFeaturedPosts: items,
    ...rest,
  };
}
