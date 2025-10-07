import React, { FC, useCallback } from 'react';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Popover } from '~/v4/core/components/AriaPopover/Popover';
import useSDK from '~/v4/core/hooks/useSDK';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import styles from './MessageBubble.module.css';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import Flag from '~/v4/icons/Flag';
import Bin from '~/v4/icons/Bin';
import { useDeleteMessage } from '~/v4/chat/hooks/useDeleteMessage';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { ContentReportReason } from '~/v4/core/internal-components/ContentReportReason';
import { PromoteToModerator } from '~/v4/icons/PromoteToModerator';
import UnMutedOutlined from '~/v4/icons/UnMutedOutlined';
import { ModeratorBadge } from '~/v4/social/elements/ModeratorBadge';
import { useChatModeration } from '~/v4/chat/hooks/useChatModeration';
import { DemoteToMember } from '~/v4/icons/DemoteToMember';
import Muted from '~/v4/icons/Muted';
import { HostBadge } from '~/v4/social/elements/HostBadge';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';

interface MessageBubbleProps {
  pageId?: string;
  componentId?: string;
  message: Amity.Message<'text'>;
  channel?: Amity.Channel;
  streamerId?: string;
  handlePopoverStateChange?: (isOpen: boolean) => void;
  isJoinedCommunity?: boolean;
}

export const MessageBubble: FC<MessageBubbleProps> = ({
  pageId = '*',
  componentId = '*',
  message,
  channel,
  streamerId,
  handlePopoverStateChange,
  isJoinedCommunity,
}) => {
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();

  const { currentUserId } = useSDK();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();

  const isModerator = !!channel?.metadata?.moderators?.includes(currentUserId);
  const isHost = streamerId === currentUserId;
  const isOwner = message.creatorId === currentUserId;
  const isHostMessage = streamerId === message.creatorId;

  const { deleteMessage } = useDeleteMessage();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { demoteFromModerator, muteUser, promoteToModerator, unmuteUser } = useChatModeration();

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

  const renderModerationOptions = ({ closePopover }: { closePopover: () => void }) => {
    return (
      <div className={styles.messageBubble__optionsButton__container}>
        <div className={styles.messageBubble__optionUserInfo}>
          <div className={styles.messageBubble__displayName__container}>
            <Typography.TitleBold className={styles.messageBubble__optionUserInfo__displayName}>
              {message.creator?.displayName}
            </Typography.TitleBold>
            {channel?.metadata?.mutedMembers?.includes(message.creatorId) && (
              <div className={styles.messageBubble__optionUserInfo__mutedIcon}>
                <Muted className={styles.messageBubble__optionUserInfo__mutedIcon} />
              </div>
            )}
          </div>
          {channel?.metadata?.moderators?.includes(message.creatorId) && (
            <ModeratorBadge variant="chat" />
          )}
        </div>
        {channel?.metadata?.moderators?.includes(message.creatorId) ? (
          <Button
            variant="text"
            className={styles.messageBubble__optionUserInfo__button}
            icon={<DemoteToMember className={styles.messageBubble__optionUserInfo__buttonIcon} />}
            iconClassName={styles.messageBubble__optionUserInfo__buttonIcon}
            onPress={() => {
              closePopover();
              removeDrawerData();
              demoteFromModerator({
                channelId: message.channelId,
                creatorId: message.creatorId,
                moderators:
                  channel?.metadata?.moderators?.filter((id: string) => id !== message.creatorId) ??
                  [],
                mutedMembers: channel?.metadata?.mutedMembers || [],
              });
            }}
          >
            <Typography.BodyBold className={styles.messageBubble__optionUserInfo__buttonLabel}>
              Demote to moderator
            </Typography.BodyBold>
          </Button>
        ) : (
          <>
            {channel?.metadata?.mutedMembers?.includes(message.creatorId) ? (
              <Button
                variant="text"
                className={styles.messageBubble__optionUserInfo__button}
                icon={
                  <UnMutedOutlined className={styles.messageBubble__optionUserInfo__buttonIcon} />
                }
                iconClassName={styles.messageBubble__optionUserInfo__buttonIcon}
                onPress={() => {
                  closePopover();
                  removeDrawerData();
                  unmuteUser({
                    creatorId: message.creatorId,
                    channelId: message.channelId,
                    moderators: channel?.metadata?.moderators || [],
                    mutedMembers:
                      channel?.metadata?.mutedMembers?.filter(
                        (id: string) => id !== message.creatorId,
                      ) || [],
                  });
                }}
              >
                <Typography.BodyBold className={styles.messageBubble__optionUserInfo__buttonLabel}>
                  Unmute user
                </Typography.BodyBold>
              </Button>
            ) : (
              <>
                <Button
                  variant="text"
                  className={styles.messageBubble__optionUserInfo__button}
                  icon={
                    <PromoteToModerator
                      className={styles.messageBubble__optionUserInfo__buttonIcon}
                    />
                  }
                  iconClassName={styles.messageBubble__optionUserInfo__buttonIcon}
                  onPress={() => {
                    closePopover();
                    removeDrawerData();
                    promoteToModerator({
                      creatorId: message.creatorId,
                      channelId: message.channelId,
                      moderators: channel?.metadata?.moderators
                        ? channel.metadata.moderators.includes(message.creatorId)
                          ? channel.metadata.moderators
                          : [...channel.metadata.moderators, message.creatorId]
                        : [message.creatorId],
                      mutedMembers: channel?.metadata?.mutedMembers || [],
                    });
                  }}
                >
                  <Typography.BodyBold
                    className={styles.messageBubble__optionUserInfo__buttonLabel}
                  >
                    Promote to moderator
                  </Typography.BodyBold>
                </Button>
                <Button
                  variant="text"
                  className={styles.messageBubble__optionUserInfo__button}
                  icon={<Muted className={styles.messageBubble__optionUserInfo__buttonIcon} />}
                  iconClassName={styles.messageBubble__optionUserInfo__buttonIcon}
                  onPress={() => {
                    closePopover();
                    removeDrawerData();
                    muteUser({
                      creatorId: message.creatorId,
                      channelId: message.channelId,
                      moderators: channel?.metadata?.moderators || [],
                      mutedMembers: channel?.metadata?.mutedMembers
                        ? channel?.metadata?.mutedMembers?.includes(message?.creatorId)
                          ? channel.metadata.mutedMembers
                          : [...channel.metadata.mutedMembers, message.creatorId]
                        : [message.creatorId],
                    });
                  }}
                >
                  <Typography.BodyBold
                    className={styles.messageBubble__optionUserInfo__buttonLabel}
                  >
                    Mute user
                  </Typography.BodyBold>
                </Button>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  const handleClickReportMessage = () =>
    handleCommunityProfileBehavior({
      defaultBehavior: onClickReportMessage,
      isJoined: isJoinedCommunity,
      allowNonMember: false,
    });

  return (
    <div className={styles.messageBubble__container}>
      <div className={styles.messageBubble__topSectionWrap}>
        <div className={styles.messageBubble__displayName__container}>
          {isHostMessage || isOwner || (!isHost && !isModerator) ? (
            <Typography.CaptionSmall className={styles.messageBubble__displayName}>
              {message.creator?.displayName}
            </Typography.CaptionSmall>
          ) : (
            <Popover
              placement="end top"
              onOpen={() => handlePopoverStateChange?.(true)}
              onClose={() => handlePopoverStateChange?.(false)}
              trigger={({ closePopover, isDesktop, openPopover }) => (
                <Button
                  variant="default"
                  onPress={() => {
                    if (isDesktop) {
                      openPopover();
                    } else {
                      setDrawerData({
                        content: renderModerationOptions({ closePopover }),
                      });
                    }
                  }}
                >
                  <Typography.CaptionSmall className={styles.messageBubble__button__displayName}>
                    {message.creator?.displayName}
                  </Typography.CaptionSmall>
                </Button>
              )}
            >
              {({ closePopover }) => renderModerationOptions({ closePopover })}
            </Popover>
          )}
          {isHostMessage && <HostBadge />}
          {channel?.metadata?.moderators?.includes(message.creatorId) && (
            <ModeratorBadge variant="chat" />
          )}
          {channel?.metadata?.mutedMembers?.includes(message.creatorId) && (
            <Muted className={styles.messageBubble__optionUserInfo__mutedIcon} />
          )}
        </div>
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
