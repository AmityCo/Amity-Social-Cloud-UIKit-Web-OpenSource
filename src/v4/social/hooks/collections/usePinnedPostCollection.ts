import { PostRepository, PostStructureType } from '@amityco/ts-sdk';
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
    pinnedPost: items.filter(
      (pinnedPost) =>
        pinnedPost.post?.structureType !== PostStructureType.AUDIO &&
        pinnedPost.post?.structureType !== PostStructureType.FILE &&
        pinnedPost.post?.structureType !== PostStructureType.MIXED,
    ),
    ...rest,
  };
}
