import React from 'react';
import { useString } from '~/v4/core/localization';
import { MenuOptionButton } from '~/v4/core/design/components/MenuOptionButton';
import Flag from '~/v4/icons/Flag';
import UnFlag from '~/v4/icons/UnFlag';
import Bin from '~/v4/icons/Bin';
import styles from './MessageOptions.module.css';
import { useFlagMessageQuery } from '~/v4/chat/hooks/queries';
import { Skeleton } from '~/v4/core/design/components/Skeleton';
import { useDeleteMessage } from '~/v4/chat/hooks/useDeleteMessage';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { ContentReportReason } from '~/v4/core/internal-components/ContentReportReason';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { COMPONENT_ID, ELEMENT_ID, PAGE_ID } from '~/v4/constants/customization';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { usePinMessage } from '~/v4/chat/hooks/usePinMessage';
import { PinStraight } from '~/v4/icons/PinStraight';
import { UnPin } from '~/v4/icons/UnPin';

export interface MessageOptionsProps {
  pageId?: string;
  componentId?: string;
  isOwner: boolean;
  isModerator: boolean;
  isHostMessage?: boolean;
  /** Pin gate from useCanPinMessage — shows the "Pin message" item (AmityLivestreamChatFeed v2 REQ-080). */
  canPin?: boolean;
  /**
   * Whether this message is the channel's current pin (`channel.pinnedMessage.messageId`).
   * When true and `canPin`, the menu offers "Unpin message" instead of "Pin message".
   */
  isPinned?: boolean;
  message: Amity.Message;
  isJoinedCommunity?: boolean;
  onCloseMenu: () => void;
}

export const MessageOptions: React.FC<MessageOptionsProps> = ({
  pageId = PAGE_ID.WILD_CARD,
  componentId = COMPONENT_ID.WILD_CARD,
  isOwner,
  isModerator,
  isHostMessage,
  canPin = false,
  isPinned = false,
  message,
  onCloseMenu,
  isJoinedCommunity,
}) => {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { deleteMessage } = useDeleteMessage();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { pinMessage, unpinMessage } = usePinMessage();
  const pinMessageButton = useAmityElement({
    pageId,
    componentId: COMPONENT_ID.LIVESTREAM_CHAT_FEED,
    elementId: ELEMENT_ID.PIN_MESSAGE_BUTTON,
  });
  const unpinMessageButton = useAmityElement({
    pageId,
    componentId: COMPONENT_ID.LIVESTREAM_CHAT_FEED,
    elementId: ELEMENT_ID.UNPIN_MESSAGE_BUTTON,
  });

  const { isLoading, isFlaggedByMe, unreport } = useFlagMessageQuery({
    messageId: message.messageId,
    toastAlignment: 'live-chat',
  });

  const handleReportMessage = () => {
    onCloseMenu();
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
            onCloseMenu={closePopup}
            message={message}
            messageType="live-chat"
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
              onCloseMenu={onCloseMenu}
              message={message}
              messageType="live-chat"
              showReportPostButton={false}
            />
          ),
        });
      }, 500);
    }
  };

  const handleUnreportMessage = () => {
    onCloseMenu();
    unreport();
  };

  const handleClickReportMessage = () =>
    handleCommunityProfileBehavior({
      defaultBehavior: handleReportMessage,
      isJoined: isJoinedCommunity,
      allowNonMember: false,
    });

  const handleDeleteMessage = () => {
    deleteMessage(message.messageId);
    removeDrawerData();
  };

  const handlePinMessage = () => {
    onCloseMenu();
    pinMessage(message.messageId);
  };

  const handleUnpinMessage = () => {
    onCloseMenu();
    unpinMessage(message.messageId);
  };

  // Pin / Unpin share one slot at the top of the menu: the item reads "Unpin message" and
  // calls `unpinMessage` when this message is the channel's current pin, otherwise
  // "Pin message" (AmityLivestreamChatFeed v2 REQ-080 / REQ-082). Failures stay silent
  // (REQ-085 … REQ-087); the label follows the channel live object.
  const canActOnPin = canPin && !message.isDeleted && message.syncState !== 'error';
  const showUnpinMessage = canActOnPin && isPinned && !unpinMessageButton.isExcluded;
  const showPinMessage = canActOnPin && !isPinned && !pinMessageButton.isExcluded;

  return (
    <div className={styles.messageOptions}>
      {showUnpinMessage && (
        <MenuOptionButton
          text={unpinMessageButton.resolveText('amity_livechat_pinned_message_unpin_button')}
          icon={<UnPin />}
          onPress={handleUnpinMessage}
        />
      )}
      {showPinMessage && (
        <MenuOptionButton
          text={pinMessageButton.resolveText('amity_livechat_pinned_message_pin_button')}
          icon={<PinStraight />}
          onPress={handlePinMessage}
        />
      )}
      {!isOwner && message.syncState !== 'error' && (
        <>
          {isLoading ? (
            <Skeleton.Line height="0.625rem" width="100%" />
          ) : isFlaggedByMe ? (
            <MenuOptionButton
              text={useString('amity_social_button_unreport_message')}
              icon={<UnFlag />}
              onPress={handleUnreportMessage}
            />
          ) : (
            <MenuOptionButton
              text={useString('amity_social_button_report_message')}
              icon={<Flag />}
              onPress={handleClickReportMessage}
            />
          )}
        </>
      )}
      {(isOwner || (isModerator && !isHostMessage)) && (
        <MenuOptionButton
          text={useString('amity_social_button_delete')}
          icon={<Bin />}
          onPress={handleDeleteMessage}
          isDanger={true}
        />
      )}
    </div>
  );
};
