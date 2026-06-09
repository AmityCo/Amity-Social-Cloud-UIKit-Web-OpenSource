import { useCallback } from 'react';
import useLiveObjectV4 from '~/v4/core/hooks/useLiveObjectV4';

export function useChannelMyMembership(channel?: Amity.Channel | null) {
  const fetcher = useCallback(
    (
      _params: string,
      callback: Amity.LiveObjectCallback<Amity.Membership<'channel'> | undefined>,
    ) => channel!.myMembership(callback),
    [channel],
  );

  const { item, isLoading, error } = useLiveObjectV4<
    string,
    Amity.Membership<'channel'> | undefined,
    never
  >({
    fetcher,
    params: channel?.channelId ?? '',
    shouldCall: !!channel?.channelId,
  });

  return {
    membership: item ?? undefined,
    isLoading,
    error,
  };
}
