import { useEffect, useState } from 'react';

interface UseLivechatParams {
  room?: Amity.Room | null;
  targetType: Amity.PostTargetType;
}

export const useLivechat = ({ room, targetType }: UseLivechatParams) => {
  const [channel, setChannel] = useState<Amity.Channel<'live'> | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (room && !isLoading && room?.status === 'live' && !channel && targetType !== 'user') {
      setIsLoading(true);
      room.getLiveChat().then((channel: Amity.Channel<'live'> | undefined) => {
        setChannel(channel);
        setIsLoading(false);
      });
    }
  }, [room, channel, isLoading, targetType]);

  return {
    channel,
    isLoading,
  };
};
