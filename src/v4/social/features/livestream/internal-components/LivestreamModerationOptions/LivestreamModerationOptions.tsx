import React from 'react';
import { MenuOptionButton } from '~/v4/core/internal-components/MenuOptionButton';
import AddUser from '~/v4/icons/AddUser';
import SignOut from '~/v4/icons/SignOut';
import UserTimes from '~/v4/icons/UserTimes';
import styles from './LivestreamModerationOptions.module.css';
import { CoHostToggleProductPermission } from '~/v4/social/features/livestream/internal-components/CoHostToggleProductPermission';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';

export interface LivestreamModerationOptionsProps {
  isHost?: boolean;
  isSelectedCoHostPermission?: boolean;
  isPendingCoHost?: boolean;
  coHostId?: string;
  onInviteAsCoHost?: () => void;
  onCancelInvitation?: () => void;
  onRemoveCoHost?: () => void;
  onLeaveAsCoHost?: () => void;
  onClickOption?: () => void;
  onCoHostPermissionChange?: (canManageProductTags: boolean) => void;
}

export const LivestreamModerationOptions: React.FC<LivestreamModerationOptionsProps> = ({
  isHost,
  isPendingCoHost,
  isSelectedCoHostPermission,
  coHostId,
  onInviteAsCoHost,
  onCancelInvitation,
  onRemoveCoHost,
  onLeaveAsCoHost,
  onClickOption,
  onCoHostPermissionChange,
}) => {
  const { confirm } = useConfirmContext();

  const handleInviteAsCoHost = () => {
    onInviteAsCoHost?.();
    onClickOption?.();
  };

  const handleRemoveCoHost = () => {
    onRemoveCoHost?.();
    onClickOption?.();
  };

  const handleLeaveAsCoHost = () => {
    onLeaveAsCoHost?.();
    onClickOption?.();
  };

  return (
    <div>
      {isHost && !coHostId && (
        <MenuOptionButton
          text="Invite as co-host"
          icon={<AddUser />}
          onPress={handleInviteAsCoHost}
        />
      )}

      {isHost && isPendingCoHost && (
        <MenuOptionButton
          text="Cancel invitation"
          icon={<UserTimes />}
          onPress={() => onCancelInvitation?.()}
          isDanger={true}
        />
      )}
      {isHost && !isPendingCoHost && coHostId && (
        <div className={styles.livestreamModerationOptions__coHostOptions}>
          <CoHostToggleProductPermission
            isSelected={isSelectedCoHostPermission}
            onChange={(canManageProductTags) => {
              if (!canManageProductTags) {
                confirm({
                  title: 'Disable co-host product tags control?',
                  content:
                    'If you disable this, the co-host can’t add, remove, or pin products in this live stream.',

                  cancelText: 'Cancel',
                  okText: 'Disable',
                  okButtonColor: 'alert',
                  onOk: () => {
                    onCoHostPermissionChange?.(canManageProductTags);
                  },
                });
              } else {
                onCoHostPermissionChange?.(canManageProductTags);
              }
            }}
          />
          <MenuOptionButton
            text="Remove from live"
            icon={<UserTimes />}
            onPress={handleRemoveCoHost}
            isDanger={true}
          />
        </div>
      )}
      {!isHost && coHostId && !isPendingCoHost && (
        <MenuOptionButton
          text="Leave as co-host"
          icon={<SignOut />}
          onPress={handleLeaveAsCoHost}
          isDanger={true}
        />
      )}
    </div>
  );
};
