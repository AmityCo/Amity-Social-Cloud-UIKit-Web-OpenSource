import React, { useEffect, useRef, useState } from 'react';
import { MessageList } from '~/v4/chat/components/MessageList';
import { MessageComposer } from '~/v4/chat/components/MessageComposer';
import { ReplyMessagePlaceholder } from '~/v4/chat/pages/LiveChat/ChatContainer/ReplyMessagePlaceholder';
import useConnectionStates from '~/social/hooks/useConnectionStates';
import ChatLoadingState from '~/v4/chat/pages/LiveChat/ChatContainer/ChatLoadingState';
import ChatCustomState from '~/v4/chat/pages/LiveChat/ChatContainer/ChatCustomState';
import styles from './styles.module.css';
import { LiveChatNotificationsContainer } from '~/v4/chat/internal-components/LiveChatNotification';
import MutedIcon from '~/v4/icons/Muted';
import { Typography } from '~/v4/core/components/Typography';
import mentionStyles from '~/v4/core/components/InputText/styles.module.css';
import CommentAltExclamation from '~/v4/icons/CommentAltExclamation';
import { useSearchChannelUser } from '~/v4/chat/hooks/collections/useSearchChannelUser';
import useSDK from '~/core/hooks/useSDK';
import { useChannelPermission } from '~/v4/chat/hooks/useChannelPermission';

const ChatReadyState = ({ pageId = '*', channel }: { pageId?: string; channel: Amity.Channel }) => {
  const isOnline = useConnectionStates();

  const { isModerator } = useChannelPermission(channel.channelId);

  const currentUserId = useSDK().currentUserId;
  const { channelMembers } = useSearchChannelUser({
    channelId: channel.channelId,
    memberships: ['member', 'banned', 'muted'],
  });
  const currentUserMembership = channelMembers.find((member) => member.userId === currentUserId);

  const [replyMessage, setReplyMessage] = useState<Amity.Message<'text'> | undefined>(undefined);
  const [mentionMessage, setMentionMessage] = useState<Amity.Message<'text'> | undefined>(
    undefined,
  );

  const [offsetBottom, setOffsetBottom] = useState(0);
  const suggestionRef = useRef<HTMLDivElement>(null);
  const composeBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (composeBarRef.current?.clientHeight && composeBarRef.current?.clientHeight > 0) {
      setOffsetBottom(composeBarRef.current.clientHeight - 30);
    }
  }, [composeBarRef.current?.clientHeight]);

  if (!isOnline) return <ChatLoadingState />;

  if (currentUserMembership?.isBanned)
    return (
      <ChatCustomState>
        <div className={styles.banStatePanel}>
          <CommentAltExclamation className={styles.commentAltIcon} />
          <Typography.Heading>You are banned from chat</Typography.Heading>
          <Typography.Body>
            You won’t be able to participate in this chat until you’ve been unbanned.
          </Typography.Body>
        </div>
      </ChatCustomState>
    );

  return (
    <>
      <MessageList channel={channel} replyMessage={setReplyMessage} pageId={pageId} />

      {isOnline && (
        <>
          <div ref={suggestionRef} className={mentionStyles.mentionContainer}></div>
          {!isModerator && channel.isMuted ? (
            <div className={styles.mutedChannelContainer}>
              <MutedIcon width={20} height={20} className={styles.mutedIcon} />
              <Typography.Body>
                This channel has been set to read-only by the channel moderator
              </Typography.Body>
            </div>
          ) : currentUserMembership?.isMuted ? (
            <div className={styles.mutedChannelContainer}>
              <MutedIcon width={20} height={20} className={styles.mutedIcon} />
              <Typography.Body>You’ve been muted by the channel moderator</Typography.Body>
            </div>
          ) : null}

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
            <MessageComposer
              pageId={pageId}
              disabled={(!isModerator && channel.isMuted) || currentUserMembership?.isMuted}
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
