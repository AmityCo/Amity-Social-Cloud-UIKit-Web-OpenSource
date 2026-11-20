import { StoryRepository } from '@amityco/ts-sdk';
import { isNonNullable } from '~/v4/helpers/utils';
import { usePaginator } from '~/v4/core/hooks/usePaginator';

export const useGetActiveStoriesByTarget = (
  params: Amity.GetStoriesByTargetParam,
  { fresh }: { fresh?: boolean } = {},
) => {
  const { items, refresh, ...rest } = usePaginator({
    fetcher: StoryRepository.getActiveStoriesByTarget,
    params,
    shouldCall: true,
    fresh,
    pageSize: 10,
    placement: 'story' as Amity.AdPlacement,
    getItemId: (item) => item?.storyId || '',
  });

  return {
    stories: items.filter(isNonNullable),
    refresh,
    ...rest,
  };
};
