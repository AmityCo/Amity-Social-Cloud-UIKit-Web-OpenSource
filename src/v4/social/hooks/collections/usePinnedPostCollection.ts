import { PostRepository, PostStructureType } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { useFeatureEnabled } from '~/v4/core/providers/CustomizationProvider';
import { postsForModules } from '~/v4/social/utils/postsForModules';

export default function usePinnedPostsCollection({
  communityId,
  placement,
  shouldCall,
}: Partial<Parameters<typeof PostRepository.getPinnedPosts>[0]> & { shouldCall?: boolean }) {
  // `getPinnedPosts` takes no dataTypes, so a poll or a livestream pinned to a
  // community comes back whatever the customer bought. Filtered here rather
  // than at the two call sites — the community feed and the pinned tab both
  // read this, and one of them would have been missed.
  const isPollEnabled = useFeatureEnabled('poll');
  const isLiveEnabled = useFeatureEnabled('live');

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
    pinnedPost: items
      .filter(
        (pinnedPost) =>
          pinnedPost.post?.structureType !== PostStructureType.AUDIO &&
          pinnedPost.post?.structureType !== PostStructureType.FILE &&
          pinnedPost.post?.structureType !== PostStructureType.MIXED,
      )
      .filter(
        (pinnedPost) =>
          !pinnedPost.post ||
          postsForModules([pinnedPost.post], { isPollEnabled, isLiveEnabled }).length > 0,
      ),
    ...rest,
  };
}
