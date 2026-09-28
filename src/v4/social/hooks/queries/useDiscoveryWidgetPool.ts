import useSDK from '~/v4/core/hooks/useSDK';
import { useQuery } from '@tanstack/react-query';
import { CuratedContentRepository } from '@amityco/ts-sdk';
import { STALE_TIME_5_MINUTES } from '~/v4/constants/query';

type GetPoolParams = Parameters<typeof CuratedContentRepository.getPool>;

type UseDiscoveryWidgetPoolParam = {
  topicId: GetPoolParams[0];
  limit?: GetPoolParams[1];
  shouldCall?: boolean;
};

export function useDiscoveryWidgetPool({
  topicId,
  limit,
  shouldCall = true,
}: UseDiscoveryWidgetPoolParam) {
  const { client } = useSDK();

  const {
    error,
    isLoading,
    data: pool,
  } = useQuery({
    queryKey: ['asc-uikit', 'DiscoveryWidgetPool', topicId, limit],
    queryFn: () => CuratedContentRepository.getPool(topicId, limit),
    enabled: !!client && !!topicId && shouldCall,
    staleTime: STALE_TIME_5_MINUTES,
    retry: false,
  });

  return { pool, isLoading, error };
}
