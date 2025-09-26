import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useConfirmContext } from '~/core/providers/ConfirmProvider';
import UserRegular from '~/icons/UserRegular';
import ChevronRight from '~/icons/ChevronRight';

import MenuGroupSetting from './MenuGroupSetting';
import styles from './styles.module.css';

interface ChatDetailsControlsProps {
  channelId: string;
  chatType?: string;
  chatName?: string;
  showMembers?: () => void;
  leaveChat?: () => void;
  memberCount?: number;
}

const ChatDetailsControls = ({
  channelId,
  chatType,
  chatName,
  showMembers,
  leaveChat,
  memberCount = 0,
}: ChatDetailsControlsProps) => {
  const { confirm } = useConfirmContext();
  const { formatMessage } = useIntl();

  const isDirectChat = memberCount <= 2;

  const handleLeaveChatClick: React.MouseEventHandler<HTMLDivElement> = (e) => {
    e.stopPropagation();

    confirm({
      title: formatMessage({ id: 'chat.leaveChat.confirm.title' }),
      content: formatMessage({ id: 'chat.leaveChat.confirm.content' }),
      okText: formatMessage({ id: 'chat.leaveChat.confirm.okButton' }),
      onOk: () => leaveChat?.(),
    });
  };

  return (
    <div>
      <div className={styles.controlItem} onClick={showMembers}>
        <div className={styles.sideWrapper}>
          <UserRegular className={styles.membersIcon} width={24} height={24} />
          <div className={styles.controlItemLabel}>
            <FormattedMessage id="tabs.members" />
          </div>
        </div>
        <div className={styles.sideWrapper}>
          {memberCount && <span className={styles.controlItemState}>{memberCount}</span>}
          <ChevronRight className={styles.controlItemArrowRight} width={16} height={12} />
        </div>
      </div>

      {!isDirectChat && <MenuGroupSetting channelId={channelId} chatName={chatName} />}

      {chatType !== 'conversation' ? (
        <div className={styles.controlItem} onClick={handleLeaveChatClick}>
          <div className={`${styles.controlItemLabel} ${styles.isDanger}`}>
            <FormattedMessage id="chat.leaveChat" />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ChatDetailsControls;
