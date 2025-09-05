import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import useChatInfo from '~/chat/hooks/useChatInfo';
import useChannel from '~/chat/hooks/useChannel';
import UserAvatar from '~/chat/components/UserAvatar';
import { backgroundImage as communityBackgroundImage } from '~/icons/Community';
import { Close } from '~/icons';

import ChatDetailsControls from './ChatDetailsControls';
import ChatDetailsMembers from './ChatDetailsMembers';

import styles from './styles.module.css';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface ChatDetailsProps {
  channelId: string;
  onClose?: () => void;
  leaveChat?: () => void;
  onEditChatMemberClick?: ({
    channel,
    members,
  }: {
    channel: Amity.Channel;
    members: Amity.Membership<'channel'>[];
  }) => void;
  onMemberSelect?: (member: Amity.Membership<'channel'>) => void;
}

const ChatDetails = ({
  channelId,
  onClose,
  leaveChat,
  onEditChatMemberClick,
  onMemberSelect,
}: ChatDetailsProps) => {
  const channel = useChannel(channelId);
  const { chatName, chatAvatar, type: chatType } = useChatInfo({ channel });
  const [shouldShowMembers, setShouldShowMembers] = useState(false);

  return (
    <div className={styles.chatDetailsContainer}>
      <div className={styles.chatDetailsHeader}>
        <FormattedMessage id="chat.details.header" />
        <Close className={styles.headerCloseIcon} onClick={onClose} width={20} height={20} />
      </div>

      <div className={styles.chatDetailsTitle}>
        <UserAvatar avatarUrl={chatAvatar} defaultImage={communityBackgroundImage} />
        <div className={styles.titleInfo}>
          <div className={styles.titleInfoLabel}>
            <FormattedMessage id="chat.details.chatName" />
          </div>
          <div className={styles.titleInfoChatName}>{chatName}</div>
        </div>
      </div>

      {shouldShowMembers ? (
        <ChatDetailsMembers
          channelId={channelId}
          hideMembers={() => setShouldShowMembers(false)}
          onMemberSelect={onMemberSelect}
          onEditChatMemberClick={({ members }) =>
            channel && onEditChatMemberClick?.({ channel, members })
          }
        />
      ) : (
        <ChatDetailsControls
          chatType={chatType}
          channelId={channelId}
          chatName={chatName}
          leaveChat={leaveChat}
          memberCount={channel?.memberCount}
          showMembers={() => setShouldShowMembers(true)}
        />
      )}
    </div>
  );
};

export default (props: ChatDetailsProps) => {
  const CustomComponentFn = useCustomComponent<ChatDetailsProps>('ChatDetails');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <ChatDetails {...props} />;
};
