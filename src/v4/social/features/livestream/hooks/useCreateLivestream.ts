import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
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
  livestreamPost?: Amity.Post | null;
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
  handleGoLive: () => void;
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
  const [livestreamTitle, setLivestreamTitle] = useState('');
  const [livestreamDescription, setLivestreamDescription] = useState('');
  const [thumbnailFileId, setThumbnailFileId] = useState('');
  const [productTags, setProductTags] = useState<Amity.MediaProductTag[]>([]);
  const [pinnedProductId, setPinnedProductId] = useState<string | undefined>(undefined);
  const [roomId, setRoomId] = useState<string | undefined>(event?.room?.roomId);

  const { room } = useRoom(roomId);

  const { productCatalogueSettings, refetchProductCatalogueSettings } =
    useProductCatalogueSettings();

  const [isEnabledProductTag, setIsEnabledProductTag] = useState(
    productCatalogueSettings?.product.enabled,
  );

  useEffect(() => {
    if (productCatalogueSettings) {
      setIsEnabledProductTag(productCatalogueSettings.product.enabled);
    }
  }, [productCatalogueSettings?.product.enabled]);

  const { post: livestreamPost } = usePostSubscription(
    event?.room?.post?.postId ?? room?.post?.postId,
  );

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
          livestreamPost?.postId && goToPostDetailPage({ postId: livestreamPost?.postId });
        else onBack();
      },
      onError: (error) => {
        if (error.message.includes('Room is already ended')) {
          if (!isTargetEvent)
            livestreamPost?.postId && goToPostDetailPage({ postId: livestreamPost?.postId });
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
        okText: 'End',
        cancelText: 'Cancel',
        title: 'End live stream?',
        pageId,
        content: 'If you end your live stream, it will also end for all your viewers.',
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
        okText: 'Discard',
        cancelText: 'Cancel',
        title: 'Unsaved changes',
        pageId,
        content:
          'Are you sure you want to discard the changes? They will be lost when you leave this page.',
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

  const goLiveOnEvent = (room?: Amity.Room) => {
    if (!room) return;
    getBroadcasterData(room.roomId);
  };

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
      okText: 'Go live',
      cancelText: 'Edit live',
      title: 'Product tagging isn’t available',
      pageId,
      content: 'Any products you’ve tagged will be removed and won’t be shown to viewers.',
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

  const handleGoLive = () => {
    isTargetEvent ? goLiveOnEvent(event.room) : checkAvailableProductTags();
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
    livestreamPost,
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
