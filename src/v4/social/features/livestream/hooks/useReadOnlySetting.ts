import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { ChannelRepository, RoomRepository } from '@amityco/ts-sdk';

export interface UseReadOnlySettingReturn {
  readOnly: boolean;
  setReadOnly: (readOnly: boolean) => Promise<void>;
  isPending: boolean;
}

export interface UseReadOnlySettingProps {
  room?: Amity.Room | null;
  channel?: Amity.Channel<'live'> | null;
}

export const useReadOnlySetting = ({
  room,
  channel,
}: UseReadOnlySettingProps): UseReadOnlySettingReturn => {
  const [readOnly, setReadOnlyState] = useState(false);

  // Initialize readOnly state based on room's liveChatEnabled property
  useEffect(() => {
    if (room) {
      // If liveChatEnabled is false, then it's read-only (inverted logic)
      setReadOnlyState(!room.liveChatEnabled);
    }
  }, [room?.liveChatEnabled]);

  const { mutate: updateReadOnlySetting, isPending } = useMutation({
    mutationFn: async (newReadOnly: boolean) => {
      if (!room?.roomId) {
        throw new Error('Room ID is required to update read-only setting');
      }

      // Update room's liveChatEnabled setting
      const roomUpdatePromise = RoomRepository.updateRoom(room.roomId, {
        liveChatEnabled: !newReadOnly, // Invert: readOnly=true means liveChatEnabled=false
      });

      // Update channel mute/unmute setting if channel is available
      let channelUpdatePromise: Promise<any> | null = null;
      if (channel?.channelId) {
        if (newReadOnly) {
          // If setting to read-only, mute the channel
          channelUpdatePromise = ChannelRepository.muteChannel(channel.channelId);
        } else {
          // If setting to interactive, unmute the channel
          channelUpdatePromise = ChannelRepository.unmuteChannel(channel.channelId);
        }
      }

      // Wait for both operations to complete
      const results = await Promise.all([
        roomUpdatePromise,
        channelUpdatePromise || Promise.resolve(null),
      ]);

      return results[0]; // Return room update result
    },
    onSuccess: (_, newReadOnly) => {
      setReadOnlyState(newReadOnly);
    },
    onError: (error: unknown) => {
      console.error('❌ Failed to update read-only setting:', error);
    },
  });

  const setReadOnly = async (newReadOnly: boolean): Promise<void> => {
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
