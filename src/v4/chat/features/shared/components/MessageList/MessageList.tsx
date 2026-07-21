import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { Loader } from '~/v4/core/design/atoms/Loader';
import { DateSeparator } from '~/v4/chat/features/shared/components/DateSeparator/DateSeparator';
import { MessageBubble } from '~/v4/chat/features/shared/components/MessageBubble/MessageBubble';
import { MessageRow } from '~/v4/chat/features/shared/components/MessageRow/MessageRow';
import { NewMessageNotification } from '~/v4/chat/features/shared/components/NewMessageNotification/NewMessageNotification';
import { ScrollToLatestButton } from '~/v4/chat/features/shared/components/ScrollToLatestButton/ScrollToLatestButton';
import {
  isSyntheticPendingMessage,
  type PendingUpload,
} from '~/v4/chat/features/shared/hooks/useMessageComposer';
import { AT_BOTTOM_TOLERANCE_PX, PAGE_TOP_TRIGGER_INDEX } from '~/v4/chat/constants';
import type { ChatItem } from '~/v4/chat/utils/groupMessagesByDate';
import styles from './MessageList.module.css';

type MessageListProps = {
  items: ChatItem[];
  isLoadingFirstPage: boolean;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  hasPrev?: boolean;
  loadPrev?: () => void;
  onAtBottomChange: (atBottom: boolean) => void;
  onOpenImage: (url: string, message: Amity.Message) => void;
  onOpenVideo: (message: Amity.Message) => void;
  onOpenFailedSheet: (message: Amity.Message) => void;
  onOpenBubbleMenu?: (message: Amity.Message, anchor: HTMLElement) => void;
  onOpenReactorList: (message: Amity.Message) => void;
  isBubbleMenuOpen?: boolean;
  activeMessageId?: string | null;
  onSeeMore: (text: string) => void;
  newMessage: Amity.Message | null;
  onClearNewMessage: () => void;
  latestMessage: Amity.Message | null;
  atBottom: boolean;
  isJustCreated?: boolean;
  isGroupChat?: boolean;
  moderatorIds?: Set<string>;
  pendingUploads?: PendingUpload[];
  syntheticPendingCount?: number;
  onMediaLoaded?: (fileId: string) => void;
  onCancelUpload?: (clientId: string) => void;
  jumpToMessageId?: string | null;
  onJumpToMessageHandled?: () => void;
};

export function MessageList({
  items,
  isLoadingFirstPage,
  isLoading,
  hasMore,
  loadMore,
  hasPrev = false,
  loadPrev,
  onAtBottomChange,
  onOpenImage,
  onOpenVideo,
  onOpenFailedSheet,
  onOpenBubbleMenu,
  onOpenReactorList,
  isBubbleMenuOpen = false,
  activeMessageId = null,
  onSeeMore,
  newMessage,
  onClearNewMessage,
  latestMessage,
  atBottom,
  isJustCreated,
  isGroupChat = false,
  moderatorIds,
  pendingUploads,
  syntheticPendingCount = 0,
  onMediaLoaded,
  onCancelUpload,
  jumpToMessageId,
  onJumpToMessageHandled,
}: MessageListProps) {
  const { currentUserId } = useSDK();
  const [isScrollable, setIsScrollable] = useState(false);
  const [bouncingMessageId, setBouncingMessageId] = useState<string | null>(null);
  const [isLoadingPrev, setIsLoadingPrev] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const prevScrollHeightRef = useRef<number | null>(null);
  const prevLengthRef = useRef<number>(0);
  const hasDoneInitialScrollRef = useRef<boolean>(false);
  const prevLatestIdRef = useRef<string | null>(null);
  const prevPendingCountRef = useRef<number>(0);
  const rowRefsByMessageId = useRef<Map<string, HTMLDivElement>>(new Map());
  const lastBouncedJumpIdRef = useRef<string | null>(null);
  const prevHasPrevRef = useRef<boolean>(hasPrev);

  const mountScrollEl = useCallback((node: HTMLDivElement | null) => {
    scrollRef.current = node;
  }, []);

  const pendingPreviewByFileId = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of pendingUploads ?? []) {
      if (p.fileId) m.set(p.fileId, p.previewUrl);
    }
    return m;
  }, [pendingUploads]);

  const pendingPreviewByClientId = useMemo(() => {
    const m = new Map<string, string>();
    for (const p of pendingUploads ?? []) {
      m.set(p.clientId, p.previewUrl);
    }
    return m;
  }, [pendingUploads]);

  const renderItems = useMemo<ChatItem[]>(() => {
    return [...items].reverse();
  }, [items]);

  const scrollToLatest = useCallback(() => {
    if (!scrollRef.current || renderItems.length === 0) return;
    scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [renderItems.length]);

  useLayoutEffect(() => {
    if (prevScrollHeightRef.current !== null && scrollRef.current) {
      const newHeight = scrollRef.current.scrollHeight;
      const diff = newHeight - prevScrollHeightRef.current;
      if (diff > 0) scrollRef.current.scrollTop += diff;
      prevScrollHeightRef.current = null;
    }
    prevLengthRef.current = renderItems.length;
  }, [renderItems.length]);

  useLayoutEffect(() => {
    if (hasDoneInitialScrollRef.current) return;
    if (!scrollRef.current) return;
    if (renderItems.length === 0) return;
    if (jumpToMessageId) return;

    requestAnimationFrame(() => {
      if (!scrollRef.current) return;
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      requestAnimationFrame(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        hasDoneInitialScrollRef.current = true;
      });
    });
  }, [renderItems.length, isJustCreated, jumpToMessageId]);

  useEffect(() => {
    if (!jumpToMessageId) return;
    if (lastBouncedJumpIdRef.current === jumpToMessageId) return;
    if (renderItems.length === 0) return;
    const node = rowRefsByMessageId.current.get(jumpToMessageId);
    if (node) {
      node.scrollIntoView({ block: 'center' });
      hasDoneInitialScrollRef.current = true;
      lastBouncedJumpIdRef.current = jumpToMessageId;
      setBouncingMessageId(jumpToMessageId);
    } else if (!isLoading && !isLoadingFirstPage && !hasMore) {
      lastBouncedJumpIdRef.current = jumpToMessageId;
      onJumpToMessageHandled?.();
    }
  }, [
    jumpToMessageId,
    renderItems.length,
    isLoading,
    isLoadingFirstPage,
    hasMore,
    onJumpToMessageHandled,
  ]);

  useEffect(() => {
    if (!bouncingMessageId) return;
    const timer = setTimeout(() => setBouncingMessageId(null), 1000);
    return () => clearTimeout(timer);
  }, [bouncingMessageId]);

  useEffect(() => {
    const currentId = latestMessage?.messageId ?? null;
    const prevId = prevLatestIdRef.current;
    prevLatestIdRef.current = currentId;
    const wasHasPrev = prevHasPrevRef.current;
    prevHasPrevRef.current = hasPrev;
    if (!currentId || !prevId || currentId === prevId) return;
    if (hasPrev) return;
    if (wasHasPrev) return;
    const isOwnMessage = latestMessage?.creatorId === currentUserId;
    if (isOwnMessage) {
      requestAnimationFrame(() => {
        if (!scrollRef.current) return;
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        requestAnimationFrame(() => {
          if (!scrollRef.current) return;
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        });
      });
      return;
    }
    if (!atBottom) return;
    scrollToLatest();
  }, [
    latestMessage?.messageId,
    latestMessage?.creatorId,
    atBottom,
    scrollToLatest,
    currentUserId,
    hasPrev,
  ]);

  useEffect(() => {
    if (!isLoading) setIsLoadingPrev(false);
  }, [isLoading]);

  useEffect(() => {
    if (syntheticPendingCount > prevPendingCountRef.current && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    prevPendingCountRef.current = syntheticPendingCount;
  }, [syntheticPendingCount]);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const atBottomNow = el.scrollTop + el.clientHeight >= el.scrollHeight - AT_BOTTOM_TOLERANCE_PX;
    onAtBottomChange(atBottomNow);
    setIsScrollable(el.scrollHeight > el.clientHeight);

    const nearTop = el.scrollTop <= PAGE_TOP_TRIGGER_INDEX;
    const shouldPage = nearTop && hasMore && !isLoading && !isLoadingFirstPage;

    if (shouldPage) {
      prevScrollHeightRef.current = el.scrollHeight;
      loadMore();
    }

    const shouldPagePrev = atBottomNow && hasPrev && !isLoading && !isLoadingFirstPage && loadPrev;
    if (shouldPagePrev) {
      setIsLoadingPrev(true);
      loadPrev();
    }
  }, [hasMore, hasPrev, isLoading, isLoadingFirstPage, loadMore, loadPrev, onAtBottomChange]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    setIsScrollable(el.scrollHeight > el.clientHeight);
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  function handleOverlayPress() {
    scrollToLatest();
    onClearNewMessage();
  }

  const showNotification = !atBottom && !!newMessage;
  const showScrollButton = !atBottom && !newMessage && isScrollable;

  return (
    <div className={styles.messageList} role="log" aria-live="polite">
      <div ref={mountScrollEl} className={styles.messageList__scroll}>
        {isLoading && !isLoadingFirstPage ? (
          <div className={styles.messageList__topLoader}>
            <Loader.Spinner size="sm" />
          </div>
        ) : null}

        <div className={styles.messageList__virtualArea}>
          {renderItems.map((item) => {
            const isBouncing =
              item.kind === 'message' && item.message.messageId === bouncingMessageId;
            const rowClassName = isBouncing
              ? `${styles.messageList__row} ${styles.messageList__bounce}`
              : styles.messageList__row;
            return (
              <div
                key={item.id}
                className={rowClassName}
                ref={(node) => {
                  if (item.kind !== 'message') return;
                  const id = item.message.messageId;
                  if (node) {
                    rowRefsByMessageId.current.set(id, node);
                  } else {
                    rowRefsByMessageId.current.delete(id);
                  }
                }}
              >
                {item.kind === 'date' ? (
                  <DateSeparator label={item.label} />
                ) : (
                  (() => {
                    const isUserMsg = item.message.creatorId === currentUserId;
                    const isMemberModerator =
                      !isUserMsg && isGroupChat && !!moderatorIds?.has(item.message.creatorId);
                    const messageFileId =
                      (item.message.data as { fileId?: string } | undefined)?.fileId ??
                      (item.message as unknown as { fileId?: string }).fileId;
                    const localPreviewUrl = isSyntheticPendingMessage(item.message)
                      ? pendingPreviewByClientId.get(item.message.__syntheticClientId)
                      : messageFileId
                        ? pendingPreviewByFileId.get(messageFileId)
                        : undefined;
                    const canOpenMenu =
                      !isSyntheticPendingMessage(item.message) &&
                      item.message.syncState === ('synced' as Amity.SyncState) &&
                      !item.message.isDeleted;
                    return (
                      <MessageRow
                        message={item.message}
                        isUser={isUserMsg}
                        isGroupChat={isGroupChat}
                        isModerator={isMemberModerator}
                        bubble={
                          <MessageBubble
                            message={item.message}
                            isUser={isUserMsg}
                            isActive={item.message.messageId === activeMessageId}
                            onOpenImage={onOpenImage}
                            onOpenVideo={onOpenVideo}
                            onSeeMore={onSeeMore}
                            onLongPress={canOpenMenu ? onOpenBubbleMenu : undefined}
                            localPreviewUrl={localPreviewUrl}
                            onMediaLoaded={onMediaLoaded}
                            onCancelUpload={onCancelUpload}
                          />
                        }
                        onOpenFailedSheet={onOpenFailedSheet}
                        onOpenSeeMore={onSeeMore}
                        onOpenImage={onOpenImage}
                        onOpenVideo={onOpenVideo}
                        onOpenReactorList={onOpenReactorList}
                        isBubbleMenuOpen={isBubbleMenuOpen}
                      />
                    );
                  })()
                )}
              </div>
            );
          })}
        </div>

        {isLoadingPrev && !isLoadingFirstPage ? (
          <div className={styles.messageList__bottomLoader}>
            <Loader.Spinner size="sm" />
          </div>
        ) : null}
      </div>

      {showNotification && newMessage ? (
        <NewMessageNotification message={newMessage} onPress={handleOverlayPress} />
      ) : null}
      {showScrollButton ? <ScrollToLatestButton onPress={handleOverlayPress} /> : null}
    </div>
  );
}
