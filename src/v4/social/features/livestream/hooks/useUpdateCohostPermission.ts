import { useMutation } from '@tanstack/react-query';
import { RoomRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';

export interface UseUpdateCohostPermissionProps {
  room?: Amity.Room | null;
  pageId?: string;
}

export interface UseUpdateCohostPermissionReturn {
  updateCohostPermission: (params: { coHostId: string; canManageProductTags: boolean }) => void;
  handleUpdateCohostPermission: (coHostId: string) => void;
  isPending: boolean;
}

export const useUpdateCohostPermission = ({
  room,
  pageId = '*',
}: UseUpdateCohostPermissionProps): UseUpdateCohostPermissionReturn => {
  const { confirm } = useConfirmContext();
  const { info } = useNotifications();
  const { notificationAlignment } = useLivestreamData();

  const { mutate: updateCohostPermission, isPending } = useMutation({
    mutationFn: async ({
      coHostId,
      canManageProductTags,
    }: {
      coHostId: string;
      canManageProductTags: boolean;
    }) => {
      if (!room?.roomId) return;
      return RoomRepository.updateCohostPermission(room?.roomId, coHostId, canManageProductTags);
    },
    onError: (error) => {
      return info({
        content: 'Failed to update co-host permission. Please try again.',
        alignment: notificationAlignment,
      });
    },
  });

  const handleUpdateCohostPermission = (coHostId: string) => {
    confirm({
      type: 'confirm',
      okButtonColor: 'alert',
      onOk: () => updateCohostPermission({ coHostId, canManageProductTags: false }),
      okText: 'Disable',
      cancelText: 'Cancel',
      title: 'Disable co-host product tags control?',
      pageId,
      content:
        'If you disable this, the co-host can’t add, remove, or pin products in this live stream.',
    });
  };

  return {
    updateCohostPermission,
    handleUpdateCohostPermission,
    isPending,
  };
};
