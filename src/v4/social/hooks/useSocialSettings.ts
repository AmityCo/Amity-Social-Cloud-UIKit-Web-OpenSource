import useSDK from '~/v4/core/hooks/useSDK';
import { useQuery } from '@tanstack/react-query';
import { STALE_TIME_5_MINUTES } from '~/v4/constants/query';

type SocialSettings = Amity.SocialSettings & {
  story?: {
    allowAllUserToCreateStory: boolean;
  };
};

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
