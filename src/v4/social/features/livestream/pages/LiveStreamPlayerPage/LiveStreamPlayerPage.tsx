import ReactDOM from 'react-dom';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Plyr from 'plyr';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { liveStreamStatus } from '~/v4/social/constants/livestream';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { useDrawer, useDrawerData } from '~/v4/core/providers/DrawerProvider';
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
  useRoomWatchTracking,
  useCoHostParticipantEvents,
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
import { LivestreamUiState } from '~/v4/social/features/livestream/internal-components/LivestreamStage/LivestreamStage';
import { useLeaveRoom } from '~/v4/social/features/livestream/hooks/useLeaveRoom';
import {
  LivestreamOverlay,
  TaggedProductsModal,
} from '~/v4/social/features/livestream/internal-components';
import useTaggingProduct from '~/v4/social/hooks/useTaggingProduct';
import useProductCatalogueSettings from '~/v4/social/hooks/useProductCatalogueSettings';
import { PinnedProductOverlay } from '~/v4/social/features/product-tagged/internal-components';

export type LiveStreamPlayerPageProps = {
  post?: Amity.Post;
  goToDetailPage?: (context?: GoToPostDetailPageParams) => void;
  roomId?: string;
};

export function LiveStreamPlayerPage({ post, roomId, goToDetailPage }: LiveStreamPlayerPageProps) {
  const pageId = PAGE_ID.LIVESTREAM_PLAYER_PAGE;
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const [livestreamPost, setLivestreamPost] = useState(post?.childrenPosts[0]);
  const coHostEndSessionRef = useRef(false);
  const previousProductTagsCountRef = useRef(post?.childrenPosts[0]?.productTags?.length || 0);
  const isProductDrawerOpenRef = useRef(false);

  // Track initial room status for isEnded/isRecorded logic
  const initialRoomStatusRef = useRef<string | null>(null);
  const wasEverLiveRef = useRef(false);

  const { post: subscribedPost } = usePostSubscription(post?.childrenPosts[0]?.postId);
  const { post: parentPost } = usePostSubscription(post?.postId);
  const { room } = useRoom(subscribedPost?.getRoomInfo()?.roomId ?? roomId);

  const { productCatalogueSettings } = useProductCatalogueSettings();

  useEffect(() => {
    if (subscribedPost) {
      setLivestreamPost(subscribedPost);
      previousProductTagsCountRef.current = subscribedPost?.productTags?.length || 0;
    }
  }, [subscribedPost]);

  const { success, info } = useNotifications();
  const { leaveRoom, isPending: isLeaving } = useLeaveRoom({
    room,
    onSettled: () => {
      setUiState('player');
      reloadPlayer();
      if (!coHostEndSessionRef.current)
        success({
          content: 'You left the stage and are now watching as a viewer.',
        });

      coHostEndSessionRef.current = false;
    },
  });

  const [chatContainerHeight, setChatContainerHeight] = useState<number>();
  const [hideChatFeed, setHideChatFeed] = useState(false);
  const [uiState, setUiState] = useState<LivestreamUiState>('player');
  const [shouldRequestDevicePermissions, setShouldRequestDevicePermissions] = useState(false);

  const { currentUserId } = useSDK();
  const { setDrawerData, removeDrawerData } = useDrawer();
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

  // Only request device permissions when not in player mode
  const deviceManagement = useDeviceManagement(shouldRequestDevicePermissions);

  useForceDarkTheme();

  // Get broadcaster data hook
  const {
    getBroadcasterData,
    broadcasterData,
    isPending: isGettingBroadcasterData,
  } = useGetBroadcasterData();

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

  const { updateProductTags } = useTaggingProduct();

  const myMembership = members.find((member) => member.userId === currentUserId);

  const onClose = useCallback(() => setStreamPlayer(null), []);

  // Handle Go Live functionality
  const handleGoLive = useCallback(() => {
    if (room?.roomId) {
      // Step 1: Get broadcaster data
      getBroadcasterData(room.roomId);
      // Step 2 & 3 happen automatically via useEffect and props
    }
  }, [room?.roomId]);

  const isUserBanned = myMembership?.isBanned;

  const { openPopup, closePopup } = usePopupContext();

  const isLive = room?.status === liveStreamStatus.live;

  // Track initial room status and if room was ever live
  useEffect(() => {
    if (room?.status && initialRoomStatusRef.current === null) {
      initialRoomStatusRef.current = room.status;
    }
    if (room?.status === liveStreamStatus.live) {
      wasEverLiveRef.current = true;
    }
  }, [room?.status]);

  // isEnded: true only if room was initially 'live' and status changed to 'ended' or 'recorded'
  const isEnded =
    wasEverLiveRef.current &&
    (room?.status === liveStreamStatus.ended || room?.status === liveStreamStatus.recorded);

  // isRecorded: true only if the initial status was 'recorded' (not from status change)
  const isRecorded =
    initialRoomStatusRef.current === liveStreamStatus.recorded &&
    room?.status === liveStreamStatus.recorded;

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

  const showWaitingApprovalBanner = isLive && isDesktop && parentPost?.feedType === 'reviewing';

  const notificationAlignment = showLivestreamChat ? 'livestreamWithChat' : 'fullscreen';
  useCoHostParticipantEvents({ room, notificationAlignment, mode: 'viewer' });

  const { invitations, setInvitations } = useObserveRoomAndInvitation({ room });

  useSyncWatchingHeartbeat({
    roomId: room?.roomId,
    enabled: room?.status !== 'recorded' && room?.status !== 'ended',
  });

  // Determine if current user is a viewer (not host or co-host)
  const isViewer = !!room && !!currentUserId && uiState === 'player';

  const isHost = room?.createdBy === currentUserId;

  // Track watch minutes for viewers
  useRoomWatchTracking({
    room,
    currentUserId,
    isViewer,
    videoRef,
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
          setShouldRequestDevicePermissions(true);
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
              content: 'Failed to accept invitation. Please try again.',
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
              content: 'Failed to decline invitation. Please try again.',
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

  useEffect(() => {
    if (room?.status && ['ended', 'recorded'].includes(room?.status)) {
      setUiState('player');
      if (room?.recordedPlaybackInfos && room?.recordedPlaybackInfos?.length > 0) reloadPlayer();
    }
  }, [room?.status]);

  // User has been banned.
  useEffect(() => {
    if (!isDesktop && isUserBanned) goToLiveStreamBannedPage?.();
  }, [isDesktop, isUserBanned]);

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

  const handleUpdateProductTags = useCallback(
    async (tags: Amity.ProductTag[]) => {
      const previousTagsCount = previousProductTagsCountRef.current;
      const newTagsCount = tags.length;
      const isRemoving = newTagsCount < previousTagsCount;

      if (livestreamPost?.postId) {
        try {
          const result = await updateProductTags({
            postId: livestreamPost?.postId,
            productTags: tags,
            action: isRemoving ? 'remove' : 'add',
          });

          // Update the ref with the new count after successful update
          previousProductTagsCountRef.current = newTagsCount;

          // Only show success toast when adding products and no unavailable products toast is shown
          const hasUnavailableProducts = result?.data?.productTags?.some(
            (tag: Amity.ProductTag) => !tag.product || tag.product.status === 'archived',
          );
          if (newTagsCount > previousTagsCount && !hasUnavailableProducts) {
            success({ content: 'Product tags added.' });
          }

          return result?.data?.productTags as Amity.ProductTag[] | undefined;
        } catch (error) {
          //
        }
      }
    },
    [livestreamPost?.postId, updateProductTags, success, info],
  );

  const handleRemove = useCallback(
    async (productTag: Amity.ProductTag) => {
      if (!livestreamPost?.postId) return;
      const updatedTags = livestreamPost?.productTags?.filter(
        (tag) => tag.productId !== productTag.productId,
      );
      try {
        await updateProductTags({
          postId: livestreamPost?.postId,
          productTags: updatedTags || [],
          action: 'remove',
        });
        success({ content: 'Product tag removed.' });
      } catch (error) {
        //
      }
    },
    [livestreamPost?.postId, livestreamPost?.productTags, updateProductTags, success, info],
  );

  const getTaggedProductsModalContent = useCallback(() => {
    return (
      <TaggedProductsModal
        pageId={pageId}
        productTags={subscribedPost?.productTags || []}
        pinnedProductId={subscribedPost?.pinnedProductId}
        isHost={isHost}
        onClose={() => {
          isProductDrawerOpenRef.current = false;
          removeDrawerData();
        }}
        onUpdateProductTags={handleUpdateProductTags}
        onRemove={handleRemove}
        roomId={roomId || room?.roomId}
        canShowAddProducts={canShowProductTags}
      />
    );
  }, [
    pageId,
    subscribedPost?.productTags,
    subscribedPost?.pinnedProductId,
    isHost,
    removeDrawerData,
    handleUpdateProductTags,
    handleRemove,
  ]);

  const onClickProductTagBadge = () => {
    isProductDrawerOpenRef.current = true;
    setDrawerData({
      content: getTaggedProductsModalContent(),
      ariaLabel: isHost ? 'Tagged products' : 'Products tagged',
    });
  };

  // Update drawer content when product tags change (only if product drawer is open)
  useEffect(() => {
    if (isProductDrawerOpenRef.current && subscribedPost) {
      setDrawerData({
        content: getTaggedProductsModalContent(),
        ariaLabel: isHost ? 'Tagged products' : 'Products tagged',
      });
    }
  }, [subscribedPost?.productTags, subscribedPost?.pinnedProductId]);

  const canShowProductTags = productCatalogueSettings?.product.enabled && !isEnded && !isTerminated;

  const hasTaggedProductsToDisplay = (livestreamPost?.productTags?.length ?? 0) > 0;

  const isPendingPost =
    parentPost?.feedType === 'reviewing' || subscribedPost?.feedType === 'reviewing';

  return (
    <LivestreamDataProvider
      room={room}
      channel={channel}
      parentPost={parentPost}
      livestreamPost={subscribedPost as Amity.Post<'room'>}
    >
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
          data-is-ended={isEnded || isTerminated}
        >
          <Dialog
            className={styles.liveStreamPlayer__dialog}
            data-is-live={isLive}
            data-backstage={uiState === 'backStage'}
            data-community={!!community}
            aria-label={uiState === 'backStage' ? 'Livestream backstage' : 'Livestream player'}
          >
            {uiState === 'player' ? (
              <div className={styles.liveStreamPlayer__player__wrapper} key="player-view">
                {(isDesktop || (!isDesktop && room?.status !== 'recorded')) && (
                  <LivestreamHeader
                    pageId={pageId}
                    community={community}
                    uiState="player"
                    isLive={isLive && !isUserBanned}
                    onClose={onClose}
                    productTags={livestreamPost?.productTags || []}
                    isHost={isHost}
                    onUpdateProductTags={handleUpdateProductTags}
                    canShowProductTags={canShowProductTags}
                  />
                )}
                <div
                  data-is-live={isLive}
                  className={styles.liveStreamPlayer__videoSection__wrapper}
                >
                  <LivestreamPlayer
                    themeStyles={themeStyles}
                    accessibilityId={accessibilityId}
                    isLive={isLive && !isTerminated}
                    showWaitingApprovalBanner={showWaitingApprovalBanner}
                    isLoading={isLoading}
                    isPoorConnection={isPoorConnection || room?.status === 'waitingReconnect'}
                    isEnded={isEnded}
                    isTerminated={!!isTerminated}
                    isUserBanned={!!isUserBanned}
                    isRecorded={isRecorded}
                    pageId={pageId}
                    ref={videoRef}
                    productTags={
                      !isDesktop && isRecorded && hasTaggedProductsToDisplay
                        ? livestreamPost?.productTags ?? []
                        : []
                    }
                    onClickProductTagBadge={onClickProductTagBadge}
                    onClose={onClose}
                    canShowProductTags={canShowProductTags}
                  />
                  {isDesktop && !isLive && hasTaggedProductsToDisplay && (
                    <div className={styles.liveStreamPlayer__taggedProductsModal__wrapper}>
                      <TaggedProductsModal
                        key={`${subscribedPost?.productTags?.length}-${subscribedPost?.pinnedProductId || 'none'}`}
                        roomId={roomId || room?.roomId}
                        pageId={pageId}
                        productTags={subscribedPost?.productTags || []}
                        pinnedProductId={subscribedPost?.pinnedProductId}
                        isHost={isHost}
                        onClose={() => {
                          isProductDrawerOpenRef.current = false;
                        }}
                        onUpdateProductTags={(tags) => handleUpdateProductTags(tags)}
                        onRemove={(tag) => handleRemove(tag)}
                        canShowAddProducts={canShowProductTags}
                      />
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div key="backstage-view" className={styles.liveStreamPlayer__cameraSection__wrapper}>
                {isLeaving && <LivestreamOverlay.LeavingStage />}
                <LivestreamStage
                  pageId={pageId}
                  isCoHost={true}
                  onClose={onClose}
                  uiState={uiState}
                  deviceManagement={deviceManagement}
                  targetType={subscribedPost?.targetType}
                  broadcasterData={broadcasterData}
                  isStarting={isGettingBroadcasterData}
                  onLeaveStreamStage={(isSessionEnded?: boolean) => {
                    coHostEndSessionRef.current = isSessionEnded ?? false;
                    leaveRoom();
                  }}
                  onLeaveByKickout={() => {
                    setUiState('player');
                    reloadPlayer();
                  }}
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
                  isEnabledProductTag={productCatalogueSettings?.product.enabled}
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
                        isPendingPost={parentPost?.feedType === 'reviewing'}
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
                                        pageId={pageId}
                                        channel={channel}
                                        isJoinedCommunity={!!community?.isJoined}
                                      />
                                    )}
                                    {!isPendingPost && (
                                      <div className={styles.liveStreamPlayer__pinnedProduct}>
                                        <PinnedProductOverlay pageId={pageId} />
                                      </div>
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
                            isPendingPost={parentPost?.feedType === 'reviewing'}
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
