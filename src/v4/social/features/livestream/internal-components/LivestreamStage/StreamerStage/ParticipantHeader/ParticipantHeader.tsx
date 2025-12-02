import clsx from 'clsx';
import React from 'react';
import styles from './ParticipantHeader.module.css';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { Popover } from '~/v4/core/components/AriaPopover';
import Kebub from '~/v4/icons/Kebub';
import { LivestreamModerationOptions } from '~/v4/social/features/livestream/internal-components/LivestreamModerationOptions';
import { useLivestreamModeration } from '~/v4/social/features/livestream/hooks/useLivestreamModeration';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import MuteMic from '~/v4/icons/MutedMic';
import useSDK from '~/v4/core/hooks/useSDK';
import { BrandBadge } from '~/v4/social/elements';

export interface ParticipantHeaderProps {
  pageId?: string;
  className?: string;
  showOptions?: boolean;
  isMuted?: boolean;
  onCoHostLeaveLiveKitRoom?: () => void;
}

export const ParticipantHeader: React.FC<ParticipantHeaderProps> = ({
  pageId = '*',
  className,
  showOptions = true,
  isMuted,
  onCoHostLeaveLiveKitRoom,
}) => {
  // Get values from context
  const { room, channel, invitationByMe: invitation, coHost, hostId } = useLivestreamData();
  const { currentUser } = useSDK();
  const {
    invitedCoHost,
    isHost,
    isModerator,
    handleCancelInvitation,
    handlePromoteToModerator,
    handleRemoveCoHost,
    handleLeaveAsCoHost,
  } = useLivestreamModeration({
    pageId,
    room,
    channel,
    invitation,
    onCoHostLeaveLiveKitRoom,
  });

  const displayName =
    hostId !== currentUser?.userId
      ? currentUser?.userId
      : invitedCoHost?.displayName ?? coHost?.user?.displayName;

  const isBrandUser =
    hostId !== currentUser?.userId
      ? currentUser?.isBrand
      : invitedCoHost?.isBrand ?? coHost?.user?.isBrand;

  return (
    <div className={clsx(styles.participantHeader, className)}>
      <div className={styles.participantHeader__displayName}>
        <Typography.Body className={styles.participantHeader__displayName__text}>
          {displayName}
        </Typography.Body>
        <div className={styles.participantHeader__brandBadge}>{isBrandUser && <BrandBadge />}</div>

        {isMuted && <MuteMic className={styles.participantHeader__muteMic__icon} />}
      </div>

      {showOptions && (
        <Popover
          placement="bottom left"
          trigger={({ openPopover }: any) => (
            <Button
              className={styles.participantHeader__optionButton}
              onPress={openPopover}
              variant="default"
            >
              <Kebub className={styles.participantHeader__optionButton__icon} />
            </Button>
          )}
        >
          {({ closePopover }: { closePopover: () => void }) => (
            <LivestreamModerationOptions
              displayName={displayName}
              coHostId={
                hostId !== currentUser?.userId
                  ? currentUser?.userId
                  : invitedCoHost?.userId ?? coHost?.userId
              }
              isPendingCoHost={invitation?.status === 'pending'}
              onCancelInvitation={handleCancelInvitation}
              onPromoteToModerator={handlePromoteToModerator}
              onLeaveAsCoHost={handleLeaveAsCoHost}
              onClickOption={closePopover}
              onRemoveCoHost={handleRemoveCoHost}
              isHost={isHost && hostId === currentUser?.userId}
              isModerator={isModerator && hostId === currentUser?.userId}
            />
          )}
        </Popover>
      )}
    </div>
  );
};
