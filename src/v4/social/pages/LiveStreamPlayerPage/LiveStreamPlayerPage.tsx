import ReactDOM from 'react-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import { Avatar, Typography } from '~/v4/core/components';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import useStream from '~/v4/social/hooks/useStream';
import usePost from '~/v4/core/hooks/objects/usePost';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import {
  getLiveStreamTopic,
  getPostTopic,
  LiveStreamPlayer,
  subscribeTopic,
} from '@amityco/ts-sdk';
import { LiveStreamLiveBadge } from '~/v4/social/internal-components/LiveStreamLiveBadge';
import { LiveStreamEndThumbnail } from '~/v4/social/internal-components/LiveStreamEndThumbnail/';
import { LiveStreamIdleThumbnail } from '~/v4/social/internal-components/LiveStreamIdleThumbnail';
import { LiveStreamTerminatedThumbnail } from '~/v4/social/internal-components/LiveStreamTerminatedThumbnail';
import 'plyr/dist/plyr.css';
import styles from './LiveStreamPlayer.module.css';
import { LivestreamChatMessageComposer } from '~/v4/chat/components/LivechatMessageComposer';
import { useCommunity } from '~/v4/chat/hooks/useCommunity';
import { Button } from '~/v4/core/components/AriaButton/Button';
import CloseIcon from '~/v4/icons/Close';
import { UserAvatar } from '~/v4/social/elements';
import ChatFeed from '~/v4/chat/internal-components/ChatFeed/ChatFeed';
import { ReactionFloating } from '~/v4/chat/internal-components/ReactionFloating/ReactionFloating';
import { LiveStreamBanThumbnail } from '~/v4/social/internal-components/LiveStreamBanThumbnail';

export type LiveStreamPlayerPageProps = {
  post: Amity.Post;
  goToDetailPage?: () => void;
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

const useLiveStreamPlayer = ({ stream }: { post?: Amity.Post; stream: Amity.Stream }) => {
  const [muted, setMuted] = useState(true);
  const [streamId, setStreamId] = useState<string | undefined>();

  const [isLoading, setIsLoading] = useState(false);
  const [isPoorConnection, setIsPoorConnection] = useState(false);
  const [playerInitialized, setPlayerInitialized] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const loadingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const liveStreamPlayerRef = useRef<HTMLDivElement>(null);
  const plyrRef = useRef<Plyr | null>(null);

  const getLiveStreamPlayer = async (streamId: string) => {
    const player = await LiveStreamPlayer.getPlayer({ streamId });
    player.muted = muted;
    player.autoplay = true;
    player.playsInline = true;
    player.setAttribute('playsinline', ''); // prevent fullscreen on iOS
    player.setAttribute('webkit-playsinline', '');

    if (stream?.status === 'live') player.controls = false;

    player.onvolumechange = () => setMuted(!player.muted);

    player.classList.add(styles.liveStreamPlayer__video);
    player.setAttribute('data-is-live', 'true');
    // if (stream?.status === 'live') player.setAttribute('data-is-live', 'true');

    player.addEventListener('loadedmetadata', () => {
      detectOrientation(player);
    });

    player.addEventListener('loadeddata', () => {
      detectOrientation(player);
    });

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

    window.addEventListener('online', reloadPlayer);

    videoRef.current
      ? liveStreamPlayerRef.current?.replaceChild(player, videoRef.current)
      : liveStreamPlayerRef.current?.appendChild(player);

    videoRef.current = player;

    if (stream?.status === 'live' && player) {
      plyrRef.current = new Plyr(player, {
        controls: ['pause', 'play'],
        fullscreen: { enabled: false },
        clickToPlay: true,
      });
    }

    setPlayerInitialized(true);
  };

  const reloadPlayer = useCallback(() => {
    if (videoRef.current) videoRef.current.remove();

    videoRef.current = null;
    setIsLoading(true);
    setIsPoorConnection(false);
    setPlayerInitialized(false);

    if (stream?.streamId) getLiveStreamPlayer(stream.streamId);
  }, [stream?.streamId, videoRef.current]);

  const detectOrientation = (player: HTMLVideoElement) => {
    const orientation = player.videoHeight > player.videoWidth ? 'portrait' : 'landscape';
    player.setAttribute('data-orientation', orientation);
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

  const resetLiveStreamPlayerRef = () => setStreamId(undefined);

  useEffect(() => {
    if (stream?.streamId) setStreamId(stream.streamId);
  }, [stream?.streamId]);

  useEffect(() => {
    if (streamId) {
      getLiveStreamPlayer(streamId);
    } else videoRef?.current?.remove();

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadedmetadata', () =>
          detectOrientation(videoRef.current!),
        );
        videoRef.current.removeEventListener('loadeddata', () =>
          detectOrientation(videoRef.current!),
        );
        videoRef.current.removeEventListener('loadstart', handleLoadStart);
        videoRef.current.removeEventListener('waiting', handleWaiting);
        videoRef.current.removeEventListener('playing', handlePlaying);
        videoRef.current.removeEventListener('canplay', handleCanPlay);
        videoRef.current.removeEventListener('canplaythrough', handleCanPlay);
        videoRef.current.removeEventListener('progress', handleCanPlay);
        window.removeEventListener('online', reloadPlayer);
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
    streamId: streamId,
    plyrContainer: plyrRef.current?.elements.container,
    resetLiveStreamPlayerRef,
  };
};

const useLivechat = (stream: Amity.Stream) => {
  const [channel, setChannel] = useState<Amity.Channel<'live'> | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && stream.status === 'live' && !channel) {
      setIsLoading(true);
      stream.getLiveChat().then((channel: Amity.Channel<'live'> | undefined) => {
        setChannel(channel);
      });
    }
  }, [stream, channel, isLoading]);
  return {
    channel,
    isLoading,
  };
};

export function LiveStreamPlayerPage({ post, goToDetailPage }: LiveStreamPlayerPageProps) {
  const pageId = 'livestream_player_page';
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const stream = post.childrenPosts[0]?.getLivestreamInfo() as Amity.Stream;
  const [chatContainerHeight, setChatContainerHeight] = useState<number>();
  const { isDesktop } = useResponsive();
  const { post: subscribedPost } = usePostSubscription(post.postId);
  const { community } = useCommunity({
    communityId: post.targetId,
  });

  const { setStreamPlayer } = useLayoutContext();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { goToLiveStreamTerminatedPage, goToLiveStreamBannedPage } = useNavigation();
  const {
    isLoading,
    isPoorConnection,
    liveStreamPlayerRef,
    playerInitialized,
    streamId,
    plyrContainer,
    resetLiveStreamPlayerRef,
  } = useLiveStreamPlayer({ stream });

  const { channel, isLoading: isChannelLoading } = useLivechat(stream);

  const onClose = useCallback(() => setStreamPlayer(null), []);

  const isUserBanned = stream.isBanned;

  useEffect(() => {
    let unsubscribe: () => void;

    if (stream.status === 'live' && stream.streamId) {
      subscribeTopic(getLiveStreamTopic() + `/${stream.streamId}`);
    }

    return () => unsubscribe?.();
  }, [stream.status, stream.streamId]);

  useEffect(() => {
    if (!playerInitialized) return;

    const isTerminated =
      stream?.moderation?.terminateLabels && stream?.moderation?.terminateLabels?.length > 0;
    const isLiveOrEnded =
      stream?.status === liveStreamStatus.live || stream?.status === liveStreamStatus.ended;

    if (!isDesktop && isLiveOrEnded && isTerminated) {
      onClose();
      goToLiveStreamTerminatedPage?.();
    }
  }, [playerInitialized, stream?.moderation?.terminateLabels, stream?.status, isDesktop]);

  useEffect(() => {
    if (!isDesktop && isUserBanned) goToLiveStreamBannedPage?.();

    if (isDesktop && isUserBanned) resetLiveStreamPlayerRef();
  }, [isDesktop, isUserBanned]);

  useEffect(() => {
    if (!playerInitialized) return;

    if (stream?.isDeleted || subscribedPost?.isDeleted) {
      onClose();
      goToDetailPage?.();
    }
  }, [playerInitialized, stream?.isDeleted, subscribedPost?.isDeleted]);

  useEffect(() => {
    if (!chatContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          setChatContainerHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(chatContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [chatContainerRef.current]);

  useEffect(() => {
    if (!chatContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          console.log('entry', entry.contentRect.height);
          setChatContainerHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(chatContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [chatContainerRef.current]);

  useEffect(() => {
    if (!chatContainerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect) {
          console.log('entry', entry.contentRect.height);
          setChatContainerHeight(entry.contentRect.height);
        }
      }
    });

    observer.observe(chatContainerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [chatContainerRef.current]);

  const isLive = stream?.status === liveStreamStatus.live;
  const isEnded = stream?.status === liveStreamStatus.ended && !stream?.moderation?.terminateLabels;



  return (
    <ModalOverlay
      isOpen={(!!streamId && !isUserBanned) || isDesktop}
      className={styles.liveStreamPlayer__overlay}
      onOpenChange={(open) => !open && onClose()}
      data-is-live={isLive}
    >
      <Modal
        className={styles.livestreamPlayer__modal}
        data-is-live={isLive}
        data-is-ended={isEnded}
      >
        <Dialog className={styles.liveStreamPlayer__dialog} data-is-live={isLive}>
          {isLive || isEnded ? (
            <div className={styles.liveStreamPlayer__liveDetail}>
              <Button
                variant="text"
                onPress={onClose}
                className={styles.liveStreamPlayer__closeButton}
                data-is-live={isLive}
              >
                <CloseIcon
                  className={styles.liveStreamPlayer__closeButton__icon}
                  data-is-live={isLive}
                  data-is-ended={isEnded}
                />
              </Button>
              {!isEnded && !isUserBanned && (
                <div className={styles.liveStreamPlayer__liveDetail__detail}>
                  <UserAvatar
                    userId={post.creator?.userId}
                    shouldRedirectToUserProfile={false}
                    pageId={pageId}
                    imageContainerClassName={styles.liveStreamPlayer__liveDetail__avatar}
                  />
                  <div>
                    <Typography.CaptionBold className={styles.livestreamPlayer__liveDetail__text}>
                      {stream?.title}
                    </Typography.CaptionBold>
                    <Typography.CaptionSmall className={styles.livestreamPlayer__liveDetail__text}>
                      By {post.creator?.displayName}
                    </Typography.CaptionSmall>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <ClearButton
              onPress={() => onClose()}
              buttonClassName={styles.liveStreamPlayer__closeButton}
              defaultClassName={styles.liveStreamPlayer__closeButton__icon}
            />
          )}

          <div
            style={themeStyles}
            ref={liveStreamPlayerRef}
            data-testid={accessibilityId}
            className={styles.liveStreamPlayer}
            data-is-live={isLive}
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
            {isLive && <LiveStreamLiveBadge />}
            {stream?.status === liveStreamStatus.idle && (
              <LiveStreamIdleThumbnail view="full-screen" />
            )}
            {isEnded && <LiveStreamEndThumbnail view="full-screen" />}
            {isLive && isDesktop && stream?.post && (
              <ReactionFloating post={stream.post as Amity.Post} />
            )}
            {isUserBanned && (
              <>
                <ClearButton
                  onPress={() => onClose()}
                  buttonClassName={styles.liveStreamPlayer__closeButton}
                  defaultClassName={styles.liveStreamPlayer__closeButton__icon}
                />
                <LiveStreamBanThumbnail view="full-screen" />
              </>
            )}
          </div>
        </Dialog>

        {isLive && channel && (
          <>
            {isDesktop ? (
              <div className={styles.livestreamChat__container}>
                <div className={styles.livestreamChat__container__inner}>
                  <ChatFeed channel={channel} />
                  <LivestreamChatMessageComposer
                    pageId={pageId}
                    channelId={channel.channelId}
                    disabled={stream?.status === liveStreamStatus.ended || isPoorConnection}
                    isJoined={!!community?.isJoined}
                  />
                </div>
              </div>
            ) : (
              <>
                {plyrContainer &&
                  ReactDOM.createPortal(
                    <>
                      <div className={styles.livestreamChat__overlay__top} />
                      <div className={styles.livestreamChat__overlay__bottom} />
                      <div
                        className={styles.livestreamChat__reactionLane__ref}
                        style={{ bottom: chatContainerHeight }}
                      >
                        {channel.attachedTo?.videoStreamId && (
                          <ReactionFloating post={stream.post as Amity.Post} />
                        )}
                      </div>
                      <div
                        className={styles.livestreamChat__container__inner}
                        ref={chatContainerRef}
                      >
                        <ChatFeed channel={channel} />
                        <LivestreamChatMessageComposer
                          pageId={pageId}
                          channelId={channel.channelId}
                          disabled={stream?.status === liveStreamStatus.ended || isPoorConnection}
                          isJoined={!!community?.isJoined}
                        />
                      </div>
                    </>,
                    plyrContainer,
                  )}
              </>
            )}
          </>
        )}
      </Modal>
    </ModalOverlay>
  );
}
