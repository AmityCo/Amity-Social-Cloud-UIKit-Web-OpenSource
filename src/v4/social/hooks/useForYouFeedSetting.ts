import useSDK from '~/v4/core/hooks/useSDK';
import { useQuery } from '@tanstack/react-query';
import { STALE_TIME_5_MINUTES } from '~/v4/constants/query';

type UseForYouFeedSettingParam = {
  shouldCall?: boolean;
};

export default function useForYouFeedSetting({
  shouldCall = true,
}: UseForYouFeedSettingParam = {}) {
  const { client } = useSDK();

  const {
    error,
    isPending,
    data: forYouFeedSetting,
  } = useQuery({
    queryKey: ['asc-uikit', 'ForYouFeedSetting'],
    queryFn: async (): Promise<Amity.ForYouFeedSetting | null> => {
      const setting = await client?.getForYouFeedSetting();
      return setting as Amity.ForYouFeedSetting | null;
    },
    enabled: !!client && shouldCall,
    staleTime: STALE_TIME_5_MINUTES,
  });

  return { forYouFeedSetting, isPending, error };
}
