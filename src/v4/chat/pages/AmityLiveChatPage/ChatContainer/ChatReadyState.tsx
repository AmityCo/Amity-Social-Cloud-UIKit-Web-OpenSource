import React, { useState, useRef, useEffect } from 'react';
import { AmityLiveChatMessageList } from 'v4/chat/components/AmityLiveChatMessageList';
import AmityLiveChatMessageComposeBar from 'v4/chat/components/AmityLiveChatMessageComposeBar';
import ReplyMessagePlaceholder from '~/v4/chat/pages/AmityLiveChatPage/ChatContainer/ReplyMessagePlaceholder';
import useConnectionStates from '~/social/hooks/useConnectionStates';
import ChatLoadingState from '~/v4/chat/pages/AmityLiveChatPage/ChatContainer/ChatLoadingState';
// import mentionStyles from '~/v4/core/components/InputText/styles.module.css';
import styles from './styles.module.css';
import { LiveChatNotificationsContainer } from '~/v4/chat/components/LiveChatNotification';

const ChatReadyState = ({ channel }: { channel: Amity.Channel }) => {
  const isOnline = useConnectionStates();

  const [replyMessage, setReplyMessage] = useState<Amity.Message<'text'> | undefined>(undefined);
  const [mentionMessage, setMentionMessage] = useState<Amity.Message<'text'> | undefined>(
    undefined,
  );

  const [offsetBottom, setOffsetBottom] = useState(0);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const composeBarRef = useRef<HTMLDivElement>(null);

  if (!isOnline) return <ChatLoadingState />;

  useEffect(() => {
    if (composeBarRef.current?.clientHeight && composeBarRef.current?.clientHeight > 0) {
      setOffsetBottom(composeBarRef.current.clientHeight - 30);
    }
  }, [composeBarRef.current?.clientHeight]);

  return (
    <>
      <AmityLiveChatMessageList channel={channel} replyMessage={setReplyMessage} />

      {isOnline && (
        <>
          {/* <div ref={suggestionRef} className={mentionStyles.mentionContainer}></div> */}
          {replyMessage && (
            <ReplyMessagePlaceholder
              replyMessage={replyMessage}
              onDismiss={() => setReplyMessage(undefined)}
            />
          )}

          <div
            className={styles.notificationPosition}
            style={{
              bottom: offsetBottom,
            }}
          >
            <LiveChatNotificationsContainer />
          </div>

          <div ref={composeBarRef}>
            <AmityLiveChatMessageComposeBar
              channel={channel}
              suggestionRef={suggestionRef}
              composeAction={{
                replyMessage,
                mentionMessage,
                clearReplyMessage: () => setReplyMessage(undefined),
                clearMention: () => setMentionMessage(undefined),
              }}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ChatReadyState;
