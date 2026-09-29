import { hashAPIKey } from '~/v4/utils';
import { useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AmityUIKitManager } from '~/v4/core/AmityUIKitManager';

/**
 * The network's module entitlement, read once per session.
 *
 * Keyed on the api key the way `useNetworkConfig` is: the entitlement belongs to
 * a network, so a host that swaps api keys must not keep the previous network's
 * grants.
 *
 * Fails open on every path that is not a clear answer — one retry, then null,
 * which is the behaviour the UIKit had before this read existed. An entitlement
 * the client could not reach must never hide a feature the customer is paying
 * for: the API itself still allows the call, and a customer staring at a missing
 * feature they can be billed for is the worse of the two failures.
 */
export const useNetworkEntitlement = (client: Amity.Client | null) => {
  const queryClient = useQueryClient();
  const previousApiKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (client?.apiKey && previousApiKeyRef.current !== client.apiKey) {
      if (previousApiKeyRef.current) {
        queryClient.removeQueries({
          queryKey: ['networkEntitlement', hashAPIKey(previousApiKeyRef.current)],
          exact: true,
        });
      }
      previousApiKeyRef.current = client.apiKey;
    }
  }, [client?.apiKey, queryClient]);

  const { data, isLoading } = useQuery<Amity.ModuleSettings | null>({
    queryKey: ['networkEntitlement', client?.apiKey ? hashAPIKey(client?.apiKey) : null],
    queryFn: AmityUIKitManager.syncNetworkEntitlement,
    enabled: !!client && !!client?.apiKey,
    // The tree waits on this read, so the default three retries would hold the
    // whole UIKit behind an endpoint an older core does not have.
    retry: 1,
    staleTime: Infinity,
  });

  return {
    entitlement: data ?? null,
    isEntitlementLoading: isLoading,
  };
};
