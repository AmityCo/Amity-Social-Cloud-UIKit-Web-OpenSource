import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { ChannelRepository } from '@amityco/ts-sdk';
import { resolveString } from '~/v4/core/localization';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useCommunity } from '~/v4/chat/hooks/useCommunity';
import { TextElement } from '~/v4/core/internal-components/TextElement';
import { TypographyVariant } from '~/v4/core/components';
import { LivestreamTargetSelectionPage } from '~/v4/social/features/livestream/pages/LivestreamTargetSelectionPage';
import { useStopStream } from './useStopStream';
import { useCreateLivestreamPost } from './useCreateLivestreamPost';
import { useGetBroadcasterData } from './useGetBroadcasterData';
import useSDK from '~/v4/core/hooks/useSDK';
import { useRoom } from './useRoom';

import useProductCatalogueSettings from '~/v4/social/hooks/useProductCatalogueSettings';
import useTaggingProduct from '~/v4/social/hooks/useTaggingProduct';
import { ERROR_CODE } from '~/v4/social/constants/errorResponse';
import { usePostSubscription } from './usePostSubscription';

export type CreateLivestreamUiState = 'preview' | 'broadcast' | 'backStage';

export interface UseCreateLivestreamReturn {
  // Target state
  targetType: 'community' | 'user';
  targetId: string;

  // UI state
  uiState: CreateLivestreamUiState;

  // Form state
  thumbnailFileId?: string;
  livestreamTitle: string;
  livestreamDescription: string;
  productTags: Amity.MediaProductTag[];
  pinnedProductId?: string;
  isEnabledProductTag?: boolean;

  // Community data
  community: any;

  // Livestream data
  room?: Amity.Room | null;
  // The post the room links to: parent feed post (community) or room post (event).
  roomLinkedPost?: Amity.Post | null;
  // The room/video post that carries product tags & room info.
  roomPost?: Amity.Post<'room'> | null;
  channel?: Amity.Channel<'live'>;
  broadcasterData?: Amity.BroadcasterData;

  // Loading states
  isCreating: boolean;
  isEnding: boolean;
  isGettingLiveChat: boolean;

  // Computed states
  isTargetEvent: boolean;
  isGoLiveButtonDisabled: boolean;
  isGettingBroadcasterData: boolean;

  // Handlers
  setLivestreamTitle: React.Dispatch<React.SetStateAction<string>>;
  setLivestreamDescription: React.Dispatch<React.SetStateAction<string>>;
  setUiState: React.Dispatch<React.SetStateAction<CreateLivestreamUiState>>;
  setThumbnailFileId: React.Dispatch<React.SetStateAction<string>>;
  setProductTags: React.Dispatch<React.SetStateAction<Amity.MediaProductTag[]>>;
  setPinnedProductId: React.Dispatch<React.SetStateAction<string | undefined>>;
  stopRoom: () => void;
  handleTargetSelection: () => void;
  handleStopRoom: (roomId: string) => void;
  handleGoLive: (params?: { readOnly?: boolean }) => void;
}

export interface UseCreateLivestreamProps {
  initialTargetType: 'community' | 'user';
  initialTargetId: string;
  pageId: string;
  microphonePermission: string;
  cameraPermission: string;
  event?: Amity.Event;
}

export const useCreateLivestream = ({
  initialTargetType,
  initialTargetId,
  pageId,
  microphonePermission,
  cameraPermission,
  event,
}: UseCreateLivestreamProps): UseCreateLivestreamReturn => {
  const { currentUserId } = useSDK();
  const { onBack, goToPostDetailPage } = useNavigation();
  const { confirm } = useConfirmContext();

  const { openPopup } = usePopupContext();
  const { isPending: isEnding, stopStream } = useStopStream();

  // Mutable target state
  const [targetType, setTargetType] = useState<'community' | 'user'>(initialTargetType);
  const [targetId, setTargetId] = useState<string>(initialTargetId);
  const [uiState, setUiState] = useState<CreateLivestreamUiState>('preview');
  const readOnlyRef = useRef(false);
  const hasMutedRef = useRef(false);
  // Set when an event goes live with product tags selected in setup. State (not a
  // ref) so flipping it re-runs the effect below even when `roomPost` already
  // resolved before go-live — which it does for events, since the room pre-exists.
  const [shouldApplyEventTags, setShouldApplyEventTags] = useState(false);
  const [livestreamTitle, setLivestreamTitle] = useState('');
  const [livestreamDescription, setLivestreamDescription] = useState('');
  const [thumbnailFileId, setThumbnailFileId] = useState('');
  const [productTags, setProductTags] = useState<Amity.MediaProductTag[]>([]);
  const [pinnedProductId, setPinnedProductId] = useState<string | undefined>(undefined);
  const [roomId, setRoomId] = useState<string | undefined>(event?.room?.roomId);

  const { room } = useRoom(roomId);

  const { productCatalogueSettings, refetchProductCatalogueSettings } =
    useProductCatalogueSettings();

  const { updateProductTags, pinProduct } = useTaggingProduct();

  const [isEnabledProductTag, setIsEnabledProductTag] = useState(
    productCatalogueSettings?.product.enabled,
  );

  useEffect(() => {
    if (productCatalogueSettings) {
      setIsEnabledProductTag(productCatalogueSettings.product.enabled);
    }
  }, [productCatalogueSettings?.product.enabled]);

  // The parent feed post the room links to. Both community livestreams and
  // events use a 2-level topology: this parent (dataType 'text') has a child
  // 'room' post that carries the roomId and product tags.
  const { post: roomLinkedPost } = usePostSubscription(
    event?.room?.post?.postId ?? room?.post?.postId,
  );
  // The child 'room' post that carries product tags & room info — the only valid
  // product-tag target. Prefer the child object the SDK already hydrated on the
  // parent (community livestreams); only when it's missing — e.g. event.room.post
  // exposes child ids in `children` but no hydrated `childrenPosts` — do we fetch
  // it by id, to avoid an extra request. Guard against null downstream rather than
  // falling back to the parent ('text') post, which is never a valid target.
  const hydratedChildPost = roomLinkedPost?.childrenPosts?.[0] ?? null;
  const { post: fetchedChildPost } = usePostSubscription(
    hydratedChildPost ? undefined : roomLinkedPost?.children?.[0],
  );
  const roomPost = (hydratedChildPost ?? fetchedChildPost ?? null) as Amity.Post<'room'> | null;

  const [channel, setChannel] = useState<Amity.Channel<'live'>>();

  const { community } = useCommunity({
    communityId: targetType === 'community' ? targetId : undefined,
    shouldCall: !!targetId,
  });

  // Create livestream post mutation
  const { createLivestreamPost, isPending: isCreating } = useCreateLivestreamPost();

  // Get broadcaster data hook
  const {
    getBroadcasterData,
    broadcasterData,
    isPending: isGettingBroadcasterData,
  } = useGetBroadcasterData();

  // Handle UI state change when broadcaster data is received
  useEffect(() => {
    if (broadcasterData) {
      setUiState('broadcast');
    }
  }, [broadcasterData, room?.roomId]);

  // Apply the read-only choice once broadcasting has actually started. Muting at
  // channel-creation time does not stick — broadcast-start re-provisions the
  // channel un-muted — so mute here (after uiState === 'broadcast') and only once.
  useEffect(() => {
    if (
      uiState === 'broadcast' &&
      channel?.channelId &&
      readOnlyRef.current &&
      !hasMutedRef.current
    ) {
      hasMutedRef.current = true;
      ChannelRepository.muteChannel(channel.channelId);
    }
  }, [uiState, channel?.channelId]);

  // Computed states
  const isTargetEvent = !!event;

  const isGoLiveButtonDisabled = useMemo(() => {
    const isPermissionGranted = microphonePermission === 'denied' || cameraPermission === 'denied';
    return isPermissionGranted || (!isTargetEvent && livestreamTitle.length === 0);
  }, [microphonePermission, cameraPermission, isTargetEvent, livestreamTitle.length]);

  const handleStopRoom = (roomId: string) => {
    stopStream(roomId, {
      onSuccess: () => {
        if (!isTargetEvent)
          roomLinkedPost?.postId && goToPostDetailPage({ postId: roomLinkedPost?.postId });
        else onBack();
      },
      onError: (error) => {
        if (error.message.includes('Room is already ended')) {
          if (!isTargetEvent)
            roomLinkedPost?.postId && goToPostDetailPage({ postId: roomLinkedPost?.postId });
          else onBack();
        }
      },
    });
  };

  const stopRoom = useCallback(() => {
    if (uiState === 'broadcast') {
      confirm({
        onOk: () => room?.roomId && handleStopRoom(room?.roomId),
        type: 'confirm',
        okText: resolveString(
          'amity_social_modal_create_livestream_end_livestream_dialog_confirm_text',
        ),
        cancelText: resolveString('amity_social_button_cancel'),
        title: resolveString('amity_social_modal_create_livestream_end_livestream_dialog_title'),
        pageId,
        content: resolveString('amity_social_modal_create_livestream_end_livestream_dialog_desc'),
      });
    } else if (
      livestreamTitle.length > 0 ||
      livestreamDescription.length > 0 ||
      thumbnailFileId ||
      productTags.length > 0
    ) {
      confirm({
        onOk: onBack,
        type: 'confirm',
        okText: resolveString(
          'amity_social_modal_create_livestream_discard_livestream_dialog_confirm_text',
        ),
        cancelText: resolveString('amity_social_modal_dialog_cancel_button'),
        title: resolveString(
          'amity_social_modal_create_livestream_discard_livestream_dialog_title',
        ),
        pageId,
        content: resolveString(
          'amity_social_modal_create_livestream_discard_livestream_dialog_desc',
        ),
      });
    } else onBack();
  }, [
    onBack,
    pageId,
    livestreamTitle.length,
    livestreamDescription.length,
    thumbnailFileId,
    productTags.length,
    confirm,
    uiState,
    room?.roomId,
  ]);

  const handleTargetSelection = useCallback(() => {
    openPopup({
      pageId,
      componentId: 'target_selection',
      view: 'desktop',
      header: React.createElement(TextElement, {
        pageId: 'select_livestream_target_page',
        elementId: 'title',
        variant: TypographyVariant.Headline,
      }),
      children: React.createElement(LivestreamTargetSelectionPage, {
        onPressTarget: (params: any) => {
          setTargetType(params.targetType);
          setTargetId(params.targetId);
        },
      }),
    });
  }, [pageId, openPopup]);

  const { mutate: getLiveChat, isPending: isGettingLiveChat } = useMutation({
    mutationFn: async (room: Amity.Room) => {
      return await room.getLiveChat();
    },
    onSuccess: (data: Amity.Channel<'live'> | undefined) => {
      setChannel(data);
    },
  });

  const goLiveOnEvent = async () => {
    if (!room) return;
    getBroadcasterData(room.roomId);

    // Unlike community livestreams, the event's room post already exists, so the
    // tags selected in setup are not committed via post creation. Flag them and
    // let the effect below write them — it also covers the case where `roomPost`
    // is still loading at click time (the event Go Live button is not gated).
    if (productTags.length > 0) setShouldApplyEventTags(true);

    // Fetch the live chat immediately at go-live (awaited) on the event's room
    // object, so the chat channel is ready as the broadcast starts — matching the
    // iOS UIKit. The event's room is provisioned server-side with live chat.
    try {
      const liveChat = await event?.room?.getLiveChat?.();
      if (liveChat) setChannel(liveChat);
    } catch {
      // Ignore — the fallback effect below retries once the room is live.
    }
  };

  // Apply the product tags selected in setup to the event's room post, once the
  // post has resolved. Clearing the flag first makes this fire-once. Mirrors how
  // the community flow commits tags at post-creation, but the event room post
  // pre-exists so we patch it with `updateProductTags` (+ pin) instead.
  useEffect(() => {
    if (!shouldApplyEventTags || !roomPost?.postId || productTags.length === 0) return;
    setShouldApplyEventTags(false);

    const postId = roomPost.postId;
    (async () => {
      await updateProductTags({ postId, productTags, action: 'add' });
      if (pinnedProductId) {
        await pinProduct({ postId, productId: pinnedProductId });
      }
    })();
  }, [
    shouldApplyEventTags,
    roomPost?.postId,
    productTags,
    pinnedProductId,
    updateProductTags,
    pinProduct,
  ]);

  // Fallback: if the immediate call above returned undefined (e.g. the chat isn't
  // exposed until the room is live), poll until it resolves. Guarded by !channel
  // so it no-ops once the channel is already set.
  useEffect(() => {
    if (isTargetEvent && room && room.status === 'live' && !channel && !isGettingLiveChat) {
      getLiveChat(room);
    }
  }, [isTargetEvent, room, room?.status, channel, isGettingLiveChat]);

  const confirmGoLive = () => {
    setProductTags([]);
    setPinnedProductId(undefined);
    return confirm({
      onOk: async () => {
        await createLivestream({ productTagsOverride: [], pinnedProductIdOverride: undefined });
      },
      onCancel: async () => {
        await refetchProductCatalogueSettings();
      },
      type: 'confirm',
      okText: resolveString('amity_social_status_go_live'),
      okButtonColor: 'primary',
      cancelText: resolveString('amity_social_status_edit_live'),
      title: resolveString('amity_social_label_product_tagging_unavailable_title'),
      pageId,
      content: resolveString('amity_social_label_product_tagging_unavailable_description'),
    });
  };

  const createLivestream = (overrides?: {
    productTagsOverride?: Amity.MediaProductTag[];
    pinnedProductIdOverride?: string;
  }) => {
    const effectiveProductTags = overrides?.productTagsOverride ?? productTags;
    const effectivePinnedProductId = overrides?.pinnedProductIdOverride ?? pinnedProductId;
    return createLivestreamPost(
      {
        title: livestreamTitle,
        description: livestreamDescription,
        thumbnailFileId,
        targetType,
        targetId: targetType !== 'user' ? targetId : currentUserId!,
        liveChatEnabled: targetType === 'community',
        ...(effectiveProductTags.length > 0 && {
          productTags: effectiveProductTags,
          pinnedProductId: effectivePinnedProductId,
        }),
      },
      {
        onSuccess: (result) => {
          const post = result.post;

          if (post.data) {
            const postData = post.data;
            const room = postData.childrenPosts[0]?.getRoomInfo();

            if (room) {
              getBroadcasterData(room.roomId);

              if (targetType === 'community') getLiveChat(room);

              setRoomId(room.roomId);
            }
          }
        },

        onError: (error) => {
          if (error.message.includes(ERROR_CODE.DISABLED_PRODUCT_TAG) && productTags.length > 0) {
            setIsEnabledProductTag(false);
            confirmGoLive();
          }
        },
      },
    );
  };

  const checkAvailableProductTags = async () => {
    await refetchProductCatalogueSettings();

    if (productTags.length > 0 && productCatalogueSettings?.product.enabled === false) {
      confirmGoLive();
    } else {
      createLivestream();
    }
  };

  const handleGoLive = ({ readOnly }: { readOnly?: boolean } = {}) => {
    readOnlyRef.current = readOnly ?? false;
    isTargetEvent ? goLiveOnEvent() : checkAvailableProductTags();
  };

  return {
    // Target state
    targetType,
    targetId,

    // UI state
    uiState,

    // Form state
    thumbnailFileId,
    livestreamTitle,
    livestreamDescription,
    productTags,
    pinnedProductId,
    isEnabledProductTag,

    // Community data
    community,

    // Livestream data
    room,
    roomLinkedPost,
    roomPost,
    channel,
    broadcasterData,

    // Loading states
    isCreating,
    isEnding,
    isGettingLiveChat,
    isGettingBroadcasterData,

    // Computed states
    isTargetEvent,
    isGoLiveButtonDisabled,

    // Handlers
    setLivestreamTitle,
    setLivestreamDescription,
    setThumbnailFileId,
    setProductTags,
    setPinnedProductId,
    setUiState,

    stopRoom,
    handleTargetSelection,
    handleStopRoom,
    handleGoLive,
  };
};
