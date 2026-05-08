import { useMutation } from '@tanstack/react-query';
import { RoomRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { resolveString } from '~/v4/core/localization';

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
        content: resolveString('amity_social_status_cohost_removed'),
        alignment: notificationAlignment,
      }),
    onError: () =>
      error({
        content: resolveString('amity_social_toast_remove_co_host_failed_toast'),
        alignment: notificationAlignment,
      }),
  });

  const handleRemoveParticipant = (userId: string) => {
    confirm({
      type: 'confirm',
      okButtonColor: 'alert',
      onOk: () => removeParticipant(userId),
      okText: resolveString('amity_social_modal_alert_remove_button'),
      cancelText: resolveString('amity_social_button_cancel'),
      title: resolveString('amity_social_remove_co_host_from_live'),
      pageId,
      content: resolveString('amity_social_modal_alert_remove_cohost_message'),
    });
  };

  return {
    removeParticipant,
    handleRemoveParticipant,
    isPending,
  };
};
