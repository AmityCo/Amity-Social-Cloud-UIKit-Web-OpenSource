import { useMutation } from '@tanstack/react-query';
import { RoomRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

export interface UseLeaveRoomProps {
  room?: Amity.Room | null;
  pageId?: string;
}

export interface UseLeaveRoomReturn {
  leaveRoom: () => void;
  isPending: boolean;
}

export const useLeaveRoom = ({ room, pageId = '*' }: UseLeaveRoomProps): UseLeaveRoomReturn => {
  const { mutate: leaveRoom, isPending } = useMutation({
    mutationFn: async () => RoomRepository.leaveRoom(room?.roomId || ''),
  });

  return {
    leaveRoom,
    isPending,
  };
};
