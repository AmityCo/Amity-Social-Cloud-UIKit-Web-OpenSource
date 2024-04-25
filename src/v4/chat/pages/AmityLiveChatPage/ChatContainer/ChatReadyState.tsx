import React, { useEffect, useRef, useState } from 'react';
import { AmityLiveChatMessageList } from 'v4/chat/components/AmityLiveChatMessageList';
import AmityLiveChatMessageComposeBar from 'v4/chat/components/AmityLiveChatMessageComposeBar';
import ReplyMessagePlaceholder from '~/v4/chat/pages/AmityLiveChatPage/ChatContainer/ReplyMessagePlaceholder';
import useConnectionStates from '~/social/hooks/useConnectionStates';
import ChatLoadingState from '~/v4/chat/pages/AmityLiveChatPage/ChatContainer/ChatLoadingState';
import ChatCustomState from '~/v4/chat/pages/AmityLiveChatPage/ChatContainer/ChatCustomState';
import styles from './styles.module.css';
import { LiveChatNotificationsContainer } from '~/v4/chat/components/LiveChatNotification';
import MutedIcon from '~/v4/icons/Muted';
import { Typography } from '~/v4/core/components/Typography';
import mentionStyles from '~/v4/core/components/InputText/styles.module.css';
import { FormattedMessage } from 'react-intl';
import useCurrentUserChannelMembership from '~/v4/chat/hooks/useCurrentUserChannelMembership';
import CommentAltExclamation from '~/v4/icons/CommentAltExclamation';
import useSearchChannelUser from '~/v4/chat/hooks/collections/useSearchChannelUser';
import useSDK from '~/core/hooks/useSDK';

const ChatReadyState = ({ channel }: { channel: Amity.Channel }) => {
  const isOnline = useConnectionStates();

  const currentUserId = useSDK().currentUserId;
  const { channelMembers } = useSearchChannelUser(channel.channelId, ['member', 'banned', 'muted']);
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
          <Typography.Heading>
            <FormattedMessage id="livechat.member.banned.title" />
          </Typography.Heading>
          <Typography.Body>
            <FormattedMessage id="livechat.member.banned.description" />
          </Typography.Body>
        </div>
      </ChatCustomState>
    );

  return (
    <>
      <AmityLiveChatMessageList channel={channel} replyMessage={setReplyMessage} />

      {isOnline && (
        <>
          <div ref={suggestionRef} className={mentionStyles.mentionContainer}></div>
          {channel.isMuted ? (
            <div className={styles.mutedChannelContainer}>
              <MutedIcon width={20} height={20} className={styles.mutedIcon} />
              <Typography.Body>
                <FormattedMessage id="livechat.channel.muted" />
              </Typography.Body>
            </div>
          ) : currentUserMembership?.isMuted ? (
            <div className={styles.mutedChannelContainer}>
              <MutedIcon width={20} height={20} className={styles.mutedIcon} />
              <Typography.Body>
                <FormattedMessage id="livechat.member.muted" />
              </Typography.Body>
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
            <AmityLiveChatMessageComposeBar
              disabled={channel.isMuted || currentUserMembership?.isMuted}
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
