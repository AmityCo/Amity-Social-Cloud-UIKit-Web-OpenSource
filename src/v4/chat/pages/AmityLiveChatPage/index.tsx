import React, { useRef } from 'react';
import useChannel from '~/v4/chat/hooks/useChannel';
import AmityLiveChatHeader from '~/v4/chat/components/AmityLiveChatHeader';
import ChatContainer from './ChatContainer';
import styles from './styles.module.css';
import { LiveChatNotificationProvider } from '~/v4/chat/providers/LiveChatNotificationProvider';
import { useAmityPage } from '~/v4/core/hooks/uikit';

interface AmityLiveChatPageProps {
  channelId: Amity.Channel['channelId'];
}

export const AmityLiveChatPage = ({ channelId }: AmityLiveChatPageProps) => {
  const channel = useChannel(channelId);
  const pageId = 'live_chat';
  const { themeStyles } = useAmityPage({ pageId });
  const ref = useRef<HTMLDivElement>(null);

  return (
    <LiveChatNotificationProvider>
      <div className={styles.amtiyLivechatPage} ref={ref} style={themeStyles}>
        <div className={styles.messageListHeaderWrap}>
          <AmityLiveChatHeader channel={channel} pageId={pageId} />
        </div>
        <ChatContainer channel={channel} pageId={pageId} />
      </div>
    </LiveChatNotificationProvider>
  );
};

export default AmityLiveChatPage;
