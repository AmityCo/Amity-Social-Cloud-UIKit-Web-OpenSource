import { MessageList } from '~/v4/chat/features/shared/components/MessageList/MessageList';
import { ImageViewer } from '~/v4/chat/features/shared/components/ImageViewer/ImageViewer';
import { VideoPlayer } from '~/v4/chat/features/shared/components/VideoPlayer/VideoPlayer';
import { MessageComposer } from '~/v4/chat/features/shared/components/MessageComposer/MessageComposer';
import { MutedBanner } from '~/v4/chat/features/shared/components/MutedBanner/MutedBanner';
import { MessageActionsPopover } from '~/v4/chat/features/shared/components/MessageActionsPopover';
import { MessageFullTextScreen } from '~/v4/chat/features/shared/components/MessageFullTextScreen';
import { Header } from '~/v4/chat/features/group/chat/components/Header/Header';
import { BannedEmptyState } from '~/v4/chat/features/group/chat/components/BannedEmptyState';
import { useGroupChat } from '~/v4/chat/features/group/chat/hooks/useGroupChat';
import { useVisualViewportHeight } from '~/v4/chat/features/shared/hooks';
import type { GroupChatPageProps } from '~/v4/chat/pages/GroupChatPage';
import styles from './GroupChat.module.css';

export function GroupChat(props: GroupChatPageProps) {
  const {
    items,
    isLoadingFirstPage,
    isLoading,
    hasMore,
    loadMore,
    hasPrev,
    loadPrev,
    atBottom,
    setAtBottom,
    latestMessage,
    newMessage,
    clearNewMessage,
    seeMore,
    channel,
    channelDisplayName,
    isBanned,
    moderatorIds,
    handleBack,
    handleOpenSettings,
    openImageViewer,
    openVideoPlayer,
    imageViewerProps,
    videoPlayerProps,
    openSeeMore,
    closeSeeMore,
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
    viewerIsMutedInChannel,
    isModerator,
    pendingJumpToMessageId,
    clearJumpToMessageId,
  } = useGroupChat(props);

  const viewport = useVisualViewportHeight();
  const viewportStyle = viewport
    ? { height: `${viewport.height}px`, top: `${viewport.offsetTop}px` }
    : undefined;

  if (isBanned) {
    return (
      <div className={styles.groupChat} style={viewportStyle}>
        <Header
          variant="banned"
          channel={channel}
          channelDisplayName={channelDisplayName}
          onBack={handleBack}
          onOpenSettings={handleOpenSettings}
        />
        <BannedEmptyState />
      </div>
    );
  }

  return (
    <div className={styles.groupChat} style={viewportStyle}>
      <Header
        channel={channel}
        onBack={handleBack}
        onOpenSettings={handleOpenSettings}
        channelDisplayName={channelDisplayName}
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
        isGroupChat
        moderatorIds={moderatorIds}
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
          viewerIsModerator={isModerator}
        />
      ) : null}
    </div>
  );
}
