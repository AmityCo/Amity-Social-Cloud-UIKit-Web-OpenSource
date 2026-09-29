import { PostRepository, PostStructureType } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';
import { useFeatureEnabled } from '~/v4/core/providers/CustomizationProvider';
import { postsForModules } from '~/v4/social/utils/postsForModules';

export default function useGlobalPinnedPostsCollection() {
  // `getGlobalPinnedPosts` takes no dataTypes either, and these arrive at the
  // home feeds as `globalFeaturedPosts` — a prop of their own, beside `posts`,
  // so the filter over `posts` never saw them.
  const isPollEnabled = useFeatureEnabled('poll');
  const isLiveEnabled = useFeatureEnabled('live');

  const { items, ...rest } = useLiveCollection({
    fetcher: PostRepository.getGlobalPinnedPosts,
    params: { limit: 10 },
    shouldCall: true,
  });

  return {
    globalFeaturedPosts: items
      .filter(
        (pinnedPost) =>
          pinnedPost.post &&
          pinnedPost.post?.structureType !== PostStructureType.AUDIO &&
          pinnedPost.post?.structureType !== PostStructureType.FILE &&
          pinnedPost.post?.structureType !== PostStructureType.MIXED,
      )
      .filter(
        (pinnedPost) =>
          postsForModules([pinnedPost.post], { isPollEnabled, isLiveEnabled }).length > 0,
      ),
    ...rest,
  };
}
