import { ChannelRepository } from '@amityco/ts-sdk';
import { useEffect, useState } from 'react';
import { useSdkEffect } from '~/v4/core/hooks/useSdkEffect';

export const useChannel = ({ channelId }: { channelId?: string }) => {
  // TODO: add hook to use with live object
  const [channel, setChannel] = useState<Amity.Channel>();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(true);

  useSdkEffect(
    ChannelRepository.getChannel,
    () => {
      if (!channelId) return;

      const getChannel = () =>
        ChannelRepository.getChannel(channelId, ({ data, loading, error }) => {
          setLoading(loading);
          if (!loading && data) setChannel(data);
          if (error) setError(error);
        });

      const unsubscribe = getChannel();

      return () => unsubscribe();
    },
    [channelId],
  );

  return { channel, error, loading };
};
