import React, { FC, useCallback, useState } from 'react';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Popover } from '~/v4/core/components/AriaPopover/Popover';
import useSDK from '~/v4/core/hooks/useSDK';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import styles from './MessageBubble.module.css';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import Flag from '~/v4/icons/Flag';
import Bin from '~/v4/icons/Bin';
import { useDeleteMessage } from '~/v4/chat/hooks/useDeleteMessage';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { ContentReportReason } from '~/v4/core/internal-components/ContentReportReason';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';

interface MessageBubbleProps {
  pageId?: string;
  componentId?: string;
  message: Amity.Message<'text'>;
  isJoinedCommunity?: boolean;
}

export const MessageBubble: FC<MessageBubbleProps> = ({
  pageId = '*',
  componentId = '*',
  message,
  isJoinedCommunity,
}) => {
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();

  const { currentUserId } = useSDK();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { isModerator } = useChannelPermission(message.channelId);
  const isOwner = message.creatorId === currentUserId;

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

  const renderOptions = useCallback(
    ({ closePopover }: { closePopover: () => void }) => {
      return (
        <div className={styles.messageBubble__optionsButton__container}>
          {!isOwner && (
            <Button
              variant="text"
              className={styles.messageBubble__optionButton}
              icon={<Flag />}
              iconClassName={styles.messageBubble__optionButton__icon}
              onPress={() => {
                closePopover();
                removeDrawerData();
                handleClickReportMessage();
              }}
            >
              <Typography.BodyBold className={styles.messageBubble__optionButton__text}>
                Report message
              </Typography.BodyBold>
            </Button>
          )}
          {(isOwner || isModerator) && (
            <Button
              variant="text"
              className={styles.messageBubble__optionButton}
              icon={<Bin />}
              iconClassName={styles.messageBubble__optionButton__deleteIcon}
              onPress={() => {
                deleteMessage(message.messageId);
                closePopover();
                removeDrawerData();
              }}
            >
              <Typography.BodyBold className={styles.messageBubble__optionButton__deleteText}>
                Delete message
              </Typography.BodyBold>
            </Button>
          )}
        </div>
      );
    },
    [message.messageId, isModerator, isOwner],
  );

  const renderDeleteOption = useCallback(
    ({ closePopover }: { closePopover: () => void }) => {
      return (
        <div className={styles.messageBubble__optionsButton__container}>
          <Button
            variant="text"
            className={styles.messageBubble__optionButton}
            icon={<Bin />}
            iconClassName={styles.messageBubble__optionButton__deleteIcon}
            onPress={() => {
              deleteMessage(message.messageId);
              closePopover();
              removeDrawerData();
            }}
          >
            <Typography.BodyBold className={styles.messageBubble__optionButton__deleteText}>
              Delete message
            </Typography.BodyBold>
          </Button>
        </div>
      );
    },
    [message.messageId],
  );

  const handleClickReportMessage = () =>
    handleCommunityProfileBehavior({
      defaultBehavior: onClickReportMessage,
      isJoined: isJoinedCommunity,
      allowNonMember: false,
    });

  return (
    <div className={styles.messageBubble__container}>
      <div className={styles.messageBubble__topSectionWrap}>
        <Typography.CaptionSmall className={styles.messageBubble__displayName}>
          {message.creator?.displayName}
        </Typography.CaptionSmall>
        {message.syncState !== 'error' && !message.isDeleted && (
          <Popover
            containerClassName={styles.messageBubble__optionIcon}
            trigger={{
              pageId,
              componentId,
              onClick: ({ closePopover }) =>
                setDrawerData({
                  content: renderOptions({ closePopover }),
                }),
            }}
          >
            {({ closePopover }) => renderOptions({ closePopover })}
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
                          content: renderDeleteOption({ closePopover }),
                        })
                  }
                >
                  <ExclamationCircle className={styles.messageBubble__exclamationIcon} />
                </Button>
              )}
            >
              {({ closePopover }) => renderOptions({ closePopover })}
            </Popover>
          )}
        </div>
      )}
    </div>
  );
};
