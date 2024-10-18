import { PostRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function usePinnedPostsCollection({
  communityId,
  placement,
}: Partial<Parameters<typeof PostRepository.getPinnedPosts>[0]>) {
  const { items, ...rest } = useLiveCollection({
    fetcher: PostRepository.getPinnedPosts,
    params: {
      communityId: communityId,
      placement: placement,
      sortBy: 'lastPinned',
    },
    shouldCall: !!communityId,
  });

  return {
    pinnedPost: items,
    ...rest,
  };
}
