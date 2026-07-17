import React from 'react';
import { resolveString, useString } from '~/v4/core/localization';
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
          text={useString('amity_social_label_invite_as_co_host')}
          icon={<AddUser />}
          onPress={handleInviteAsCoHost}
        />
      )}

      {isHost && isPendingCoHost && (
        <MenuOptionButton
          text={useString('amity_social_button_cancel_invitation')}
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
                  title: resolveString(
                    'amity_social_modal_dialog_title_disable_cohost_product_tags',
                  ),
                  content: resolveString('amity_social_disable_product_tagging_description'),
                  cancelText: resolveString('amity_social_button_cancel'),
                  okText: resolveString('amity_social_button_disable'),
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
            text={useString('amity_social_status_remove_from_live')}
            icon={<UserTimes />}
            onPress={handleRemoveCoHost}
            isDanger={true}
          />
        </div>
      )}
      {!isHost && coHostId && !isPendingCoHost && (
        <MenuOptionButton
          text={useString('amity_social_button_leave_as_co_host')}
          icon={<SignOut />}
          onPress={handleLeaveAsCoHost}
          isDanger={true}
        />
      )}
    </div>
  );
};
