import React from 'react';
import { Typography } from '~/v4/core/components';
import { MenuOptionButton } from '~/v4/core/internal-components/MenuOptionButton';
import AddUser from '~/v4/icons/AddUser';
import SignOut from '~/v4/icons/SignOut';
import UserShield from '~/v4/icons/UserShield';
import UserTimes from '~/v4/icons/UserTimes';
import { CoHostBadge } from '~/v4/social/elements/CoHostBadge';
import styles from './LivestreamModerationOptions.module.css';

export interface LivestreamModerationOptionsProps {
  displayName?: string;
  isHost?: boolean;
  isModerator?: boolean;
  isPendingCoHost?: boolean;
  coHostId?: string;
  onInviteAsCoHost?: () => void;
  onPromoteToModerator?: () => void;
  onCancelInvitation?: () => void;
  onRemoveCoHost?: () => void;
  onLeaveAsCoHost?: () => void;
  onClickOption?: () => void;
}

export const LivestreamModerationOptions: React.FC<LivestreamModerationOptionsProps> = ({
  displayName,
  isHost,
  isModerator,
  isPendingCoHost,
  coHostId,
  onInviteAsCoHost,
  onPromoteToModerator,
  onCancelInvitation,
  onRemoveCoHost,
  onLeaveAsCoHost,
  onClickOption,
}) => {
  const handleInviteAsCoHost = () => {
    onInviteAsCoHost?.();
    onClickOption?.();
  };

  const handlePromoteToModerator = () => {
    onPromoteToModerator?.();
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
    <div className={styles.livestreamModerationOptions}>
      <div className={styles.livestreamModerationOptions__header}>
        <Typography.TitleBold className={styles.livestreamModerationOptions__header__text}>
          {displayName}
        </Typography.TitleBold>
        {coHostId && <CoHostBadge />}
      </div>
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
        <MenuOptionButton
          text="Remove from live"
          icon={<UserTimes />}
          onPress={handleRemoveCoHost}
          isDanger={true}
        />
      )}
      {!isHost && coHostId && !isPendingCoHost && (
        <MenuOptionButton
          text="Leave as co-host"
          icon={<SignOut />}
          onPress={handleLeaveAsCoHost}
          isDanger={true}
        />
      )}
      {isHost && !isModerator && (
        <MenuOptionButton
          text="Promote to moderator"
          icon={<UserShield />}
          onPress={handlePromoteToModerator}
        />
      )}
    </div>
  );
};
