import { useMutation } from '@tanstack/react-query';
import { RoomRepository } from '@amityco/ts-sdk';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { resolveString } from '~/v4/core/localization';

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
        content: resolveString('amity_social_toast_update_cohost_permission_failed'),
        alignment: notificationAlignment,
      });
    },
  });

  const handleUpdateCohostPermission = (coHostId: string) => {
    confirm({
      type: 'confirm',
      okButtonColor: 'alert',
      onOk: () => updateCohostPermission({ coHostId, canManageProductTags: false }),
      okText: resolveString('amity_social_button_disable'),
      cancelText: resolveString('amity_social_button_cancel'),
      title: resolveString('amity_social_modal_dialog_title_disable_cohost_product_tags'),
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
