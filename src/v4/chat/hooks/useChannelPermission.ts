import { useEffect, useState } from 'react';
import useSDK from '~/core/hooks/useSDK';

const useChannelPermission = (subChannelId: Amity.SubChannel['subChannelId']) => {
  const { client } = useSDK();
  const [isModerator, setIsModerator] = useState(false);

  useEffect(() => {
    const currentUser = client?.hasPermission('MUTE_CHANNEL').currentUser() || false;
    const currentUserInChannel =
      client?.hasPermission('MUTE_CHANNEL').channel(subChannelId) || false;
    setIsModerator(currentUser || currentUserInChannel);
  }, [subChannelId]);

  return {
    isModerator,
  };
};

export default useChannelPermission;
