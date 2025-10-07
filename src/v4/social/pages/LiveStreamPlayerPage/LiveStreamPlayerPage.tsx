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
  getCommunityTopic,
  getLiveStreamTopic,
  getPostTopic,
  LiveStreamPlayer,
  subscribeTopic,
  SubscriptionLevels,
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
import ChatFeed from '~/v4/chat/internal-components/ChatFeed/ChatFeed';
import { ReactionFloating } from '~/v4/chat/internal-components/ReactionFloating/ReactionFloating';
import { LiveStreamBanThumbnail } from '~/v4/social/internal-components/LiveStreamBanThumbnail';
import { CopyLinkButton } from '~/v4/social/elements/CopyLinkButton';
import { IconButton } from '~/v4/core/components/IconButton';
import Kebub from '~/v4/icons/Kebub';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { SharableModel } from '~/v4/utils/sharableLink';
import { GoToPostDetailPageParams } from '~/v4/social/pages/PostDetailPage/PostDetailPage';
import { useKeyboardVisibility } from './useKeyboardVisibility';
import { CommunityAvatar } from '~/v4/social/elements/CommunityAvatar';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { useTheme } from '~/v4/core/providers/ThemeProvider';

export type LiveStreamPlayerPageProps = {
  post: Amity.Post;
  goToDetailPage?: (context?: GoToPostDetailPageParams) => void;
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

const useLiveStreamPlayer = ({ stream }: { post?: Amity.Post; stream?: Amity.Stream | null }) => {
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

  const resetLiveStreamPlayerRef = () => {
    if (streamId) document.getElementById(streamId)?.remove();
  };

  useEffect(() => {
    if (stream?.streamId) setStreamId(stream.streamId);
  }, [stream?.streamId]);

  useEffect(() => {
    if (streamId) {
      getLiveStreamPlayer(streamId);
    } else {
      videoRef?.current?.remove();
    }

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

const useLivechat = ({
  stream,
  targetType,
}: {
  stream?: Amity.Stream | null;
  targetType: Amity.PostTargetType;
}) => {
  const [channel, setChannel] = useState<Amity.Channel<'live'> | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!isLoading && stream?.status === 'live' && !channel && targetType !== 'user') {
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
  const stream = useStream(post.childrenPosts[0]?.getLivestreamInfo()?.streamId);
  const { toggleTheme, setDefaultTheme } = useTheme();
  const { currentUserId } = useSDK();
  const { keyboardOffset } = useKeyboardVisibility();
  const [chatContainerHeight, setChatContainerHeight] = useState<number>();
  const [hideChatFeed, setHideChatFeed] = useState(false);
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

  const { setDrawerData, removeDrawerData } = useDrawer();
  const { channel, isLoading: isChannelLoading } = useLivechat({
    stream,
    targetType: post.targetType,
  });

  const { members } = useCommunityMembersCollection({
    queryParams: {
      communityId: community?.communityId as string,
    },
  });

  const myMembership = members.find((member) => member.userId === currentUserId);

  const onClose = useCallback(() => setStreamPlayer(null), []);

  const isUserBanned = stream?.isBanned || (myMembership && myMembership.isBanned);

  useEffect(() => {
    toggleTheme('dark'); // livestream will be in dark mode only

    return () => {
      setDefaultTheme();
    };
  }, []);

  useEffect(() => {
    if (keyboardOffset) setHideChatFeed(true);
    else setHideChatFeed(false);
  }, [keyboardOffset]);

  useEffect(() => {
    const unsubscribers: (() => void)[] = [];

    if (stream?.status === 'live' && stream?.streamId) {
      unsubscribers.push(subscribeTopic(getLiveStreamTopic() + `/${stream.streamId}`));
    }

    if (community?.communityId) {
      unsubscribers.push(
        subscribeTopic(getCommunityTopic(community, SubscriptionLevels.COMMUNITY)),
      );
    }

    return () => {
      unsubscribers.forEach((fn) => fn());
    };
  }, [stream?.status, stream?.streamId, community?.communityId]);

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

  const isLive = stream?.status === liveStreamStatus.live;
  const isEnded = stream?.status === liveStreamStatus.ended && !stream?.moderation?.terminateLabels;

  return (
    <ModalOverlay
      isOpen={(!!streamId && !isUserBanned) || isDesktop}
      className={styles.liveStreamPlayer__overlay}
      onOpenChange={(open) => !open && onClose()}
      data-is-live={isLive}
      style={{
        // ✅ Move the entire modal up when keyboard is open
        transform:
          keyboardOffset > 0 && !isDesktop ? `translateY(-${keyboardOffset * 0.5}px)` : 'none',
        transition: 'transform 0.3s ease-in-out',
      }}
    >
      <Modal
        className={styles.livestreamPlayer__modal}
        data-is-live={isLive}
        data-is-ended={isEnded}
      >
        <Dialog className={styles.liveStreamPlayer__dialog} data-is-live={isLive}>
          {isUserBanned ? (
            <>
              <ClearButton
                onPress={() => onClose()}
                buttonClassName={styles.liveStreamPlayer__closeButton}
                defaultClassName={styles.liveStreamPlayer__closeButton__icon}
              />
              <LiveStreamBanThumbnail view="full-screen" />
            </>
          ) : (
            <>
              {isLive || isEnded ? (
                <div className={styles.liveStreamPlayer__liveDetail}>
                  {!isEnded && !isUserBanned && (
                    <div className={styles.liveStreamPlayer__liveDetail__detail}>
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
                      <CommunityAvatar
                        pageId={pageId}
                        community={community}
                        className={styles.liveStreamPlayer__liveDetail__avatar}
                      />

                      <div>
                        <Typography.CaptionBold
                          className={styles.livestreamPlayer__liveDetail__text}
                        >
                          {community?.displayName}
                        </Typography.CaptionBold>
                        <Typography.CaptionSmall
                          className={styles.livestreamPlayer__liveDetail__text}
                        >
                          By {post.creator?.displayName}
                        </Typography.CaptionSmall>
                      </div>
                    </div>
                  )}
                  {!isEnded && !isUserBanned && (
                    <div className={styles.liveStreamPlayer__liveDetail__optionWrapper}>
                      <LiveStreamLiveBadge />
                      {community?.isPublic && (
                        <Popover
                          trigger={({ openPopover }) => (
                            <IconButton
                              variant="text"
                              pageId={pageId}
                              defaultIcon={
                                <Kebub className={styles.liveStreamPlayer__optionIcon} />
                              }
                              onPress={() =>
                                isDesktop
                                  ? openPopover()
                                  : setDrawerData({
                                      content: (
                                        <CopyLinkButton
                                          pageId={pageId}
                                          model={SharableModel.POST}
                                          referenceId={post.postId}
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
                              referenceId={post.postId}
                              onDone={isDesktop ? closePopover : removeDrawerData}
                            />
                          )}
                        </Popover>
                      )}
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
                {isLive && isDesktop && post.feedType === 'reviewing' && (
                  <div className={styles.liveStreamPlayer__pendingPost__banner}>
                    <div className={styles.livestreamChat__overlay__top} />
                    <div className={styles.livestreamChat__overlay__bottom}>
                      <div className={styles.livestreamChat__pendingPost__text}>
                        <Typography.Body>
                          This live stream has started, but with limited visibility until the post
                          has been approved.
                        </Typography.Body>
                      </div>
                    </div>
                  </div>
                )}
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
                  stream?.moderation?.terminateLabels?.length > 0 && (
                    <LiveStreamTerminatedThumbnail />
                  )}

                {stream?.status === liveStreamStatus.idle && (
                  <LiveStreamIdleThumbnail view="full-screen" />
                )}
                {isEnded && <LiveStreamEndThumbnail view="full-screen" />}
                {isLive && isDesktop && stream?.post && (
                  <ReactionFloating post={stream.post as Amity.Post} />
                )}
              </div>
            </>
          )}
        </Dialog>

        {isLive && channel && post.targetType !== 'user' && (
          <>
            {isDesktop ? (
              <div className={styles.livestreamChat__container}>
                <div className={styles.livestreamChat__container__inner}>
                  <ChatFeed
                    channel={channel}
                    stream={stream}
                    isJoinedCommunity={!!community?.isJoined}
                  />
                  <LivestreamChatMessageComposer
                    pageId={pageId}
                    channelId={channel.channelId}
                    disabled={stream?.status === liveStreamStatus.ended || isPoorConnection}
                    isJoined={!!community?.isJoined}
                    isPendingPost={post.feedType === 'reviewing'}
                  />
                </div>
              </div>
            ) : (
              <>
                {post.targetType !== 'user' &&
                  plyrContainer &&
                  ReactDOM.createPortal(
                    <>
                      {!hideChatFeed && (
                        <>
                          <div className={styles.livestreamChat__overlay__top} />
                          <div className={styles.livestreamChat__overlay__bottom} />
                          <div
                            className={styles.livestreamChat__reactionLane__ref}
                            style={{ bottom: chatContainerHeight }}
                          >
                            {channel.attachedTo?.videoStreamId && (
                              <ReactionFloating post={stream?.post as Amity.Post} />
                            )}
                          </div>
                          <div
                            className={styles.livestreamChat__container__inner}
                            ref={chatContainerRef}
                          >
                            <ChatFeed
                              channel={channel}
                              stream={stream}
                              isJoinedCommunity={!!community?.isJoined}
                            />
                          </div>
                        </>
                      )}
                    </>,
                    plyrContainer,
                  )}
                <LivestreamChatMessageComposer
                  pageId={pageId}
                  channelId={channel.channelId}
                  disabled={stream?.status === liveStreamStatus.ended || isPoorConnection}
                  isJoined={!!community?.isJoined}
                  isPendingPost={post.feedType === 'reviewing'}
                />
              </>
            )}
          </>
        )}
      </Modal>
    </ModalOverlay>
  );
}
