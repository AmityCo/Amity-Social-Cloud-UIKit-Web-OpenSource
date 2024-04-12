import React, { useRef } from 'react';
import useChannel from '~/v4/chat/hooks/useChannel';
import AmityLiveChatHeader from 'v4/chat/components/AmityLiveChatHeader';
import ChatContainer from './ChatContainer';
import styles from './styles.module.css';

interface AmityLiveChatPageProps {
  channelId: Amity.Channel['channelId'];
}

export const AmityLiveChatPage = ({ channelId }: AmityLiveChatPageProps) => {
  const channel = useChannel(channelId);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div className={styles.amtiyLivechatPage} ref={ref}>
      <div className={styles.messageListHeaderWrap}>
        <AmityLiveChatHeader channel={channel} />
      </div>
      <ChatContainer channel={channel} />
    </div>
  );
};

export default AmityLiveChatPage;
