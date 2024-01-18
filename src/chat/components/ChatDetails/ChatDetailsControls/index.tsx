import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { confirm } from '~/core/components/Confirm';
import MenuGroupSetting from './MenuGroupSetting';
import {
  MembersIcon,
  ControlsContainer,
  SideWrapper,
  ControlItem,
  ControlItemLabel,
  ControlItemState,
  ControlItemArrowRight,
} from './styles';

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
    <ControlsContainer>
      <ControlItem onClick={showMembers}>
        <SideWrapper>
          <MembersIcon />
          <ControlItemLabel>
            <FormattedMessage id="tabs.members" />
          </ControlItemLabel>
        </SideWrapper>
        <SideWrapper>
          {memberCount && <ControlItemState>{memberCount}</ControlItemState>}
          <ControlItemArrowRight />
        </SideWrapper>
      </ControlItem>

      {!isDirectChat && <MenuGroupSetting channelId={channelId} chatName={chatName} />}

      {chatType !== 'conversation' ? (
        <ControlItem onClick={handleLeaveChatClick}>
          <ControlItemLabel isDanger>
            <FormattedMessage id="chat.leaveChat" />
          </ControlItemLabel>
        </ControlItem>
      ) : null}
    </ControlsContainer>
  );
};

export default ChatDetailsControls;
