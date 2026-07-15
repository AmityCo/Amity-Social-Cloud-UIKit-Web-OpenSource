import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChannelRepository } from '@amityco/ts-sdk';
import { useChannel } from '~/v4/chat/hooks/useChannel';

export interface UseReadOnlySettingReturn {
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => Promise<void>;
  isPending: boolean;
}

export interface UseReadOnlySettingProps {
  channel?: Amity.Channel<'live'> | null;
}

export const useReadOnlySetting = ({
  channel,
}: UseReadOnlySettingProps): UseReadOnlySettingReturn => {
  const channelId = channel?.channelId;

  // Subscribe to the live channel so `isMuted` reflects mute/unmute as it
  // propagates. Read-only is enforced purely by muting the channel; the room's
  // liveChatEnabled flag is left untouched (the live chat stays enabled).
  const { channel: liveChannel } = useChannel({ channelId });
  const isMuted = ((liveChannel ?? channel)?.isMuted ?? false) as boolean;

  // Optimistic override for immediate UI feedback and the creation-preview case
  // (no channel exists yet). `null` means "follow the channel's real isMuted".
  const [optimisticReadOnly, setOptimisticReadOnly] = useState<boolean | null>(null);
  const readOnly = optimisticReadOnly ?? isMuted;

  // Once the channel reflects the optimistic value, stop overriding it.
  useEffect(() => {
    if (optimisticReadOnly !== null && isMuted === optimisticReadOnly) {
      setOptimisticReadOnly(null);
    }
  }, [isMuted, optimisticReadOnly]);

  const { mutate: updateReadOnlySetting, isPending } = useMutation({
    mutationFn: async (newReadOnly: boolean) => {
      if (!channelId) return null;
      // Mute to enable read-only, unmute to make the chat interactive again.
      return newReadOnly
        ? ChannelRepository.muteChannel(channelId)
        : ChannelRepository.unmuteChannel(channelId);
    },
    onError: (error: unknown) => {
      // Revert the optimistic state so the toggle reflects the real channel.
      setOptimisticReadOnly(null);
      console.error('❌ Failed to update read-only setting:', error);
    },
  });

  const setReadOnly = async (newReadOnly: boolean): Promise<void> => {
    setOptimisticReadOnly(newReadOnly);
    // No channel yet (e.g. during livestream creation preview): keep the
    // optimistic state only. The choice is applied at creation time by
    // useCreateLivestream, which mutes the channel once it exists.
    if (!channelId) return;
    return new Promise((resolve, reject) => {
      updateReadOnlySetting(newReadOnly, {
        onSuccess: () => resolve(),
        onError: (error) => reject(error),
      });
    });
  };

  return {
    readOnly,
    setReadOnly,
    isPending,
  };
};
