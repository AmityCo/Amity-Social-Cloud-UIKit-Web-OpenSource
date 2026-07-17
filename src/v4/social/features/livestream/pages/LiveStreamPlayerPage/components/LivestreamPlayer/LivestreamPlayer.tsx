import React, { forwardRef, useMemo, useState } from 'react';
import styles from './LivestreamPlayer.module.css';
import {
  LivestreamOverlay,
  LiveStreamTerminatedThumbnail,
  LiveStreamIdleThumbnail,
  LiveStreamEndThumbnail,
  LiveStreamBanThumbnail,
} from '~/v4/social/features/livestream/internal-components';
import { PlayIcon, PauseIcon } from '~/v4/icons';
import { ReactionFloating } from '~/v4/chat/internal-components/ReactionFloating/ReactionFloating';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { VideoPlayer } from '~/v4/social/internal-components/VideoPlayer/VideoPlayer';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { DisplayModeEnum } from '~/v4/social/types';
import { CopyLinkButton } from '~/v4/social/elements/CopyLinkButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { TagProductsButton } from '~/v4/social/features/livestream/internal-components/TagProductsButton/TagProductsButton';
import { AmitySharableContentType } from '@amityco/ts-sdk';

interface LivestreamPlayerProps {
  themeStyles?: React.CSSProperties;
  accessibilityId?: string;
  isLive: boolean;
  showWaitingApprovalBanner: boolean;
  isEnded: boolean;
  isTerminated: boolean;
  isUserBanned: boolean;
  isLoading: boolean;
  isPoorConnection: boolean;
  isRecorded?: boolean;
  pageId?: string;
  productTags: Amity.ProductTag[];
  onClickProductTagBadge: () => void;
  onClose?: () => void;
  canShowProductTags?: boolean;
  isPaused?: boolean;
  showControls?: boolean;
  onToggleControls?: () => void;
  onTogglePlayPause?: () => void;
}

export const LivestreamPlayer = forwardRef<HTMLVideoElement, LivestreamPlayerProps>(
  (
    {
      themeStyles,
      accessibilityId,
      isLive,
      showWaitingApprovalBanner,
      isEnded,
      isTerminated,
      isUserBanned,
      isLoading,
      isPoorConnection,
      isRecorded,
      pageId,
      productTags,
      onClickProductTagBadge,
      onClose,
      canShowProductTags = false,
      isPaused = false,
      showControls = false,
      onToggleControls,
      onTogglePlayPause,
    },
    ref,
  ) => {
    const { isDesktop } = useResponsive();
    const { room, livestreamPost } = useLivestreamData();
    const { setDrawerData, removeDrawerData } = useDrawer();
    const [isDragging, setIsDragging] = useState(false);
    const isHidden = isEnded || isTerminated || isUserBanned;
    const recordedVideoUrl = useMemo(() => {
      return room?.recordedPlaybackInfos?.[0]?.url;
    }, [room?.recordedPlaybackInfos]);

    const recordedThumbnailUrl = useMemo(() => {
      return room?.recordedPlaybackInfos?.[0]?.thumbnailUrl;
    }, [room?.recordedPlaybackInfos]);

    return (
      <>
        {isRecorded && recordedVideoUrl ? (
          <VideoPlayer
            displayMode={isDesktop ? DisplayModeEnum.DESKTOP : DisplayModeEnum.MOBILE}
            url={recordedVideoUrl}
            thumbnailUrl={recordedThumbnailUrl}
            useHls={!!recordedVideoUrl}
            autoPlay={true}
            pageId={pageId}
            productTags={productTags}
            postId={room?.post?.postId}
            className={styles.liveStreamPlayer__video}
            onClickProductTagBadge={onClickProductTagBadge}
            isDragging={isDragging}
            onDragging={(isDragging) => setIsDragging(isDragging)}
            onClose={() => {
              removeDrawerData();
              onClose?.();
            }}
            onClickMenu={() =>
              setDrawerData({
                content: (
                  <>
                    <CopyLinkButton
                      pageId={pageId}
                      model={AmitySharableContentType.POST}
                      referenceId={livestreamPost?.postId}
                      onDone={removeDrawerData}
                    />
                    {canShowProductTags && (
                      <TagProductsButton
                        productTagCount={livestreamPost?.productTags?.length || 0}
                        onPress={onClickProductTagBadge}
                      />
                    )}
                  </>
                ),
              })
            }
          />
        ) : (
          <>
            <video
              id={room?.roomId}
              playsInline={true}
              className={styles.liveStreamPlayer__video}
              data-is-live={isLive}
              data-is-hidden={isHidden}
              ref={ref}
            />
            {isLive && (
              <div
                className={styles.liveStreamPlayer__tapCatcher}
                onClick={isDesktop ? onTogglePlayPause : onToggleControls}
                role="presentation"
              />
            )}
            {isLive && showControls && (
              <button
                type="button"
                aria-label={isPaused ? 'Play' : 'Pause'}
                className={styles.liveStreamPlayer__playPauseButton}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePlayPause?.();
                }}
              >
                {isPaused ? (
                  <PlayIcon className={styles.liveStreamPlayer__playPauseIcon} />
                ) : (
                  <PauseIcon className={styles.liveStreamPlayer__playPauseIcon} fill="white" />
                )}
              </button>
            )}
            {isLive && isPaused && !isDesktop && (
              <div
                className={styles.liveStreamPlayer__pauseIndicator}
                role="status"
                aria-label="Paused"
              >
                <PauseIcon className={styles.liveStreamPlayer__pauseIndicatorIcon} />
                <span className={styles.liveStreamPlayer__pauseIndicatorLabel}>Paused</span>
              </div>
            )}
          </>
        )}
        {showWaitingApprovalBanner && <LivestreamOverlay.WaitForApproval view="moderator" />}
        {isLoading && !isPoorConnection && isLive && !isEnded && !isUserBanned && (
          <LivestreamOverlay />
        )}
        {isLoading && isPoorConnection && isLive && <LivestreamOverlay.Reconnecting />}
        {isDesktop && isTerminated && <LiveStreamTerminatedThumbnail view="full-screen" />}
        {room?.status === liveStreamStatus.idle && <LiveStreamIdleThumbnail view="full-screen" />}
        {isUserBanned && <LiveStreamBanThumbnail />}
        {isEnded && !isTerminated && <LiveStreamEndThumbnail view="full-screen" />}
        {isLive && isDesktop && room?.post && <ReactionFloating post={room?.post as Amity.Post} />}
      </>
    );
  },
);
