import { hashAPIKey } from '~/v4/utils';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AmityUIKitManager } from '~/v4/core/AmityUIKitManager';

export const useNetworkConfig = (client: Amity.Client | null) => {
  const queryClient = useQueryClient();
  const previousApiKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (client?.apiKey && previousApiKeyRef.current !== client.apiKey) {
      if (previousApiKeyRef.current) {
        queryClient.removeQueries({
          queryKey: ['networkConfig', hashAPIKey(previousApiKeyRef.current)],
          exact: true,
        });
      }
      previousApiKeyRef.current = client.apiKey;
    }
  }, [client?.apiKey, queryClient]);

  const { data, isLoading } = useQuery({
    queryKey: ['networkConfig', client?.apiKey ? hashAPIKey(client?.apiKey) : null],
    queryFn: AmityUIKitManager.syncNetworkConfig,
    enabled: !!client && !!client?.apiKey,
  });

  return {
    networkConfig: data,
    isNetworkConfigLoading: isLoading,
  };
};
