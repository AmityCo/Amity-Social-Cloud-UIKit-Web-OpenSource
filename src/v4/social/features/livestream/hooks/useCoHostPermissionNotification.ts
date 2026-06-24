import { useEffect, useRef } from 'react';
import useSDK from '~/v4/core/hooks/useSDK';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { NotificationAlignment } from '~/v4/core/components/Notification';
import { resolveString } from '~/v4/core/localization';

export interface UseCoHostPermissionNotificationProps {
  room?: Amity.Room | null;
  notificationAlignment?: NotificationAlignment;
}

export const useCoHostPermissionNotification = ({
  room,
  notificationAlignment,
}: UseCoHostPermissionNotificationProps) => {
  const { currentUserId } = useSDK();
  const { success } = useNotifications();
  const previousPermissionRef = useRef<boolean | undefined>(undefined);

  // Find the current user's co-host participant
  const coHostParticipant = room?.participants?.find(
    (participant) => participant.userId === currentUserId && participant.type === 'coHost',
  );

  const canManageProductTags = coHostParticipant?.canManageProductTags;

  useEffect(() => {
    if (!room?.roomId || !currentUserId) {
      return;
    }

    // Only show notification when permission changes (not on initial mount)
    if (previousPermissionRef.current !== undefined && canManageProductTags !== undefined) {
      if (canManageProductTags && !previousPermissionRef.current) {
        // Permission granted
        success({
          content: resolveString('amity_social_status_product_tagging_enabled'),
          alignment: notificationAlignment,
        });
      }
    }

    previousPermissionRef.current = canManageProductTags;
  }, [canManageProductTags, currentUserId]);
};
