import { StoryRepository } from '@amityco/ts-sdk';
import useLiveCollection from '~/v4/core/hooks/useLiveCollection';

export const useGetActiveStoriesByTarget = (params: Amity.GetStoriesByTargetParam) => {
  const { items, ...rest } = useLiveCollection({
    fetcher: StoryRepository.getActiveStoriesByTarget,
    params,
    shouldCall: () => true,
  });

  return {
    stories: items,
    ...rest,
  };
};
