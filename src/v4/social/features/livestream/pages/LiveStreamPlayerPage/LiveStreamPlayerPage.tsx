import ReactDOM from 'react-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import {
  getCommunityTopic,
  subscribeTopic,
  SubscriptionLevels,
  InvitationStatusEnum,
} from '@amityco/ts-sdk';
import 'plyr/dist/plyr.css';
import styles from './LiveStreamPlayer.module.css';
import { LivestreamChatMessageComposer } from '~/v4/social/features/livestream/components/LivestreamChatMessageComposer';
import { useCommunity } from '~/v4/chat/hooks/useCommunity';
import ChatFeed from '~/v4/chat/internal-components/ChatFeed/ChatFeed';
import { ReactionFloating } from '~/v4/chat/internal-components/ReactionFloating/ReactionFloating';
import { GoToPostDetailPageParams } from '~/v4/social/pages/PostDetailPage/PostDetailPage';
import { useKeyboardVisibility } from './useKeyboardVisibility';
import useCommunityMembersCollection from '~/v4/social/hooks/collections/useCommunityMembersCollection';
import useSDK from '~/v4/core/hooks/useSDK';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { InviteSheet } from '~/v4/social/features/livestream/pages/LiveStreamPlayerPage/components/InviteSheet';
import { LivestreamPlayer } from '~/v4/social/features/livestream/pages/LiveStreamPlayerPage/components/LivestreamPlayer';
import { LivestreamHeader } from '~/v4/social/features/livestream/internal-components/LivestreamStage/LivestreamHeader';
import {
  usePostSubscription,
  useLivechat,
  useLiveStreamPlayer,
  useGetBroadcasterData,
  useSyncWatchingHeartbeat,
} from '~/v4/social/features/livestream/hooks';
import { LivestreamChat } from '~/v4/social/features/livestream/internal-components/LivestreamChat';
import { LivestreamSetup } from '~/v4/social/features/livestream/internal-components/LivestreamSetup';
import { useDeviceManagement } from '~/v4/core/hooks/useDeviceManagement';
import { LivestreamStage } from '~/v4/social/features/livestream/internal-components/LivestreamStage';
import { useRoom } from '~/v4/social/features/livestream/hooks';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useObserveRoomAndInvitation } from '~/v4/social/features/livestream/hooks/useObserveRoomAndInvitation';
import { LivestreamDataProvider } from '~/v4/social/features/livestream/providers';
import { useForceDarkTheme } from '~/v4/core/hooks/useForceDarkTheme';
import { PAGE_ID } from '~/v4/constants/customization';

export type LiveStreamPlayerPageProps = {
  post?: Amity.Post;
  goToDetailPage?: (context?: GoToPostDetailPageParams) => void;
  roomId?: string;
};

export function LiveStreamPlayerPage({ post, roomId, goToDetailPage }: LiveStreamPlayerPageProps) {
  const pageId = PAGE_ID.LIVESTREAM_PLAYER_PAGE;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [livestreamPost, setLivestreamPost] = useState(post);

  const { post: subscribedPost } = usePostSubscription(livestreamPost?.postId);
  const { room } = useRoom(subscribedPost?.childrenPosts?.[0]?.getRoomInfo()?.roomId ?? roomId);

  useEffect(() => {
    if (room?.roomId && livestreamPost?.postId) return;
    if (room?.roomId && room.post) setLivestreamPost(room.post as Amity.Post);
  }, [room]);

  const { success, info } = useNotifications();

  const [chatContainerHeight, setChatContainerHeight] = useState<number>();
  const [hideChatFeed, setHideChatFeed] = useState(false);
  const [uiState, setUiState] = useState<'player' | 'backStage' | 'broadcast'>('player');

  const { currentUserId } = useSDK();
  const { keyboardOffset } = useKeyboardVisibility();
  const { isDesktop } = useResponsive();

  const { community } = useCommunity({
    communityId: livestreamPost?.targetId,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  // Use the hook at page level to manage video state
  const {
    isLoading,
    isPoorConnection,
    playerInitialized,
    plyrContainer,
    resetLiveStreamPlayerRef,
    reloadPlayer,
  } = useLiveStreamPlayer({ videoRef, room });

  const deviceManagement = useDeviceManagement();

  useForceDarkTheme();

  // Get broadcaster data hook
  const {
    getBroadcasterData,
    broadcasterData,
    isPending: isGettingBroadcasterData,
  } = useGetBroadcasterData();

  const cameraProps = {
    videoDevices: deviceManagement.videoDevices,
    permissionDenied: deviceManagement.permissionDenied,
    currentDevices: deviceManagement.currentDevices,
    cameraPermission: deviceManagement.cameraPermission,
    microphonePermission: deviceManagement.microphonePermission,
    onValidate: (values: any) => {
      deviceManagement.setCurrentDevices((prev) => ({
        ...prev,
        audioDeviceId: values.audioDeviceId,
        videoDeviceId: values.videoDeviceId,
        audioEnabled: values.audioEnabled ?? true,
        videoEnabled: values.videoEnabled ?? true,
      }));
    },
  };

  const { setStreamPlayer } = useLayoutContext();
  const { themeStyles, accessibilityId } = useAmityPage({ pageId });
  const { goToLiveStreamTerminatedPage, goToLiveStreamBannedPage } = useNavigation();

  const { channel, isLoading: isChannelLoading } = useLivechat({
    room,
    targetType: livestreamPost?.targetType,
  });

  const { members } = useCommunityMembersCollection({
    queryParams: {
      communityId: community?.communityId as string,
    },
  });

  const myMembership = members.find((member) => member.userId === currentUserId);

  const onClose = useCallback(() => setStreamPlayer(null), []);

  // Handle Go Live functionality
  const handleGoLive = useCallback(() => {
    if (room?.roomId) {
      // Step 1: Get broadcaster data
      getBroadcasterData(room.roomId);
      // Step 2 & 3 happen automatically via useEffect and props
    }
  }, [room?.roomId, getBroadcasterData]);

  const isUserBanned = myMembership?.isBanned;

  const { openPopup, closePopup } = usePopupContext();

  const isLive = room?.status === liveStreamStatus.live;
  const isEnded = room?.status === liveStreamStatus.ended;
  const isRecorded = room?.status === liveStreamStatus.recorded;

  const isTerminated =
    room?.moderation?.terminateLabels && room?.moderation?.terminateLabels?.length > 0;

  const showLivestreamChat =
    !!channel &&
    livestreamPost?.targetType !== 'user' &&
    !isEnded &&
    !isRecorded &&
    (uiState == 'broadcast' || uiState === 'player') &&
    !isTerminated &&
    !isUserBanned;

  const showWaitingApprovalBanner = isLive && isDesktop && livestreamPost?.feedType === 'reviewing';

  const { invitations, setInvitations } = useObserveRoomAndInvitation({ room });

  useSyncWatchingHeartbeat({
    roomId: room?.roomId,
    enabled: room?.status !== 'recorded' && room?.status !== 'ended',
  });

  useEffect(() => {
    // if there is roomId, the page open from notification tray
    if (room?.roomId && roomId)
      room.getInvitations().then((invitation) => {
        if (invitation) setInvitations([invitation]);
        else
          info({
            content: 'This invitation is no longer available.',
          });
      });
  }, [room?.roomId]);

  useEffect(() => {
    if (invitations && invitations?.length > 0) {
      const myInvitation = invitations?.find(
        (invitation) =>
          invitation.user?.userId === currentUserId &&
          invitation.status === InvitationStatusEnum.Pending,
      );

      const acceptInvitaion = async (onDone?: () => void) => {
        try {
          await myInvitation?.accept();
          setUiState('backStage');
          success({
            content: 'Invitation accepted.',
          });
        } catch (e) {
          if (
            e instanceof Error &&
            e.message?.includes('Invitation has already been accepted or rejected')
          ) {
            info({
              content: 'This invitation is no longer available.',
            });
          } else {
            info({
              content: 'Something went wrong',
            });
          }
        }
        onDone?.();
      };

      const rejectInvitaion = async (onDone: () => void) => {
        try {
          await myInvitation?.reject();
          success({
            content: 'Invitation declined.',
          });
        } catch (e) {
          if (
            e instanceof Error &&
            e.message?.includes('Invitation has already been accepted or rejected')
          ) {
            info({
              content: 'This invitation is no longer available.',
            });
          } else {
            info({
              content: 'Something went wrong',
            });
          }
        }
        onDone?.();
      };

      if (myInvitation && myInvitation.createdBy && myInvitation.user) {
        openPopup({
          children: (
            <InviteSheet
              host={myInvitation.createdBy}
              coHost={myInvitation.user}
              onCloseSheet={() => rejectInvitaion(closePopup)}
              onAccept={() => acceptInvitaion(closePopup)}
            />
          ),
        });
      }
    }
  }, [invitations]);

  useEffect(() => {
    if (keyboardOffset) setHideChatFeed(true);
    else setHideChatFeed(false);
  }, [keyboardOffset]);

  // Community subscription
  useEffect(() => {
    let unsubscriber: Amity.Unsubscriber;
    if (community?.communityId)
      unsubscriber = subscribeTopic(getCommunityTopic(community, SubscriptionLevels.COMMUNITY));

    return () => unsubscriber?.();
  }, [community?.communityId]);

  // Livestream has been terminated.
  useEffect(() => {
    if (!isDesktop && isTerminated) {
      onClose();
      goToLiveStreamTerminatedPage?.();
    }
  }, [isTerminated, isDesktop]);

  // User has been banned.
  useEffect(() => {
    if (!isDesktop && isUserBanned) goToLiveStreamBannedPage?.();
  }, [isDesktop, isUserBanned]);

  useEffect(() => {
    if (isEnded && uiState !== 'player') {
      setUiState('player');
    }
  }, [isEnded]);

  //  Livestream has been deleted
  useEffect(() => {
    if (room?.isDeleted || subscribedPost?.isDeleted) {
      onClose();
      goToDetailPage?.();
    }
  }, [room?.isDeleted, subscribedPost?.isDeleted]);

  // ✅ Clean up video player when switching to backStage

  // Handle UI state change when broadcaster data is received (Step 2)
  useEffect(() => {
    if (broadcasterData && isLive) {
      setUiState('broadcast');
    }
  }, [broadcasterData, isLive]);

  // Use chat container's height to position reaction floating lane
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

  return (
    <LivestreamDataProvider room={room} channel={channel} livestreamPost={post}>
      <ModalOverlay
        isOpen={(!!room && !isUserBanned) || isDesktop}
        className={styles.liveStreamPlayer__overlay}
        onOpenChange={(open) => !open && onClose()}
        data-is-live={isLive}
        data-backstage={uiState === 'backStage'}
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
          data-is-ended={isEnded && !isTerminated}
        >
          <Dialog
            className={styles.liveStreamPlayer__dialog}
            data-is-live={isLive}
            data-backstage={uiState === 'backStage'}
            data-community={!!community}
          >
            {uiState === 'player' && isLive ? (
              <div className={styles.liveStreamPlayer__player__wrapper} key="player-view">
                <LivestreamHeader
                  pageId={pageId}
                  community={community}
                  uiState="player"
                  isLive={isLive && !isUserBanned}
                  onClose={onClose}
                />
                <LivestreamPlayer
                  themeStyles={themeStyles}
                  accessibilityId={accessibilityId}
                  isLive={isLive}
                  showWaitingApprovalBanner={showWaitingApprovalBanner}
                  isLoading={isLoading}
                  isPoorConnection={isPoorConnection || room?.status === 'waitingReconnect'}
                  isDesktop={isDesktop}
                  isEnded={isEnded}
                  isTerminated={!!isTerminated}
                  isUserBanned={!!isUserBanned}
                  ref={videoRef}
                />
              </div>
            ) : (
              <div key="backstage-view" className={styles.liveStreamPlayer__cameraSection__wrapper}>
                <LivestreamStage
                  pageId={pageId}
                  isCoHost={true}
                  onClose={onClose}
                  uiState={uiState}
                  deviceManagement={deviceManagement}
                  targetType={subscribedPost?.targetType}
                  broadcasterData={broadcasterData}
                  isStarting={isGettingBroadcasterData}
                  onLeaveStreamStage={() => {
                    setUiState('player');
                    reloadPlayer();
                  }}
                  isLive={isLive}
                  community={community}
                />
              </div>
            )}

            {uiState === 'backStage' ? (
              <div
                className={styles.liveStreamPlayer__rightSection__wrapper}
                key="livestream-setup"
              >
                <LivestreamSetup
                  isCoHost={true}
                  isGoLiveButtonDisabled={
                    deviceManagement.microphonePermission === 'denied' ||
                    deviceManagement.cameraPermission === 'denied' ||
                    isGettingBroadcasterData
                  }
                  isTargetEvent={
                    subscribedPost?.targetType !== 'user' &&
                    subscribedPost?.targetType !== 'community'
                  }
                  targetType={subscribedPost?.targetType}
                  isPending={isGettingBroadcasterData}
                  pageId={pageId}
                  onGoLive={handleGoLive}
                />
              </div>
            ) : (
              <>
                {showLivestreamChat && (
                  <div className={styles.liveStreamPlayer__rightSection__wrapper}>
                    {isDesktop && channel ? (
                      <LivestreamChat
                        pageId={pageId}
                        isPoorConnection={false}
                        community={community}
                        isLoading={isChannelLoading}
                        isPlayer={uiState === 'player'}
                      />
                    ) : (
                      <>
                        {uiState === 'player' &&
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
                                    {channel?.attachedTo?.roomId && (
                                      <ReactionFloating post={room?.post as Amity.Post} />
                                    )}
                                  </div>
                                  <div
                                    className={styles.livestreamChat__container__inner}
                                    ref={chatContainerRef}
                                  >
                                    {channel && (
                                      <ChatFeed
                                        channel={channel}
                                        isJoinedCommunity={!!community?.isJoined}
                                      />
                                    )}
                                  </div>
                                </>
                              )}
                            </>,
                            plyrContainer,
                          )}
                        {channel && uiState === 'player' && (
                          <LivestreamChatMessageComposer
                            pageId={pageId}
                            channelId={channel.channelId}
                            disabled={room?.status === liveStreamStatus.ended || isPoorConnection}
                            community={community}
                            isPendingPost={subscribedPost?.feedType === 'reviewing'}
                            isPlayer={uiState === 'player'}
                          />
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </Dialog>
        </Modal>
      </ModalOverlay>
    </LivestreamDataProvider>
  );
}
