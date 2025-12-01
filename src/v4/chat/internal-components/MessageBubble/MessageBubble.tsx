import React, { FC, useCallback } from 'react';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Popover } from '~/v4/core/components/AriaPopover/Popover';
import useSDK from '~/v4/core/hooks/useSDK';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';
import Flag from '~/v4/icons/Flag';
import { useDeleteMessage } from '~/v4/chat/hooks/useDeleteMessage';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { ContentReportReason } from '~/v4/core/internal-components/ContentReportReason';
import { PromoteToModerator } from '~/v4/icons/PromoteToModerator';
import UnMutedOutlined from '~/v4/icons/UnMutedOutlined';
import { useChatModeration } from '~/v4/chat/hooks/useChatModeration';
import { DemoteToMember } from '~/v4/icons/DemoteToMember';
import Muted from '~/v4/icons/Muted';
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
import { BrandBadge } from '~/v4/social/elements';

interface MessageBubbleProps {
  pageId?: string;
  componentId?: string;
  message: Amity.Message<'text'>;
  handlePopoverStateChange?: (isOpen: boolean) => void;
  isJoinedCommunity?: boolean;
  channel?: Amity.Channel | null;
}

export const MessageBubble: FC<MessageBubbleProps> = ({
  pageId = '*',
  componentId = '*',
  message,
  channel,
  handlePopoverStateChange,
  isJoinedCommunity,
}) => {
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();

  const { currentUserId } = useSDK();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { isModerator: isChannelModerator } = useChannelPermission(message.channelId);
  const { room, invitationByMe: invitation, hostId, coHostId } = useLivestreamData();
  const isModerator =
    isChannelModerator || !!channel?.metadata?.moderators?.includes(currentUserId);
  const isOwner = message.creatorId === currentUserId;

  const isHostMessage = hostId === message.creatorId;
  const isModeratorMessage = channel?.metadata?.moderators?.includes(message.creatorId);
  const isCoHostMessage = coHostId === message.creatorId;
  const isUserMuted = channel?.metadata?.mutedMembers?.includes(message.creatorId);

  const {
    coHost,
    isHost,
    invitedCoHost,
    handleCancelInvitation,
    handleRemoveCoHost,
    handleLeaveAsCoHost,
  } = useLivestreamModeration({
    pageId,
    room,
    channel,
    invitation,
  });

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

  const { handleCreateInvitation, isPending: isPendingCreateInvitation } = useCreateInvitation({
    room,
    pageId,
  });

  const handleReportMessage = () => {
    removeDrawerData();
    handleClickReportMessage();
  };

  const handleDeleteMessage = (messageId: string) => {
    deleteMessage(messageId);
    removeDrawerData();
  };

  const renderModerationOptions = ({ closePopover }: { closePopover: () => void }) => {
    return (
      <div className={styles.messageBubble__optionsButton__container}>
        <div className={styles.messageBubble__optionUserInfo}>
          <div className={styles.messageBubble__displayName__container}>
            <Typography.TitleBold className={styles.messageBubble__optionUserInfo__displayName}>
              {message.creator?.displayName}
            </Typography.TitleBold>
            {message.creator?.isBrand && <BrandBadge pageId={pageId} componentId={componentId} />}
            {channel?.metadata?.mutedMembers?.includes(message.creatorId) && (
              <div className={styles.messageBubble__optionUserInfo__mutedIcon}>
                <Muted className={styles.messageBubble__optionUserInfo__mutedIcon} />
              </div>
            )}
          </div>
          {coHostId ? (
            <CoHostBadge />
          ) : (
            channel?.metadata?.moderators?.includes(message.creatorId) && (
              <ModeratorBadge type="live" />
            )
          )}
        </div>
        <LivestreamModerationOptions
          displayName={message.creator?.displayName ?? coHost?.displayName}
          isHost={isHost}
          coHostId={invitedCoHost?.userId ?? coHost?.userId}
          isModerator={isModerator}
          onInviteAsCoHost={() => handleCreateInvitation(message.creatorId)}
          onCancelInvitation={handleCancelInvitation}
          onRemoveCoHost={handleRemoveCoHost}
          onLeaveAsCoHost={handleLeaveAsCoHost}
          onClickOption={closePopover}
          isPendingCoHost={
            invitedCoHost?.userId === message.creatorId && invitation?.status === 'pending'
          }
        />
        {!coHostId && (
          <>
            {channel?.metadata?.moderators?.includes(message.creatorId) ? (
              <Button
                variant="text"
                className={styles.messageBubble__optionUserInfo__button}
                icon={
                  <DemoteToMember className={styles.messageBubble__optionUserInfo__buttonIcon} />
                }
                iconClassName={styles.messageBubble__optionUserInfo__buttonIcon}
                onPress={() => {
                  closePopover();
                  removeDrawerData();
                  demoteFromModerator({
                    channelId: message.channelId,
                    creatorId: message.creatorId,
                    moderators:
                      channel?.metadata?.moderators?.filter(
                        (id: string) => id !== message.creatorId,
                      ) ?? [],
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
                      <UnMutedOutlined
                        className={styles.messageBubble__optionUserInfo__buttonIcon}
                      />
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
                    <Typography.BodyBold
                      className={styles.messageBubble__optionUserInfo__buttonLabel}
                    >
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
            <div className={styles.messageBubble__displayName__container}>
              <Typography.CaptionSmall className={styles.messageBubble__displayName}>
                {message.creator?.displayName}
              </Typography.CaptionSmall>
              {message.creator?.isBrand && <BrandBadge pageId={pageId} componentId={componentId} />}
            </div>
          ) : (
            <Popover
              placement="end top"
              containerClassName={styles.messageBubble__optionIcon}
              onOpen={() => handlePopoverStateChange?.(true)}
              onClose={() => handlePopoverStateChange?.(false)}
              trigger={({ closePopover, isDesktop, openPopover }) => (
                <Button
                  variant="default"
                  onPress={() => {
                    if (!room) return;
                    if (isDesktop) {
                      openPopover();
                    } else {
                      setDrawerData({
                        content: () => renderModerationOptions({ closePopover }),
                      });
                    }
                  }}
                >
                  <div className={styles.messageBubble__displayName__container}>
                    <Typography.CaptionSmall className={styles.messageBubble__button__displayName}>
                      {message.creator?.displayName}
                    </Typography.CaptionSmall>
                    {message.creator?.isBrand && (
                      <BrandBadge pageId={pageId} componentId={componentId} />
                    )}
                  </div>
                </Button>
              )}
            >
              {({ closePopover }) => renderModerationOptions({ closePopover })}
            </Popover>
          )}
          {isHostMessage ? (
            <HostBadge pageId={pageId} componentId={componentId} />
          ) : isCoHostMessage ? (
            <CoHostBadge pageId={pageId} componentId={componentId} />
          ) : isModeratorMessage ? (
            <ModeratorBadge pageId={pageId} componentId={componentId} type="live" />
          ) : null}
          {isUserMuted && <Muted className={styles.messageBubble__optionUserInfo__mutedIcon} />}
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
