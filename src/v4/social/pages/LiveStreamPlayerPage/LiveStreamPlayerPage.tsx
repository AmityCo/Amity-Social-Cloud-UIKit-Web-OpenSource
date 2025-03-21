import React, { useCallback, useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import { Typography } from '~/v4/core/components';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import useStream from '~/v4/social/hooks/useStream';
import usePost from '~/v4/core/hooks/objects/usePost';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { getPostTopic, LiveStreamPlayer, subscribeTopic } from '@amityco/ts-sdk';
import { LiveStreamLiveBadge } from '~/v4/social/internal-components/LiveStreamLiveBadge';
import { LiveStreamEndThumbnail } from '~/v4/social/internal-components/LiveStreamEndThumbnail/';
import { LiveStreamIdleThumbnail } from '~/v4/social/internal-components/LiveStreamIdleThumbnail';
import { LiveStreamTerminatedThumbnail } from '~/v4/social/internal-components/LiveStreamTerminatedThumbnail';
import 'plyr/dist/plyr.css';
import styles from './LiveStreamPlayer.module.css';

export type LiveStreamPlayerPageProps = {
  postId: string;
  streamId?: string;
  goToPostDetail?: () => void;
  streamStatus?: Amity.Stream['status'];
};

const usePostSubscription = (postId: string) => {
  const { post } = usePost(postId);

  useEffect(() => {
    if (post) {
      const unsubscribe = subscribeTopic(getPostTopic(post));
      return () => unsubscribe();
    }
  }, [post]);

  return { post };
};

const useLiveStreamPlayer = ({
  streamId,
  streamStatus,
}: {
  streamId?: string;
  streamStatus?: Amity.Stream['status'];
}) => {
  const [muted, setMuted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const liveStreamPlayerRef = useRef<HTMLDivElement>(null);
  const [isPoorConnection, setIsPoorConnection] = useState(false);
  const [video, setVideo] = useState<HTMLVideoElement | null>(null);
  const [playerInitialized, setPlayerInitialized] = useState(false);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const plyrRef = useRef<Plyr | null>(null);

  const getLiveStreamPlayer = async (streamId: string) => {
    const player = await LiveStreamPlayer.getPlayer({ streamId });
    player.muted = muted;
    player.autoplay = true;
    player.playsInline = true;
    player.setAttribute('playsinline', ''); // prevent fullscreen on iOS
    player.setAttribute('webkit-playsinline', '');

    if (streamStatus === 'live') player.controls = false;

    player.onvolumechange = () => setMuted(!player.muted);
    player.classList.add(styles.liveStreamPlayer__video);

    const detectOrientation = () => {
      const orientation = player.videoHeight > player.videoWidth ? 'portrait' : 'landscape';
      player.setAttribute('data-orientation', orientation);
    };

    player.addEventListener('loadedmetadata', detectOrientation);

    player.addEventListener('loadeddata', detectOrientation);

    player.addEventListener('loadstart', () => {
      handleLoadStart();
    });
    player.addEventListener('waiting', () => {
      handleWaiting();
    });
    player.addEventListener('playing', () => {
      handlePlaying();
    });
    player.addEventListener('canplay', () => {
      handleCanPlay();
    });

    video
      ? liveStreamPlayerRef.current?.replaceChild(player, video)
      : liveStreamPlayerRef.current?.appendChild(player);
    setVideo(player);

    if (streamStatus === 'live' && player) {
      plyrRef.current = new Plyr(player, {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'settings', 'pip'],
        fullscreen: { enabled: false },
      });
    }

    setPlayerInitialized(true);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleWaiting = () => {
    setIsLoading(true);
    setIsPoorConnection(true);
  };

  const handlePlaying = () => {
    clearTimeout(loadingTimerRef.current!);
    setIsLoading(false);
    setIsPoorConnection(false);
  };

  const handleCanPlay = () => {
    clearTimeout(loadingTimerRef.current!);
    setIsLoading(false);
    setIsPoorConnection(false);
  };

  useEffect(() => {
    if (streamId) getLiveStreamPlayer(streamId);

    return () => {
      if (video) {
        video.removeEventListener('loadstart', handleLoadStart);
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('canplay', handleCanPlay);
      }
      if (loadingTimerRef.current) {
        clearTimeout(loadingTimerRef.current);
      }
      if (plyrRef.current) {
        plyrRef.current.destroy();
      }
    };
  }, [streamId]);

  return {
    isLoading,
    isPoorConnection,
    playerInitialized,
    liveStreamPlayerRef,
  };
};

export function LiveStreamPlayerPage({
  postId,
  streamId,
  streamStatus,
  goToPostDetail,
}: LiveStreamPlayerPageProps) {
  const pageId = 'livestream_player_page';

  const { isDesktop } = useResponsive();
  const { post } = usePostSubscription(postId);
  const { setStreamPlayer } = useLayoutContext();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { goToLiveStreamTerminatedPage } = useNavigation();
  const { isLoading, isPoorConnection, liveStreamPlayerRef, playerInitialized } =
    useLiveStreamPlayer({ streamId, streamStatus });

  const onClose = useCallback(() => setStreamPlayer(null), []);

  const stream = useStream(playerInitialized ? streamId : undefined);

  useEffect(() => {
    const isTerminated =
      stream?.moderation?.terminateLabels && stream?.moderation?.terminateLabels?.length > 0;
    const isLiveOrEnded =
      stream?.status === liveStreamStatus.live || stream?.status === liveStreamStatus.ended;

    if (!isDesktop && isLiveOrEnded && isTerminated) {
      onClose();
      goToLiveStreamTerminatedPage?.();
    }
  }, [stream?.moderation?.terminateLabels, stream?.status, isDesktop]);

  useEffect(() => {
    if (stream?.isDeleted || post?.isDeleted) {
      onClose();
      goToPostDetail?.();
    }
  }, [stream?.isDeleted, post?.isDeleted]);

  return (
    <ModalOverlay
      isOpen={!!streamId}
      className={styles.liveStreamPlayer__overlay}
      onOpenChange={(open) => !open && onClose()}
    >
      <Modal>
        <Dialog className={styles.liveStreamPlayer__dialog}>
          <ClearButton
            onPress={() => onClose()}
            buttonClassName={styles.liveStreamPlayer__closeButton}
            defaultClassName={styles.liveStreamPlayer__closeButton__icon}
          />
          <div
            style={themeStyles}
            ref={liveStreamPlayerRef}
            data-testid={accessibilityId}
            className={styles.liveStreamPlayer}
          >
            {isLoading && (
              <div className={styles.liveStreamPlayer__loading}>
                <div className={styles.liveStreamPlayer__slowConnection}>
                  <div className={styles.liveStreamPlayer__loadingSpinner} />
                  {isPoorConnection && (
                    <>
                      <Typography.TitleBold>Reconnecting</Typography.TitleBold>
                      <Typography.Caption>
                        Due to poor connection, this live stream has been <br /> paused. It will
                        resume automatically <br />
                        once the connection is stable.
                      </Typography.Caption>
                    </>
                  )}
                </div>
              </div>
            )}
            {isDesktop &&
              (stream?.status === liveStreamStatus.live ||
                stream?.status === liveStreamStatus.ended) &&
              stream?.moderation?.terminateLabels &&
              stream?.moderation?.terminateLabels?.length > 0 && <LiveStreamTerminatedThumbnail />}
            {stream?.status === liveStreamStatus.live && <LiveStreamLiveBadge />}
            {stream?.status === liveStreamStatus.idle && (
              <LiveStreamIdleThumbnail view="full-screen" />
            )}
            {stream?.status === liveStreamStatus.ended && !stream?.moderation?.terminateLabels && (
              <LiveStreamEndThumbnail view="full-screen" />
            )}
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}
