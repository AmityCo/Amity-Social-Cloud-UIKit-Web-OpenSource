import { StoryRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export const useGlobalStoryTargets = (
  params: Amity.LiveCollectionParams<Amity.StoryGlobalQuery>,
) => {
  const { items, hasMore, loadMore, ...rest } = useLiveCollection({
    fetcher: StoryRepository.getGlobalStoryTargets,
    params,
    shouldCall: true,
  });

  const loadMoreStories = () => {
    if (hasMore) {
      loadMore();
    }
  };

  return {
    stories: items,
    hasMore,
    loadMoreStories,
    ...rest,
  };
};
