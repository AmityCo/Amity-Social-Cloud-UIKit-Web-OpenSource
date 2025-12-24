import { useMutation } from '@tanstack/react-query';
import { RoomRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';

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
  const { success, error } = useNotifications();
  const { notificationAlignment } = useLivestreamData();

  const { mutate: removeParticipant, isPending } = useMutation({
    mutationFn: async (userId: string) =>
      RoomRepository.removeParticipant(room?.roomId || '', userId),
    onSuccess: () =>
      success({
        content: 'Co-host removed from live.',
        alignment: notificationAlignment,
      }),
    onError: () =>
      error({
        content: 'Failed to remove co-host. Please try again.',
        alignment: notificationAlignment,
      }),
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
