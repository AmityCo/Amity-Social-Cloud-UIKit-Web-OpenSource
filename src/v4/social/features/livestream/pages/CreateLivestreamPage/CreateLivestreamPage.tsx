import React, { useEffect, useRef } from 'react';
import styles from './CreateLivestream.module.css';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { Dialog, Modal, ModalOverlay } from 'react-aria-components';
import { PAGE_ID } from '~/v4/constants/customization';
import { useDeviceManagement } from '~/v4/core/hooks/useDeviceManagement';
import { useCreateLivestream, useReadOnlySetting } from '~/v4/social/features/livestream/hooks';
import { LivestreamStage } from '~/v4/social/features/livestream/internal-components/LivestreamStage';
import { LivestreamSetup } from '~/v4/social/features/livestream/internal-components/LivestreamSetup';
import { LivestreamDataProvider } from '~/v4/social/features/livestream/providers';
import { LivestreamChat } from '~/v4/social/features/livestream/internal-components/LivestreamChat';
import { useForceDarkTheme } from '~/v4/core/hooks/useForceDarkTheme';
import useSDK from '~/v4/core/hooks/useSDK';
import { RoomRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { getRoomParticipant } from '~/v4/social/features/livestream/utils';

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
  const { success } = useNotifications();
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
  } = useCreateLivestream({
    initialTargetId: initialTargetId ?? currentUserId!,
    initialTargetType,
    pageId,
    microphonePermission: deviceManagement.microphonePermission,
    cameraPermission: deviceManagement.cameraPermission,
    event,
  });

  const coHostJoinedRef = useRef<boolean>(false);
  const { readOnly, setReadOnly } = useReadOnlySetting({ room, channel });
  const isShowLivestreamChat = channel && livestreamPost && community && room;
  const notificationAlignment = isShowLivestreamChat ? 'livestreamWithChat' : 'fullscreen';

  useEffect(() => {
    const unsubscriber: Amity.Unsubscriber[] = [];
    if (room?.status === 'live') {
      unsubscriber.push(
        RoomRepository.onRoomParticipantLeft(({ actorInternalId }) => {
          const coHostInternalId = getRoomParticipant(room, 'coHost')?.userInternalId;
          if (coHostInternalId !== actorInternalId) return;
          if (coHostJoinedRef.current)
            success({
              content: 'Co-host left the live stream.',
              alignment: notificationAlignment,
            });
          else
            success({
              content: 'Co-host left the stage.',
              alignment: notificationAlignment,
            });

          coHostJoinedRef.current = false;
        }),
      );

      unsubscriber.push(
        RoomRepository.onRoomParticipantStageJoined(({ room }) => {
          if (getRoomParticipant(room, 'coHost')) coHostJoinedRef.current = true;
        }),
      );
    }

    return () => unsubscriber.forEach((fn) => fn());
  }, [room]);

  return (
    <LivestreamDataProvider
      room={room}
      channel={channel}
      livestreamPost={livestreamPost}
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
                  targetType={targetType}
                  livestreamTitle={livestreamTitle}
                  livestreamDescription={livestreamDescription}
                  readOnly={readOnly}
                  isPending={isCreating || isGettingLiveChat || isGettingBroadcasterData}
                  isGoLiveButtonDisabled={isGoLiveButtonDisabled}
                  pageId={pageId}
                  setLivestreamTitle={setLivestreamTitle}
                  setLivestreamDescription={setLivestreamDescription}
                  setReadOnly={setReadOnly}
                  onGoLive={handleGoLive}
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
