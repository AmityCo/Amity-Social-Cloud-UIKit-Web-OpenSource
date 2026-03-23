import clsx from 'clsx';
import React, { useEffect, useState } from 'react';
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
import { useUpdateCohostPermission } from '~/v4/social/features/livestream/hooks';
import { UserModerationHeader } from '~/v4/social/features/livestream/internal-components/UserModerationHeader';

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
  const { updateCohostPermission } = useUpdateCohostPermission({ room, pageId });
  const {
    invitedCoHost,
    isHost,
    isModerator,
    handleCancelInvitation,
    handleRemoveCoHost,
    handleLeaveAsCoHost,
    canCoHostManageProductTags,
  } = useLivestreamModeration({
    pageId,
    room,
    channel,
    invitation,
    onCoHostLeaveLiveKitRoom,
  });

  const [canCoHostManageProductTagsState, setCanCoHostManageProductTagsState] = useState<
    boolean | undefined
  >(canCoHostManageProductTags);

  useEffect(() => {
    setCanCoHostManageProductTagsState(canCoHostManageProductTags);
  }, [canCoHostManageProductTags]);

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
          className={styles.participantHeader__popoverWrapper}
        >
          {({ closePopover }: { closePopover: () => void }) => (
            <div className={styles.participantHeader__popover}>
              <UserModerationHeader
                pageId={pageId}
                displayName={displayName}
                isBrandUser={isBrandUser}
                isMuted={isMuted}
                isCoHost={!!(coHost || invitedCoHost)}
                isModerator={isModerator}
                showMutedIcon={false}
              />
              <LivestreamModerationOptions
                coHostId={
                  hostId !== currentUser?.userId
                    ? currentUser?.userId
                    : invitedCoHost?.userId ?? coHost?.userId
                }
                isSelectedCoHostPermission={canCoHostManageProductTagsState}
                isPendingCoHost={invitation?.status === 'pending'}
                onCoHostPermissionChange={async (canManageProductTags) => {
                  const currentCoHostId = invitedCoHost?.userId ?? coHost?.userId;
                  if (currentCoHostId) {
                    const previousState = canCoHostManageProductTagsState;
                    setCanCoHostManageProductTagsState(canManageProductTags);
                    try {
                      updateCohostPermission({ coHostId: currentCoHostId, canManageProductTags });
                    } catch {
                      setCanCoHostManageProductTagsState(previousState);
                    }
                  }
                }}
                onCancelInvitation={handleCancelInvitation}
                onLeaveAsCoHost={handleLeaveAsCoHost}
                onClickOption={closePopover}
                onRemoveCoHost={handleRemoveCoHost}
                isHost={isHost && hostId === currentUser?.userId}
              />
            </div>
          )}
        </Popover>
      )}
    </div>
  );
};
