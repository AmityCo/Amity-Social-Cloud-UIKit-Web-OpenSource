import React, { useRef } from 'react';
import { useChannel } from '~/v4/chat/hooks/useChannel';
import { ChatHeader } from '~/v4/chat/components/ChatHeader/index';
import ChatContainer from './ChatContainer/index';
import { LiveChatNotificationProvider } from '~/v4/chat/providers/LiveChatNotificationProvider';
import { useAmityPage } from '~/v4/core/hooks/uikit';

import styles from './LiveChat.module.css';

interface LiveChatProps {
  channelId: Amity.Channel['channelId'];
}

export const LiveChat = ({ channelId }: LiveChatProps) => {
  const { channel } = useChannel({ channelId });
  const pageId = 'live_chat';
  const { themeStyles } = useAmityPage({ pageId });
  const ref = useRef<HTMLDivElement>(null);

  return (
    <LiveChatNotificationProvider>
      <div className={styles.liveChat} ref={ref} style={themeStyles}>
        <div className={styles.messageListHeaderWrap}>
          <ChatHeader channel={channel} pageId={pageId} />
        </div>
        <ChatContainer channel={channel} pageId={pageId} />
      </div>
    </LiveChatNotificationProvider>
  );
};
