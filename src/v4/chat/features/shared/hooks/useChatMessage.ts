import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNetworkState } from 'react-use';
import { useMessageCollection } from '~/v4/chat/hooks/collections/useMessageCollection';
import { useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useString } from '~/v4/core/localization';
import { groupMessagesByDate, type ChatItem } from '~/v4/chat/utils/groupMessagesByDate';
import { useMarkAsRead } from './useMarkAsRead';
import { useMessageComposer } from './useMessageComposer';
import { useBubbleMenu } from './useBubbleMenu';
import { useFailedMessageSheet } from './useFailedMessageSheet';
import { useMediaViewer } from './useMediaViewer';

type UseChatMessageParams = {
  channelId: string | undefined;
  isJustCreated?: boolean;
  loadingToastIdPrefix: string;
  enableMention?: boolean;
  viewerIsMutedInChannel?: boolean;
  jumpToMessageId?: string;
};

export function useChatMessage({
  channelId,
  isJustCreated,
  loadingToastIdPrefix,
  enableMention = false,
  viewerIsMutedInChannel = false,
  jumpToMessageId,
}: UseChatMessageParams) {
  const { pop } = useChatNavigation();
  const { online: isOnline } = useNetworkState();
  const { loading, remove, error: errorToast } = useNotifications('chat');
  const { currentUserId } = useSDK();
  const loadingToast = useString('amity_chat_loading_label');
  const loadErrorToast = useString('amity_chat_load_error');
  const loadingToastIdRef = useRef<string | null>(null);
  const prevLatestIdRef = useRef<string | null>(null);
  const [atBottom, setAtBottom] = useState(true);
  const [seeMore, setSeeMore] = useState<{ text: string; title?: string } | null>(null);
  const [newMessage, setNewMessage] = useState<Amity.Message | null>(null);
  const [editingMessage, setEditingMessage] = useState<Amity.Message | null>(null);
  const [pendingJumpToMessageId, setPendingJumpToMessageId] = useState<string | null>(
    jumpToMessageId ?? null,
  );

  const clearJumpToMessageId = useCallback(() => {
    setPendingJumpToMessageId(null);
  }, []);

  const {
    messages,
    isLoadingFirstPage,
    isLoading,
    hasMore,
    loadMore,
    hasPrev,
    loadPrev,
    error: loadError,
  } = useMessageCollection({
    subChannelId: channelId ?? '',
    limit: 20,
    includeDeleted: true,
    sortBy: 'segmentDesc',
    aroundMessageId: pendingJumpToMessageId ?? undefined,
  });

  function openEditMessage(message: Amity.Message) {
    setEditingMessage(message);
  }

  function closeEditMessage() {
    setEditingMessage(null);
  }

  const composer = useMessageComposer({
    subChannelId: channelId ?? '',
    enableMention,
    editingMessage,
    onEditCompleted: closeEditMessage,
  });

  const items: ChatItem[] = useMemo(() => {
    const base = groupMessagesByDate(messages ?? []);
    if (composer.syntheticMessages.length === 0) return base;
    return [
      ...composer.syntheticMessages
        .slice()
        .reverse()
        .map((message) => ({
          kind: 'message' as const,
          id: `synthetic-${message.__syntheticClientId}`,
          message: message as unknown as Amity.Message,
        })),
      ...base,
    ];
  }, [messages, composer.syntheticMessages]);

  const latestMessage = messages && messages.length > 0 ? messages[0] : null;

  const {
    bubbleMenu,
    openBubbleMenu,
    closeBubbleMenu,
    handleBubbleDelete,
    handleBubbleEdit,
    handleBubbleReply,
    handleBubbleCopy,
    handleBubbleSave,
    handleBubbleReport,
    handleOpenReactorListSheet,
  } = useBubbleMenu({
    onEditMessage: openEditMessage,
    onReplyMessage: composer.startReply,
    viewerIsMutedInChannel,
  });

  const { openFailedSheet } = useFailedMessageSheet({
    onRetryUpload: composer.handleRetryUpload,
    onDiscardUpload: composer.handleDiscardUpload,
    onRetryText: composer.handleRetryText,
    onDiscardText: composer.handleDiscardText,
  });

  const { openImageViewer, openVideoPlayer, imageViewerProps, videoPlayerProps } = useMediaViewer();

  useMarkAsRead({
    latestMessage,
    atBottom,
    enabled: !!channelId && !!latestMessage,
  });

  useEffect(() => {
    if (isJustCreated) return;
    if (!channelId) return;
    if (isLoadingFirstPage) {
      if (loadingToastIdRef.current) return;
      const id = `${loadingToastIdPrefix}-${channelId}-${Date.now()}`;
      loadingToastIdRef.current = id;
      loading({ id, content: loadingToast, duration: 60_000, alignment: 'with-composer' });
      return;
    }
    if (loadingToastIdRef.current) {
      remove(loadingToastIdRef.current);
      loadingToastIdRef.current = null;
    }
  }, [channelId, isJustCreated, isLoadingFirstPage, loading, remove, loadingToastIdPrefix]);

  useEffect(() => {
    return () => {
      if (loadingToastIdRef.current) {
        remove(loadingToastIdRef.current);
        loadingToastIdRef.current = null;
      }
    };
  }, [remove]);

  useEffect(() => {
    if (loadError) {
      errorToast({ content: loadErrorToast });
    }
  }, [loadError, errorToast, loadErrorToast]);

  useEffect(() => {
    const currentId = latestMessage?.messageId ?? null;
    const prevId = prevLatestIdRef.current;
    prevLatestIdRef.current = currentId;
    if (!currentId || !prevId || currentId === prevId) return;
    if (atBottom) return;
    if (latestMessage?.creatorId === undefined) return;
    setNewMessage(latestMessage);
  }, [latestMessage?.messageId, atBottom, latestMessage]);

  useEffect(() => {
    if (atBottom) setNewMessage(null);
  }, [atBottom]);

  function clearNewMessage() {
    setNewMessage(null);
  }

  function openSeeMore(text: string, title?: string) {
    setSeeMore({ text, title });
  }

  function closeSeeMore() {
    setSeeMore(null);
  }

  return {
    currentUserId,
    items,
    isLoadingFirstPage: !!channelId && isLoadingFirstPage,
    isLoading,
    hasMore,
    loadMore,
    hasPrev,
    loadPrev,
    latestMessage,
    isOnline: isOnline !== false,
    atBottom,
    setAtBottom,
    seeMore,
    openSeeMore,
    closeSeeMore,
    newMessage,
    clearNewMessage,
    viewerIsMutedInChannel,
    handleBack: pop,
    composer,
    bubbleMenu,
    openBubbleMenu,
    closeBubbleMenu,
    handleBubbleDelete,
    handleBubbleEdit,
    handleBubbleReply,
    handleBubbleCopy,
    handleBubbleSave,
    handleBubbleReport,
    handleOpenReactorListSheet,
    editingMessage,
    closeEditMessage,
    openFailedSheet,
    openImageViewer,
    openVideoPlayer,
    imageViewerProps,
    videoPlayerProps,
    pendingJumpToMessageId,
    clearJumpToMessageId,
  };
}
