import React, { useState, useRef } from 'react';
import Sheet from 'react-modal-sheet';
import { AmityLiveChatMessageList } from 'v4/chat/components/AmityLiveChatMessageList';
import AmityLiveChatMessageComposeBar from 'v4/chat/components/AmityLiveChatMessageComposeBar';
import ReplyMessagePlaceholder from '~/v4/chat/pages/AmityLiveChatPage/ChatContainer/ReplyMessagePlaceholder';
import useConnectionStates from '~/social/hooks/useConnectionStates';
import ChatLoadingState from '~/v4/chat/pages/AmityLiveChatPage/ChatContainer/ChatLoadingState';
import mentionStyles from '~/v4/core/components/InputText/styles.module.css';

const ChatReadyState = ({ channel }: { channel: Amity.Channel }) => {
  const isOnline = useConnectionStates();

  const [replyMessage, setReplyMessage] = useState<Amity.Message<'text'> | undefined>(undefined);
  const [mentionMessage, setMentionMessage] = useState<Amity.Message<'text'> | undefined>(
    undefined,
  );
  const suggestionRef = useRef<HTMLDivElement>(null);

  if (!isOnline) return <ChatLoadingState />;

  return (
    <>
      <AmityLiveChatMessageList channel={channel} replyMessage={setReplyMessage} />

      {isOnline && (
        <>
          <div ref={suggestionRef} className={mentionStyles.mentionContainer}></div>
          {replyMessage && (
            <ReplyMessagePlaceholder
              replyMessage={replyMessage}
              onDismiss={() => setReplyMessage(undefined)}
            />
          )}
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
        </>
      )}
    </>
  );
};

export default ChatReadyState;
