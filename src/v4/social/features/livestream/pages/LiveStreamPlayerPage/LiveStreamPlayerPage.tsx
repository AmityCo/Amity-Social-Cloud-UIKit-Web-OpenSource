import ReactDOM from 'react-dom';
import { useString, resolveString } from '~/v4/core/localization';
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
  ChannelRepository,
  getCommunityTopic,
  RoomRepository,
  subscribeTopic,
  SubscriptionLevels,
  InvitationStatusEnum,
} from '@amityco/ts-sdk';
import 'plyr/dist/plyr.css';
import { MemberRoles } from '~/v4/chat/constants';
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
import { FailedToShow } from '~/v4/social/internal-components/FailedToShow';
import { useEvent } from '~/v4/social/features/events/hooks';

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

  const {
    room,
    isLoading: isLoadingRoom,
    refresh: refreshRoom,
  } = useRoom(subscribedPost?.getRoomInfo()?.roomId ?? roomId);

  // The room LiveObject's `participants` array is not reliably re-emitted when
  // a co-host leaves the stage / room. Without this, `coHostId` stays pointing
  // at the departed user on the co-host's rejoin session (and on other
  // viewers' sessions), and the CoHostBadge sticks on the departed user's old
  // messages (PDT-3981). Force a re-fetch on every leave/stage-left/removed
  // event so every subscribed client's `room.participants` reflects reality.
  useEffect(() => {
    const unsubscribers: Amity.Unsubscriber[] = [
      RoomRepository.onRoomParticipantLeft(() => refreshRoom()),
      RoomRepository.onRoomParticipantStageLeft(() => refreshRoom()),
      RoomRepository.onRoomParticipantRemoved(() => refreshRoom()),
    ];
    return () => unsubscribers.forEach((fn) => fn());
  }, [refreshRoom]);

  // Also refresh on mount so a rejoin session that came back to a stale room
  // (participantLeft fired while unmounted, so the local cache never saw it)
  // is corrected on the way in. refreshRoom is stable (useCallback([])), so
  // this effectively runs once.
  useEffect(() => {
    refreshRoom();
  }, [refreshRoom]);

  const { post: parentPost, isLoading: isLoadingParentPost } = usePostSubscription(
    (room?.referenceType === 'post' ? room?.referenceId : room?.post?.postId) ?? post?.postId,
  );

  const isRoomPostUnavailable =
    !!roomId && !isLoadingRoom && !isLoadingParentPost && !!room && !parentPost;

  const { productCatalogueSettings } = useProductCatalogueSettings();

  useEffect(() => {
    if (subscribedPost) {
      setLivestreamPost(subscribedPost);
      previousProductTagsCountRef.current = subscribedPost?.productTags?.length || 0;
    }
  }, [subscribedPost]);

  const { success, info } = useNotifications();

  const leftStageText = useString('amity_social_label_left_stage');
  const invitationUnavailableText = useString(
    'amity_social_error_community_invitation_unavailable_error',
  );
  const invitationAcceptedText = useString('amity_social_invitation_accepted');
  const invitationFailToAcceptText = useString(
    'amity_social_toast_community_invitation_fail_to_accept',
  );
  const invitationFailToRejectText = useString(
    'amity_social_toast_community_invitation_fail_to_reject',
  );
  const productTagAddedText = useString('amity_social_label_product_tag_added');
  const productTagRemovedText = useString('amity_social_label_product_tag_removed');
  const taggedProductsText = useString('amity_social_button_tagged_products');
  const productsTaggedText = useString('amity_social_button_products_tagged');

  const {
    leaveRoom,
    leaveRoomAsync,
    isPending: isLeaving,
  } = useLeaveRoom({
    room,
    onSettled: () => {
      setUiState('player');
      // Deliberately no `reloadPlayer()` here: returning to the player view re-mounts the
      // video element and `useLiveStreamPlayer` initialises it on its own. Forcing a reload
      // tore down that fresh player (pause → clear src → re-init), which showed up as the
      // stream pausing and then resuming after "Leave as co-host". Instead just put the
      // player back into its plain-viewer state (resume at the live edge, hide the
      // play/pause control that the stage teardown's pause had pinned open).
      resumeAsViewer();
      // Re-fetch the room so `participants` drops the departing co-host —
      // otherwise the cached LiveObject keeps them as `type: 'coHost'` and
      // their previous chat messages keep the badge after they rejoin as a
      // viewer (PDT-3981).
      refreshRoom();
      if (!coHostEndSessionRef.current)
        success({
          content: leftStageText,
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

  const { event } = useEvent({
    eventId: post?.eventId ?? '',
    shouldCall: !!post?.eventId,
  });

  const { community } = useCommunity({
    communityId: event ? event?.targetCommunity?.communityId : livestreamPost?.targetId,
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
    isPaused,
    showControls,
    togglePlayPause,
    toggleControls,
    resumeAsViewer,
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

  const removeSelfFromChannelModerators = useCallback(async () => {
    const channelId = channel?.channelId;
    if (!channelId || !currentUserId) return;

    const moderators = channel?.metadata?.moderators as string[] | undefined;

    if (moderators?.includes(currentUserId)) {
      try {
        await ChannelRepository.updateChannel(channelId, {
          metadata: {
            ...channel?.metadata,
            moderators: moderators.filter((id) => id !== currentUserId),
          },
        });
      } catch (error) {
        // Best-effort — the host-side cleanup also revokes the role/metadata.
      }
    }
    try {
      await ChannelRepository.Moderation.removeRole(channelId, MemberRoles.CHANNEL_MODERATOR, [
        currentUserId,
      ]);
    } catch (error) {
      // Best-effort — may be rejected once the co-host role is already gone server-side.
    }
  }, [channel?.channelId, channel?.metadata, currentUserId]);

  const onClose = useCallback(async () => {
    // If the current user is a co-host, close-livestream must run the same
    // leave flow as "Leave as co-host" — otherwise `room.participants` keeps
    // them as `type: 'coHost'` and on rejoin their old messages keep the
    // CoHostBadge until the server session ends (PDT-3981).
    //
    // Prefer `uiState` (authoritative locally for the current user's role)
    // over inspecting `room.participants` — the room LiveObject on the
    // co-host's own client does not always list them, so a room-only check
    // false-negatives.
    //
    // We reuse the `leaveRoom` mutation from useLeaveRoom (same as the
    // menu's "Leave as co-host" path) so the SDK call, refreshRoom(), and
    // uiState reset all run through the same code path.
    const isCurrentUserCoHost =
      uiState === 'broadcast' ||
      uiState === 'backStage' ||
      (!!currentUserId &&
        !!room?.participants?.some(
          (participant) => participant.type === 'coHost' && participant.userId === currentUserId,
        ));
    if (isCurrentUserCoHost) {
      coHostEndSessionRef.current = true;
      // Drop self from the channel `moderators` metadata before leaving. The badge on chat
      // messages is keyed on this array, and the host-side cleanup only runs if the host's
      // app receives the leave event — so a departing co-host clears their own entry while
      // they still hold the channel-moderator role. Fire-and-forget: the request completes
      // independently of this component, so closing never waits on it.
      void removeSelfFromChannelModerators();
      // Await the leave before tearing down the player. With the fire-and-forget
      // `leaveRoom()` the request could still be in flight when this page unmounted,
      // so the server had not yet dropped the co-host from `room.participants` — on
      // rejoin the room still reported them as `coHost` and their messages (old and
      // new) kept rendering the CoHost badge.
      try {
        await leaveRoomAsync();
      } catch (error) {
        // Leaving is best-effort — never block closing the player on it.
      }
    }
    setStreamPlayer(null);
  }, [
    setStreamPlayer,
    room,
    currentUserId,
    uiState,
    leaveRoomAsync,
    removeSelfFromChannelModerators,
  ]);

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
    enabled: room?.status !== 'recorded' && room?.status !== 'ended' && uiState === 'player',
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
    if (isLoadingParentPost) return;
    if (isRoomPostUnavailable) return;
    // if there is roomId, the page open from notification tray
    if (room?.roomId && roomId)
      room.getInvitations().then((invitation) => {
        if (invitation) setInvitations([invitation]);
        else
          info({
            content: invitationUnavailableText,
          });
      });
  }, [room?.roomId, isLoadingParentPost, isRoomPostUnavailable]);

  useEffect(() => {
    if (isRoomPostUnavailable) return;
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
            content: invitationAcceptedText,
          });
        } catch (e) {
          if (
            e instanceof Error &&
            e.message?.includes('Invitation has already been accepted or rejected')
          ) {
            info({
              content: invitationUnavailableText,
            });
          } else {
            info({
              content: invitationFailToAcceptText,
            });
          }
        }
        onDone?.();
      };

      const rejectInvitaion = async (onDone: () => void) => {
        try {
          await myInvitation?.reject();
          success({
            content: resolveString('amity_social_toast_snackbar_invitation_declined'),
          });
        } catch (e) {
          if (
            e instanceof Error &&
            e.message?.includes('Invitation has already been accepted or rejected')
          ) {
            info({
              content: invitationUnavailableText,
            });
          } else {
            info({
              content: invitationFailToRejectText,
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
  }, [invitations, isRoomPostUnavailable]);

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
            success({ content: productTagAddedText });
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
        success({ content: productTagRemovedText });
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
      ariaLabel: isHost ? taggedProductsText : productsTaggedText,
    });
  };

  // Update drawer content when product tags change (only if product drawer is open)
  useEffect(() => {
    if (isProductDrawerOpenRef.current && subscribedPost) {
      setDrawerData({
        content: getTaggedProductsModalContent(),
        ariaLabel: isHost ? taggedProductsText : productsTaggedText,
      });
    }
  }, [subscribedPost?.productTags, subscribedPost?.pinnedProductId]);

  const canShowProductTags = productCatalogueSettings?.product.enabled && !isEnded && !isTerminated;

  const hasTaggedProductsToDisplay = (livestreamPost?.productTags?.length ?? 0) > 0;

  const isPendingPost =
    parentPost?.feedType === 'reviewing' || subscribedPost?.feedType === 'reviewing';

  const dialogAriaLabel =
    uiState === 'backStage'
      ? resolveString('amity_social_livestream_backstage')
      : resolveString('amity_social_livestream_player');

  const overlayStyle: React.CSSProperties = {
    // ✅ Move the entire modal up when keyboard is open
    transform: keyboardOffset > 0 && !isDesktop ? `translateY(-${keyboardOffset * 0.5}px)` : 'none',
    transition: 'transform 0.3s ease-in-out',
  };

  const playerContent = (
    <>
      {isRoomPostUnavailable ? (
        <FailedToShow pageId={pageId} onBack={onClose} />
      ) : (
        <>
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
              <div data-is-live={isLive} className={styles.liveStreamPlayer__videoSection__wrapper}>
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
                  isPaused={isPaused}
                  showControls={showControls}
                  onToggleControls={toggleControls}
                  onTogglePlayPause={togglePlayPause}
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
                  void removeSelfFromChannelModerators();
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
            <div className={styles.liveStreamPlayer__rightSection__wrapper} key="livestream-setup">
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
        </>
      )}
    </>
  );

  // On desktop the player is a centered modal, so the react-aria Modal (with its contained
  // FocusScope) is correct. On mobile the player is a full-screen page; wrapping it in a
  // react-aria Modal installs a focus trap that fights every vaul Drawer opened over it
  // (the option menu, the tagged-products sheet, …). The two traps ping-pong focus() until
  // the call stack overflows (PDT-3913: "Maximum call stack size exceeded" in HTMLElement.focus).
  // A plain container has no focus trap, so vaul owns focus while a drawer is open.
  return (
    <LivestreamDataProvider
      room={room}
      channel={channel}
      parentPost={parentPost}
      livestreamPost={subscribedPost as Amity.Post<'room'>}
    >
      {isDesktop ? (
        <ModalOverlay
          isOpen={(!!room && !isUserBanned) || isDesktop}
          className={styles.liveStreamPlayer__overlay}
          onOpenChange={(open) => !open && onClose()}
          data-is-live={isLive}
          data-backstage={uiState === 'backStage'}
          style={overlayStyle}
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
              aria-label={dialogAriaLabel}
            >
              {playerContent}
            </Dialog>
          </Modal>
        </ModalOverlay>
      ) : (
        !!room &&
        !isUserBanned && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label={dialogAriaLabel}
            className={styles.liveStreamPlayer__overlay}
            data-is-live={isLive}
            data-backstage={uiState === 'backStage'}
            style={overlayStyle}
          >
            <div
              className={styles.livestreamPlayer__modal}
              data-is-live={isLive}
              data-is-ended={isEnded || isTerminated}
            >
              <div
                className={styles.liveStreamPlayer__dialog}
                data-is-live={isLive}
                data-backstage={uiState === 'backStage'}
                data-community={!!community}
              >
                {playerContent}
              </div>
            </div>
          </div>
        )
      )}
    </LivestreamDataProvider>
  );
}
