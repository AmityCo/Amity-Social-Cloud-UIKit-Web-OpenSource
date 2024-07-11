import { StoryRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export const useGlobalStoryTargets = (
  params: Amity.LiveCollectionParams<Amity.StoryGlobalQuery>,
) => {
  const { items, hasMore, loadMore, isLoading, ...rest } = useLiveCollection({
    fetcher: StoryRepository.getGlobalStoryTargets,
    params,
    shouldCall: true,
  });

  const loadMoreStories = () => {
    if (hasMore && !isLoading) {
      loadMore();
    }
  };

  return {
    stories: items,
    hasMore,
    isLoading,
    loadMoreStories,
    ...rest,
  };
};
