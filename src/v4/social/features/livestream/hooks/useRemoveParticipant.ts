import { useMutation } from '@tanstack/react-query';
import { RoomRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

export interface UseRemoveParticipantProps {
  room?: Amity.Room | null;
  pageId?: string;
}

export interface UseRemoveParticipantReturn {
  removeParticipant: (userId: string) => void;
  handleRemoveParticipant: (userId: string) => void;
  isPending: boolean;
}

export const useRemoveParticipant = ({
  room,
  pageId = '*',
}: UseRemoveParticipantProps): UseRemoveParticipantReturn => {
  const { confirm } = useConfirmContext();

  const { mutate: removeParticipant, isPending } = useMutation({
    mutationFn: async (userId: string) =>
      RoomRepository.removeParticipant(room?.roomId || '', userId),
  });

  const handleRemoveParticipant = (userId: string) => {
    confirm({
      type: 'confirm',
      okButtonColor: 'alert',
      onOk: () => removeParticipant(userId),
      okText: 'Remove',
      cancelText: 'Cancel',
      title: 'Remove co-host from live',
      pageId,
      content:
        'Are you sure you want to remove this co-host from the live stream? They’ll immediately stop broadcasting and return as a viewer.',
    });
  };

  return {
    removeParticipant,
    handleRemoveParticipant,
    isPending,
  };
};
