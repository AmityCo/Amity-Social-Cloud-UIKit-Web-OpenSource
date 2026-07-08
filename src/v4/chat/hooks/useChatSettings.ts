import useSDK from '~/v4/core/hooks/useSDK';
import { useQuery } from '@tanstack/react-query';

type ChatSettings = Amity.ChatSettings;

const STALE_TIME_5_MINUTES = 5 * 60 * 1000;

export default function useChatSettings() {
  const { client } = useSDK();

  const {
    error,
    isLoading,
    data: chatSettings,
  } = useQuery({
    queryKey: ['asc-uikit', 'ChatSettings'],
    queryFn: async (): Promise<ChatSettings | null> => {
      const settings = await client?.getChatSettings();
      return settings as ChatSettings;
    },
    enabled: !!client,
    staleTime: STALE_TIME_5_MINUTES,
  });

  return {
    chatSettings,
    isLoading,
    error,
  };
}
