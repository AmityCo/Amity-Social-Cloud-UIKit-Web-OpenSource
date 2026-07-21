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
import { COMPONENT_ID, PAGE_ID } from '~/v4/constants/customization';

export interface MessageOptionsProps {
  pageId?: string;
  componentId?: string;
  isOwner: boolean;
  isModerator: boolean;
  isHostMessage?: boolean;
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
  message,
  onCloseMenu,
  isJoinedCommunity,
}) => {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { deleteMessage } = useDeleteMessage();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { setDrawerData, removeDrawerData } = useDrawer();

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

  return (
    <div className={styles.messageOptions}>
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
