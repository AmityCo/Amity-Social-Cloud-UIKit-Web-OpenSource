import React, { FC, useCallback, useEffect, useState } from 'react';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Popover } from '~/v4/core/components/AriaPopover/Popover';
import useSDK from '~/v4/core/hooks/useSDK';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import { useDeleteMessage } from '~/v4/chat/hooks/useDeleteMessage';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { ContentReportReason } from '~/v4/core/internal-components/ContentReportReason';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import { LivestreamModerationOptions } from '~/v4/social/features/livestream/internal-components/LivestreamModerationOptions';
import { useLivestreamModeration } from '~/v4/social/features/livestream/hooks/useLivestreamModeration';
import { MessageOptions } from '~/v4/chat/internal-components/MessageOptions';
import styles from './MessageBubble.module.css';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import Bin from '~/v4/icons/Bin';
import { HostBadge } from '~/v4/social/elements/HostBadge';
import { CoHostBadge } from '~/v4/social/elements/CoHostBadge';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import { useCreateInvitation } from '~/v4/social/features/livestream/hooks';

interface MessageBubbleProps {
  pageId?: string;
  componentId?: string;
  message: Amity.Message<'text'>;
  isJoinedCommunity?: boolean;
  channel?: Amity.Channel | null;
}

export const MessageBubble: FC<MessageBubbleProps> = ({
  pageId = '*',
  componentId = '*',
  message,
  isJoinedCommunity,
  channel,
}) => {
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();

  const { currentUserId } = useSDK();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { isModerator } = useChannelPermission(message.channelId);
  const { room, invitationByMe: invitation } = useLivestreamData();

  const isOwner = message.creatorId === currentUserId;

  // Use the livestream moderation hook
  const {
    host,
    coHost,
    isHost,
    invitedCoHost,
    handleCancelInvitation,
    handlePromoteToModerator,
    handleRemoveCoHost,
    handleLeaveAsCoHost,
  } = useLivestreamModeration({
    pageId,
    room,
    channel,
    invitation,
  });

  const hostId = host?.userId;
  const coHostId = coHost?.userId;

  const { deleteMessage } = useDeleteMessage();
  const { setDrawerData, removeDrawerData } = useDrawer();

  const onClickReportMessage = () => {
    if (isDesktop) {
      openPopup({
        id: 'report_post_reason',
        pageId,
        view: 'desktop',
        isDismissable: false,
        children: (
          <ContentReportReason
            pageId={pageId}
            componentId={componentId}
            onCloseMenu={removeDrawerData}
            message={message}
            showReportPostButton={false}
          />
        ),
      });
    } else {
      setTimeout(() => {
        setDrawerData({
          content: (
            <ContentReportReason
              pageId={pageId}
              componentId={componentId}
              onCloseMenu={removeDrawerData}
              message={message}
              showReportPostButton={false}
            />
          ),
        });
      }, 500);
    }
  };

  const { handleCreateInvitation, isPending: isPendingCreateInvitation } = useCreateInvitation({
    room,
    pageId,
  });

  const handleDemoteModerator = (userId: string) => {};

  const handleReportMessage = () => {
    removeDrawerData();
    handleClickReportMessage();
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    removeDrawerData();
  };

  const handleClickReportMessage = () =>
    handleCommunityProfileBehavior({
      defaultBehavior: onClickReportMessage,
      isJoined: isJoinedCommunity,
      allowNonMember: false,
    });

  const renderModeratorOptions = useCallback(
    (closePopover: () => void) => {
      return (
        <LivestreamModerationOptions
          displayName={message.creator?.displayName ?? coHost?.displayName}
          isHost={isHost}
          coHostId={invitedCoHost?.userId ?? coHost?.userId}
          isModerator={isModerator}
          onInviteAsCoHost={() => handleCreateInvitation(message.creatorId)}
          onPromoteToModerator={handlePromoteToModerator}
          onCancelInvitation={handleCancelInvitation}
          onRemoveCoHost={handleRemoveCoHost}
          onLeaveAsCoHost={handleLeaveAsCoHost}
          onClickOption={closePopover}
          isPendingCoHost={
            invitedCoHost?.userId === message.creatorId && invitation?.status === 'pending'
          }
        />
      );
    },
    [invitation?.status, invitedCoHost?.userId, message.creatorId, message.creator?.displayName],
  );

  return (
    <div className={styles.messageBubble__container}>
      <div className={styles.messageBubble__topSectionWrap}>
        <div className={styles.messageBubble__displayName__wrapper}>
          {currentUserId === message.creatorId ? (
            <Typography.CaptionSmall className={styles.messageBubble__displayName}>
              {message.creator?.displayName}
            </Typography.CaptionSmall>
          ) : (
            <Popover
              placement="bottom left"
              containerClassName={styles.messageBubble__optionIcon}
              trigger={({ isDesktop, openPopover, closePopover }) => (
                <Button
                  variant="text"
                  onPress={() => {
                    if (!room) return;

                    isDesktop
                      ? openPopover()
                      : setDrawerData({
                          content: () => renderModeratorOptions(closePopover),
                        });
                  }}
                >
                  <Typography.CaptionSmall className={styles.messageBubble__displayName}>
                    {message.creator?.displayName}
                  </Typography.CaptionSmall>
                </Button>
              )}
            >
              {({ closePopover }) => renderModeratorOptions(closePopover)}
            </Popover>
          )}
          {hostId === message.creatorId ? (
            <HostBadge pageId={pageId} componentId={componentId} />
          ) : coHostId === message.creatorId ? (
            <CoHostBadge pageId={pageId} componentId={componentId} />
          ) : isModerator ? (
            <ModeratorBadge pageId={pageId} componentId={componentId} type="live" />
          ) : null}
        </div>
        {message.syncState !== 'error' && !message.isDeleted && (
          <Popover
            containerClassName={styles.messageBubble__optionIcon}
            trigger={{
              pageId,
              componentId,
              onClick: ({ closePopover }) =>
                setDrawerData({
                  content: (
                    <MessageOptions
                      isOwner={isOwner}
                      isModerator={isModerator}
                      messageId={message.messageId}
                      syncState={message.syncState}
                      onReportMessage={handleReportMessage}
                      onDeleteMessage={handleDeleteMessage}
                      onClose={closePopover}
                    />
                  ),
                }),
            }}
          >
            {({ closePopover }) => (
              <MessageOptions
                isOwner={isOwner}
                isModerator={isModerator}
                messageId={message.messageId}
                syncState={message.syncState}
                onReportMessage={handleReportMessage}
                onDeleteMessage={handleDeleteMessage}
                onClose={closePopover}
              />
            )}
          </Popover>
        )}
      </div>
      {message.isDeleted ? (
        <div className={styles.messageBubble__deletedMessageText__container}>
          <Bin className={styles.messageBubble__deletedMessageText__icon} />
          <Typography.Caption className={styles.messageBubble__deletedMessageText}>
            This message was deleted.
          </Typography.Caption>
        </div>
      ) : (
        <div className={styles.messageBubble__messageText__container}>
          <Typography.Caption className={styles.messageBubble__messageText}>
            {message.data?.text}
          </Typography.Caption>
          {message.syncState === 'error' && (
            <Popover
              containerClassName={styles.messageBubble__optionIcon}
              trigger={({ isDesktop, openPopover, closePopover }) => (
                <Button
                  variant="text"
                  onPress={() =>
                    isDesktop
                      ? openPopover()
                      : setDrawerData({
                          content: (
                            <MessageOptions
                              isOwner={isOwner}
                              isModerator={isModerator}
                              messageId={message.messageId}
                              syncState={message.syncState}
                              onReportMessage={handleReportMessage}
                              onDeleteMessage={handleDeleteMessage}
                              onClose={closePopover}
                            />
                          ),
                        })
                  }
                >
                  <ExclamationCircle className={styles.messageBubble__exclamationIcon} />
                </Button>
              )}
            >
              {({ closePopover }) => (
                <MessageOptions
                  isOwner={isOwner}
                  isModerator={isModerator}
                  messageId={message.messageId}
                  syncState={message.syncState}
                  onReportMessage={handleReportMessage}
                  onDeleteMessage={handleDeleteMessage}
                  onClose={closePopover}
                />
              )}
            </Popover>
          )}
        </div>
      )}
    </div>
  );
};
