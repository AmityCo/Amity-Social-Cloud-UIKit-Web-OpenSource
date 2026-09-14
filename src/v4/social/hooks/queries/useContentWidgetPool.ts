import useSDK from '~/v4/core/hooks/useSDK';
import { useQuery } from '@tanstack/react-query';
import { CuratedContentRepository } from '@amityco/ts-sdk';
import { STALE_TIME_5_MINUTES } from '~/v4/constants/query';

type GetPoolParams = Parameters<typeof CuratedContentRepository.getPool>;

type UseContentWidgetPoolParam = {
  topicId: GetPoolParams[0];
  limit?: GetPoolParams[1];
  shouldCall?: boolean;
};

export function useContentWidgetPool({
  topicId,
  limit,
  shouldCall = true,
}: UseContentWidgetPoolParam) {
  const { client } = useSDK();

  const {
    error,
    isLoading,
    data: pool,
  } = useQuery({
    queryKey: ['asc-uikit', 'ContentWidgetPool', topicId, limit],
    queryFn: () => CuratedContentRepository.getPool(topicId, limit),
    enabled: !!client && !!topicId && shouldCall,
    staleTime: STALE_TIME_5_MINUTES,
    retry: false,
  });

  return { pool, isLoading, error };
}
