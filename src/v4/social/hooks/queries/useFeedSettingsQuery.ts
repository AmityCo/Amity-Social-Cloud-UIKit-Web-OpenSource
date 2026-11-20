import { useEffect } from 'react';
import { Client } from '@amityco/ts-sdk';
import useSDK from '~/v4/core/hooks/useSDK';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const FEED_SETTINGS_QUERY_KEY = ['asc-uikit', 'FeedSettings'];

type UseFeedSettingsQueryParam = {
  enabled?: boolean;
};

export function useFeedSettingsQuery({ enabled = true }: UseFeedSettingsQueryParam = {}) {
  const { client, currentUserId } = useSDK();
  const queryClient = useQueryClient();

  const {
    error,
    isLoading,
    data: feedSettings,
  } = useQuery({
    queryKey: [...FEED_SETTINGS_QUERY_KEY, currentUserId],
    queryFn: () => client!.getFeedSettings(),
    enabled: enabled && !!currentUserId,
    staleTime: Infinity,
    gcTime: 0,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: 'always',
  });

  useEffect(() => {
    if (!enabled) return;
    return Client.onSessionStateChange((state: Amity.SessionStates) => {
      if (state === 'established') {
        queryClient.invalidateQueries({ queryKey: FEED_SETTINGS_QUERY_KEY });
      }
    });
  }, [enabled, queryClient]);

  return { feedSettings: error ? undefined : feedSettings, isLoading, error };
}
