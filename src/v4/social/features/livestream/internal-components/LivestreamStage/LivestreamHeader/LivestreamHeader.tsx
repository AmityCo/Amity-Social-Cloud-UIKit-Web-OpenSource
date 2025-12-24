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
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar/CommunityAvatar';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import Lock from '~/v4/icons/Lock';
import { VerifyBadgeIcon } from '~/v4/icons/VerifyBadge';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { SharableModel } from '~/v4/utils/sharableLink';
import { CopyLinkButton } from '~/v4/social/elements/CopyLinkButton';
import { PAGE_ID } from '~/v4/constants/customization';

export interface LivestreamHeaderProps {
  pageId: string;
  isTargetEvent?: boolean;
  targetType?: 'user' | 'community';
  community?: Amity.Community | null;
  uiState: UseCreateLivestreamReturn['uiState'] | 'player';
  readOnly?: boolean;
  isCoHost?: boolean;
  setReadOnly?: (readOnly: boolean) => void;
  onClose: () => void;
  onTargetSelection?: () => void;
  onStreamEnd?: () => void;
  showCountdownOverlay?: boolean;
  setShowCountdownOverlay?: (show: boolean) => void;
  event?: Amity.Event;
  // Player-specific props
  isLive?: boolean;
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
  isLive = false,
}) => {
  // Constants for livestream limits
  const { room, hostId, livestreamPost, coHostId } = useLivestreamData();
  const { currentUserId } = useSDK();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { isDesktop } = useResponsive();

  const isPlayer = pageId === PAGE_ID.LIVESTREAM_PLAYER_PAGE;

  const LIVESTREAM_LIMIT_HOURS = 4;
  const COUNTDOWN_SECONDS = 10; // Last 10 seconds
  const LIVESTREAM_LIMIT_SECONDS = LIVESTREAM_LIMIT_HOURS * 60 * 60; // 4 hours = 14400 seconds
  const COUNTDOWN_TRIGGER_SECONDS = LIVESTREAM_LIMIT_SECONDS - COUNTDOWN_SECONDS; // 14390 seconds (3h 59m 50s)

  // Main livestream timer (counts up from 0)
  const { duration, elapsedSeconds } = useLivestreamTimer({
    isActive: uiState === 'broadcast' && !isCoHost,
  });

  const { watchingCount } = useWatchingCount({
    roomId: room?.roomId,
    role: uiState === 'broadcast' ? 'streamer' : 'viewer',
  });

  const showWatchingCount = useMemo(() => {
    if (isPlayer) return true; // Always show for viewers
    if (currentUserId === hostId) {
      return watchingCount > 0;
    } else return true;
  }, [currentUserId, hostId, watchingCount, isPlayer]);

  const showMenu = (community && community?.isPublic) || !community;

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
    <div
      className={styles.livestreamHeader__header}
      data-normal={!isLive && isPlayer && uiState !== 'backStage'}
    >
      {/* Player view with live details */}
      {isPlayer && isLive && uiState !== 'backStage' ? (
        <>
          <div className={styles.livestreamHeader__liveDetail__detail}>
            <Button
              variant="text"
              onPress={onClose}
              className={styles.livestreamHeader__closeButton}
            >
              <CloseIcon className={styles.livestreamHeader__closeButton__icon} />
            </Button>

            {community ? (
              <CommunityAvatar
                pageId={pageId}
                community={community}
                className={styles.livestreamHeader__liveDetail__avatar}
              />
            ) : (
              <UserAvatar
                userData={livestreamPost?.creator}
                className={styles.livestreamHeader__liveDetail__userAvatar}
                imageContainerClassName={styles.livestreamHeader__liveDetail__userAvatar}
                textPlaceholderClassName={styles.livestreamHeader__liveDetail__userAvatar}
              />
            )}

            <div className={styles.livestreamHeader__liveDetail__wrapper}>
              {community && (
                <>
                  <div className={styles.livestreamHeader__liveDetail__communityNameWrapper}>
                    {!community?.isPublic && (
                      <Lock className={styles.livestreamHeader__liveDetail__lockIcon} />
                    )}
                    <Typography.CaptionBold className={styles.livestreamHeader__liveDetail__text}>
                      {community?.displayName}
                    </Typography.CaptionBold>
                    {community.isOfficial && (
                      <VerifyBadgeIcon
                        className={styles.livestreamHeader__liveDetail__verifiedIcon}
                      />
                    )}
                  </div>
                </>
              )}
              <div className={styles.livestreamHeader__liveDetail__displayName}>
                {community ? (
                  <Typography.CaptionSmall className={styles.livestreamHeader__liveDetail__text}>
                    By {livestreamPost?.creator?.displayName}
                  </Typography.CaptionSmall>
                ) : (
                  <Typography.BodyBold className={styles.livestreamHeader__liveDetail__text}>
                    {livestreamPost?.creator?.displayName}
                  </Typography.BodyBold>
                )}
                {livestreamPost?.creator?.isBrand && <BrandBadge pageId={pageId} />}
              </div>
            </div>
          </div>
          <div className={styles.livestreamHeader__liveDetail__optionWrapper}>
            <WatchingCountBadge count={watchingCount} isWatcher={true} />
            {showMenu && (
              <Popover
                trigger={({ openPopover }) => (
                  <IconButton
                    variant="text"
                    pageId={pageId}
                    defaultIcon={
                      <Kebub className={styles.livestreamHeader__headerRight__optionIcon} />
                    }
                    onPress={() =>
                      isDesktop
                        ? openPopover()
                        : setDrawerData({
                            content: (
                              <CopyLinkButton
                                pageId={pageId}
                                model={SharableModel.POST}
                                referenceId={livestreamPost?.postId}
                                onDone={removeDrawerData}
                              />
                            ),
                          })
                    }
                  />
                )}
              >
                {({ closePopover }) => (
                  <CopyLinkButton
                    pageId={pageId}
                    model={SharableModel.POST}
                    referenceId={livestreamPost?.postId}
                    onDone={isDesktop ? closePopover : removeDrawerData}
                  />
                )}
              </Popover>
            )}
          </div>
        </>
      ) : isPlayer && !isLive ? (
        /* Player view when not live - simple close button */
        <div key="normal-header">
          <Button
            variant="text"
            onPress={onClose}
            className={styles.livestreamHeader__closeButton}
            data-normal={uiState !== 'backStage'}
          >
            <CloseIcon
              className={styles.livestreamHeader__closeButton__icon}
              data-normal={uiState !== 'backStage'}
            />
          </Button>
        </div>
      ) : (
        /* Creator view */
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

      {/* right side - only show for creator views */}
      {!isPlayer && uiState === 'preview' && (
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
      {isPlayer && uiState === 'backStage' && (
        <>
          <Typography.Body className={styles.livestreamHeader__text}>
            You’re in the backstage
          </Typography.Body>
          <div />
        </>
      )}
      {/* if uiState is broadcast, show live stream badge and/or watching count badge */}
      {!isPlayer && uiState === 'broadcast' && (
        <div className={styles.livestreamHeader__headerRight__wrapper}>
          {showWatchingCount && <WatchingCountBadge count={watchingCount} />}
          {!isCoHost && <LiveStreamLiveBadge duration={duration} />}
          {targetType && (
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
                  isCommunityPublic={(community && community?.isPublic) ?? false}
                  readOnly={readOnly}
                  onChangeReadOnly={(readOnly: boolean) => {
                    setReadOnly?.(readOnly);
                  }}
                  postId={livestreamPost?.postId}
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
