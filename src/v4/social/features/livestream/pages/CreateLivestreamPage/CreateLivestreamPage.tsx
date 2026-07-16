import React from 'react';
import styles from './CreateLivestream.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { PAGE_ID } from '~/v4/constants/customization';
import { useDeviceManagement } from '~/v4/core/hooks/useDeviceManagement';
import {
  useCreateLivestream,
  useReadOnlySetting,
  useCoHostParticipantEvents,
  useAssignCoHostModerator,
  usePostSubscription,
} from '~/v4/social/features/livestream/hooks';
import { LivestreamStage } from '~/v4/social/features/livestream/internal-components/LivestreamStage';
import { LivestreamSetup } from '~/v4/social/features/livestream/internal-components/LivestreamSetup';
import { LivestreamDataProvider } from '~/v4/social/features/livestream/providers';
import { LivestreamChat } from '~/v4/social/features/livestream/internal-components/LivestreamChat';
import { useForceDarkTheme } from '~/v4/core/hooks/useForceDarkTheme';
import useSDK from '~/v4/core/hooks/useSDK';

export type CreateLivestreamPageProps = {
  targetType: 'community' | 'user';
  targetId: string | null;
  event?: Amity.Event;
};

export function CreateLivestreamPage({
  targetType: initialTargetType,
  targetId: initialTargetId,
  event,
}: CreateLivestreamPageProps) {
  const pageId = PAGE_ID.CREATE_LIVESTREAM_PAGE;
  const { currentUserId } = useSDK();
  const { themeStyles } = useAmityPage({
    pageId,
  });

  // Force dark theme for this page
  useForceDarkTheme();

  const deviceManagement = useDeviceManagement();

  const {
    targetId,
    targetType,
    uiState,
    livestreamTitle,
    livestreamDescription,
    community,
    isTargetEvent,
    isGoLiveButtonDisabled,
    isCreating,
    isGettingLiveChat,
    isGettingBroadcasterData,
    isEnding,
    // Livestream data from consolidated hook
    room,
    livestreamPost,
    channel,
    broadcasterData,
    // Handlers
    handleStopRoom,
    handleTargetSelection,
    handleGoLive,
    stopRoom,
    setLivestreamTitle,
    setLivestreamDescription,
    setThumbnailFileId,
    productTags,
    setProductTags,
    pinnedProductId,
    setPinnedProductId,
    isEnabledProductTag,
  } = useCreateLivestream({
    initialTargetId: initialTargetId ?? currentUserId!,
    initialTargetType,
    pageId,
    microphonePermission: deviceManagement.microphonePermission,
    cameraPermission: deviceManagement.cameraPermission,
    event,
  });

  const { readOnly, setReadOnly } = useReadOnlySetting({ channel });
  const isShowLivestreamChat = channel && livestreamPost && community && room;
  const notificationAlignment = isShowLivestreamChat ? 'livestreamWithChat' : 'fullscreen';
  const { post: childPost } = usePostSubscription(livestreamPost?.childrenPosts[0]?.postId);

  useCoHostParticipantEvents({ room, notificationAlignment, mode: 'host' });

  // As the host, grant the co-host the channel-moderator role on the live chat
  // so their moderation actions (promote/demote/mute/delete) don't 403 (PDT-3908).
  useAssignCoHostModerator({ room, channel });

  return (
    <LivestreamDataProvider
      room={room}
      channel={channel}
      parentPost={livestreamPost}
      livestreamPost={childPost as Amity.Post<'room'>}
      notificationAlignment={notificationAlignment}
    >
      <ModalOverlay className={styles.createLivestream__overlay} style={themeStyles} isOpen={true}>
        <Modal className={styles.createLivestream}>
          <Dialog
            className={styles.createLivestream__dialog}
            data-no-chat={uiState === 'broadcast' && !channel}
          >
            <LivestreamStage
              pageId={pageId}
              event={event}
              targetType={targetType}
              targetId={targetId}
              uiState={uiState}
              community={community}
              readOnly={readOnly}
              setReadOnly={setReadOnly}
              onClose={stopRoom}
              onTargetSelection={handleTargetSelection}
              onStreamEnd={() => room?.roomId && handleStopRoom(room.roomId)}
              deviceManagement={deviceManagement}
              isStarting={isCreating || isGettingLiveChat || isGettingBroadcasterData}
              isEnding={isEnding}
              broadcasterData={broadcasterData}
            />
            <div className={styles.createLivestream__rightSection__wrapper}>
              {uiState === 'preview' ? (
                <LivestreamSetup
                  isTargetEvent={isTargetEvent}
                  isPending={isCreating || isGettingLiveChat || isGettingBroadcasterData}
                  isEnabledProductTag={isEnabledProductTag}
                  isGoLiveButtonDisabled={isGoLiveButtonDisabled}
                  targetType={targetType}
                  livestreamTitle={livestreamTitle}
                  livestreamDescription={livestreamDescription}
                  readOnly={readOnly}
                  pageId={pageId}
                  setLivestreamTitle={setLivestreamTitle}
                  setLivestreamDescription={setLivestreamDescription}
                  setReadOnly={setReadOnly}
                  onGoLive={() => handleGoLive({ readOnly })}
                  onThumbnailFileIdChanged={(fileId) => setThumbnailFileId(fileId ?? '')}
                  productTags={productTags}
                  onProductTagsChange={setProductTags}
                  pinnedProductId={pinnedProductId}
                  onPinnedProductIdChange={setPinnedProductId}
                />
              ) : (
                <>
                  {isShowLivestreamChat && (
                    <LivestreamChat
                      pageId={pageId}
                      community={community}
                      isLoading={isCreating || isGettingLiveChat}
                      disabled={isEnding}
                    />
                  )}
                </>
              )}
            </div>
          </Dialog>
        </Modal>
      </ModalOverlay>
    </LivestreamDataProvider>
  );
}
