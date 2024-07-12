import { useMemo } from 'react';
import useSDK from '~/core/hooks/useSDK';

export const useChannelPermission = (subChannelId?: Amity.SubChannel['subChannelId']) => {
  const { client } = useSDK();

  const isModerator = useMemo(() => {
    if (!subChannelId) return false;
    const currentUser = client?.hasPermission('MUTE_CHANNEL').currentUser() || false;
    const currentUserInChannel =
      client?.hasPermission('MUTE_CHANNEL').channel(subChannelId) || false;
    return currentUser || currentUserInChannel;
  }, [subChannelId]);

  return {
    isModerator,
  };
};
