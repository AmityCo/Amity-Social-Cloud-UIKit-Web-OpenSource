import { useQuery } from '@tanstack/react-query';
import useSDK from '~/v4/core/hooks/useSDK';

const STALE_TIME_5_MINUTES = 5 * 60 * 1000;

export default function useUserSettings() {
  const { client } = useSDK();

  const {
    error,
    isLoading,
    data: userSettings,
  } = useQuery({
    queryKey: ['asc-uikit', 'UserSettings'],
    queryFn: async (): Promise<Amity.CoreUserSettings | undefined> => {
      const settings = await client?.getCoreUserSettings();
      return settings;
    },
    enabled: !!client,
    staleTime: STALE_TIME_5_MINUTES,
  });

  return { userSettings, isLoading, error };
}
