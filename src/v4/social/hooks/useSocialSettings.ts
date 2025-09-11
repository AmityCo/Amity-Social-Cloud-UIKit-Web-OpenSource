import useSDK from '~/v4/core/hooks/useSDK';
import { useQuery } from '@tanstack/react-query';

type SocialSettings = Amity.SocialSettings & {
  story?: {
    allowAllUserToCreateStory: boolean;
  };
};

const STALE_TIME_5_MINUTES = 5 * 60 * 1000;

export default function useSocialSettings() {
  const { client } = useSDK();

  const {
    error,
    isLoading,
    data: socialSettings,
  } = useQuery({
    queryKey: ['asc-uikit', 'SocialSettings'],
    queryFn: async (): Promise<SocialSettings | null> => {
      const settings = await client?.getSocialSettings();
      return settings as SocialSettings;
    },
    enabled: !!client,
    staleTime: STALE_TIME_5_MINUTES,
  });

  return { socialSettings, isLoading, error };
}
