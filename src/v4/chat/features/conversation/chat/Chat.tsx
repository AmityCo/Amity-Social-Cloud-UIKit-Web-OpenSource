import { Header } from '~/v4/chat/features/conversation/chat/components/Header/Header';
import { MessageList } from '~/v4/chat/features/shared/components/MessageList/MessageList';
import { ImageViewer } from '~/v4/chat/features/shared/components/ImageViewer/ImageViewer';
import { VideoPlayer } from '~/v4/chat/features/shared/components/VideoPlayer/VideoPlayer';
import { MessageComposer } from '~/v4/chat/features/shared/components/MessageComposer/MessageComposer';
import { MutedBanner } from '~/v4/chat/features/shared/components/MutedBanner/MutedBanner';
import { MessageActionsPopover } from '~/v4/chat/features/shared/components/MessageActionsPopover';
import { MessageFullTextScreen } from '~/v4/chat/features/shared/components/MessageFullTextScreen';
import { useChat } from '~/v4/chat/features/conversation/chat/hooks/useChat';
import type { ChatPageProps } from '~/v4/chat/pages/ChatPage';
import styles from './Chat.module.css';

export function Chat(props: ChatPageProps) {
  const {
    items,
    isLoadingFirstPage,
    isLoading,
    hasMore,
    loadMore,
    hasPrev,
    loadPrev,
    otherUser,
    atBottom,
    setAtBottom,
    latestMessage,
    newMessage,
    clearNewMessage,
    seeMore,
    handleBack,
    openSeeMore,
    closeSeeMore,
    openImageViewer,
    openVideoPlayer,
    imageViewerProps,
    videoPlayerProps,
    showMutedBanner,
    mutedVariant,
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
    openFailedSheet,
    conversationActions,
    viewerIsMutedInChannel,
    pendingJumpToMessageId,
    clearJumpToMessageId,
  } = useChat(props);

  return (
    <div className={styles.chat}>
      <Header
        userId={otherUser.userId}
        userDisplayName={otherUser.userDisplayName}
        onBack={handleBack}
        actions={conversationActions}
      />
      <MessageList
        items={items}
        isLoadingFirstPage={isLoadingFirstPage}
        isLoading={isLoading}
        hasMore={hasMore}
        loadMore={loadMore}
        hasPrev={hasPrev}
        loadPrev={loadPrev}
        atBottom={atBottom}
        onAtBottomChange={setAtBottom}
        latestMessage={latestMessage}
        newMessage={newMessage}
        onClearNewMessage={clearNewMessage}
        onOpenImage={openImageViewer}
        onOpenVideo={openVideoPlayer}
        onOpenFailedSheet={openFailedSheet}
        onOpenBubbleMenu={openBubbleMenu}
        onOpenReactorList={handleOpenReactorListSheet}
        isBubbleMenuOpen={!!bubbleMenu}
        activeMessageId={bubbleMenu?.message.messageId}
        onSeeMore={openSeeMore}
        isJustCreated={props.isJustCreated}
        pendingUploads={composer.pendingUploads}
        syntheticPendingCount={composer.syntheticMessages.length}
        onMediaLoaded={composer.handleMediaLoaded}
        onCancelUpload={composer.handleCancelUpload}
        jumpToMessageId={pendingJumpToMessageId}
        onJumpToMessageHandled={clearJumpToMessageId}
      />
      {showMutedBanner ? (
        <MutedBanner variant={mutedVariant} />
      ) : (
        <MessageComposer
          composer={composer}
          onOpenSeeMore={openSeeMore}
          onOpenImage={openImageViewer}
          onOpenVideo={openVideoPlayer}
        />
      )}

      {imageViewerProps ? <ImageViewer {...imageViewerProps} /> : null}
      {videoPlayerProps ? <VideoPlayer {...videoPlayerProps} /> : null}
      {seeMore ? (
        <MessageFullTextScreen text={seeMore.text} title={seeMore.title} onClose={closeSeeMore} />
      ) : null}

      {bubbleMenu && !imageViewerProps && !videoPlayerProps ? (
        <MessageActionsPopover
          anchor={bubbleMenu.anchor}
          message={bubbleMenu.message}
          handlers={{
            onEdit: handleBubbleEdit,
            onReply: handleBubbleReply,
            onDelete: handleBubbleDelete,
            onCopy: handleBubbleCopy,
            onSave: handleBubbleSave,
            onReport: handleBubbleReport,
          }}
          onDismiss={closeBubbleMenu}
          viewerIsMutedInChannel={viewerIsMutedInChannel}
        />
      ) : null}
    </div>
  );
}
