import { PostRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export default function usePinnedPostsCollection({
  communityId,
  placement,
  shouldCall,
}: Partial<Parameters<typeof PostRepository.getPinnedPosts>[0]> & { shouldCall?: boolean }) {
  const { items, ...rest } = useLiveCollection({
    fetcher: PostRepository.getPinnedPosts,
    params: {
      communityId: communityId!,
      placement: placement,
      sortBy: 'lastPinned',
    },
    shouldCall: shouldCall,
  });

  return {
    pinnedPost: items,
    ...rest,
  };
}
