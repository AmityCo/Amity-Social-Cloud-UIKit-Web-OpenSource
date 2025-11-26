import React, { useEffect, useMemo } from 'react';
import styles from './LivestreamHeader.module.css';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import CloseIcon from '~/v4/icons/Close';
import { ChevronDown } from '~/v4/icons/ChevronDown';
import { LiveStreamLiveBadge } from '~/v4/social/features/livestream/internal-components';
import { LivestreamHeaderMenu } from '~/v4/social/features/livestream/internal-components/LivestreamHeaderMenu';
import { Popover } from '~/v4/core/components/AriaPopover';
import { IconButton } from '~/v4/core/components/IconButton';
import Kebub from '~/v4/icons/Kebub';
import {
  useLivestreamTimer,
  useWatchingCount,
  UseCreateLivestreamReturn,
} from '~/v4/social/features/livestream/hooks';
import { WatchingCountBadge } from '~/v4/social/features/livestream/internal-components/WatchingCountBadge';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import useSDK from '~/v4/core/hooks/useSDK';
import { FileRepository } from '@amityco/ts-sdk';
import eventThumbnail from '~/v4/social/assets/images/event-default-thumbnail.png';
import { BrandBadge } from '~/v4/social/elements';

export interface LivestreamHeaderProps {
  pageId: string;
  isTargetEvent?: boolean;
  targetType?: 'user' | 'community';
  community?: Amity.Community;
  uiState: UseCreateLivestreamReturn['uiState'];
  readOnly?: boolean;
  isCoHost?: boolean;
  setReadOnly?: (readOnly: boolean) => void;
  onClose: () => void;
  onTargetSelection?: () => void;
  onStreamEnd?: () => void;
  showCountdownOverlay?: boolean;
  setShowCountdownOverlay?: (show: boolean) => void;
  event?: Amity.Event;
}

export const LivestreamHeader: React.FC<LivestreamHeaderProps> = ({
  pageId = '*',
  isTargetEvent = false,
  targetType,
  community,
  uiState,
  readOnly = false,
  isCoHost,
  setReadOnly,
  onClose,
  onTargetSelection,
  onStreamEnd,
  showCountdownOverlay,
  setShowCountdownOverlay,
  event,
}) => {
  // Constants for livestream limits
  const { room, hostId } = useLivestreamData();
  const { currentUserId } = useSDK();
  const LIVESTREAM_LIMIT_HOURS = 4;
  const COUNTDOWN_SECONDS = 10; // Last 10 seconds
  const LIVESTREAM_LIMIT_SECONDS = LIVESTREAM_LIMIT_HOURS * 60 * 60; // 4 hours = 14400 seconds
  const COUNTDOWN_TRIGGER_SECONDS = LIVESTREAM_LIMIT_SECONDS - COUNTDOWN_SECONDS; // 14390 seconds (3h 59m 50s)

  // Main livestream timer (counts up from 0)
  const { duration, elapsedSeconds } = useLivestreamTimer({
    isActive: uiState === 'broadcast' && !isCoHost,
  });

  const { watchingCount } = useWatchingCount({ roomId: room?.roomId });

  const showWatchingCount = useMemo(() => {
    if (currentUserId === hostId) {
      return watchingCount > 0;
    } else return true;
  }, [currentUserId, hostId, watchingCount]);

  // Auto-trigger countdown when approaching limit
  useEffect(() => {
    if (
      uiState === 'broadcast' &&
      elapsedSeconds >= COUNTDOWN_TRIGGER_SECONDS &&
      !showCountdownOverlay &&
      setShowCountdownOverlay
    ) {
      setShowCountdownOverlay(true);
    }
  }, [
    elapsedSeconds,
    uiState,
    showCountdownOverlay,
    setShowCountdownOverlay,
    COUNTDOWN_TRIGGER_SECONDS,
  ]);

  return (
    <div className={styles.livestreamHeader__header}>
      {isCoHost && uiState === 'broadcast' ? (
        // if co-host is broadcasting show this div as a placeholder, the real button is inside the livestream stage
        <div className={styles.livestreamHeader__closeButton__icon} />
      ) : (
        <div className={styles.livestreamHeader__headerLeft}>
          <Button
            variant="text"
            className={styles.livestreamHeader__closeButton}
            onPress={onClose}
            aria-label="Close"
          >
            <CloseIcon className={styles.livestreamHeader__closeButton__icon} />
          </Button>
          {isTargetEvent && (
            <div className={styles.livestreamHeader__eventInfo}>
              <div className={styles.livestreamHeader__eventInfo__thumbnail}>
                <img
                  alt="Event thumbnail"
                  className={styles.livestreamHeader__eventInfo__thumbnailImage}
                  src={
                    event?.coverImage?.fileUrl
                      ? FileRepository.fileUrlWithSize(event?.coverImage?.fileUrl, 'medium')
                      : eventThumbnail
                  }
                />
              </div>
              <div>
                <Typography.BodyBold className={styles.livestreamHeader__text}>
                  {event?.title}
                </Typography.BodyBold>
                <div className={styles.livestreamHeader__headerLeft}>
                  <Typography.Body className={styles.livestreamHeader__text}>
                    {event?.creator?.displayName}
                  </Typography.Body>
                  {event?.creator?.isBrand && (
                    <BrandBadge className={styles.livestreamHeader__brandBadge} />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* right side */}
      {uiState === 'preview' && (
        <>
          {/* if target is not event, user can change the target */}
          {!isTargetEvent && (
            <>
              <Button
                className={styles.livestreamHeader__selectTarget__button}
                variant="text"
                onPress={onTargetSelection}
              >
                <Typography.Body className={styles.livestreamHeader__text}>Live on</Typography.Body>
                <Typography.BodyBold className={styles.livestreamHeader__text}>
                  {targetType === 'user' ? 'My Timeline' : community?.displayName}
                </Typography.BodyBold>
                <ChevronDown className={styles.livestreamHeader__selectTarget__icon} />
              </Button>
            </>
          )}
        </>
      )}
      {/* if uiState is co-host's backstage, show you're in the backstage in the center */}
      {uiState === 'backStage' && (
        <>
          <Typography.Body className={styles.livestreamHeader__text}>
            You’re in the backstage
          </Typography.Body>
          <div />
        </>
      )}
      {/* if uiState is broadcast, show live stream badge and/or watching count badge */}
      {uiState === 'broadcast' && (
        <div className={styles.livestreamHeader__headerRight__wrapper}>
          {showWatchingCount && <WatchingCountBadge count={watchingCount} />}
          {!isCoHost && <LiveStreamLiveBadge duration={duration} />}
          {targetType && setReadOnly && (
            <Popover
              placement="bottom end"
              trigger={({ openPopover }) => (
                <IconButton
                  variant="text"
                  pageId={pageId}
                  defaultIcon={
                    <Kebub className={styles.livestreamHeader__headerRight__optionIcon} />
                  }
                  onPress={() => openPopover()}
                />
              )}
            >
              {({ closePopover }) => (
                <LivestreamHeaderMenu
                  pageId={pageId}
                  targetType={targetType}
                  isCommunityPublic={community?.isPublic}
                  readOnly={readOnly}
                  onChangeReadOnly={(readOnly: boolean) => {
                    setReadOnly(readOnly);
                  }}
                  onLinkCopied={closePopover}
                />
              )}
            </Popover>
          )}
        </div>
      )}
    </div>
  );
};
