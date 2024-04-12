import { MessageRepository, UserRepository } from '@amityco/ts-sdk';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import ArrowTop from '~/v4/icons/ArrowTop';
import HomeIndicator from '../HomeIndicator';
import styles from './styles.module.css';
import InputText from '~/v4/core/components/InputText';
import useMention from '~/v4/chat/hooks/useMention';
import { confirm } from '~/core/components/Confirm';
import { useIntl } from 'react-intl';
import useChannelPermission from '~/v4/chat/hooks/useChannelPermission';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';

type ComposeActionTypes = {
  replyMessage?: Amity.Message;
  mentionMessage?: Amity.Message;
  clearReplyMessage?: () => void;
  clearMention?: () => void;
};

interface AmityLiveChatMessageComposeBarProps {
  channel: Amity.Channel;
  composeAction: ComposeActionTypes;
  suggestionRef?: RefObject<HTMLDivElement>;
}

type ComposeBarMention = {
  id: string;
  display: string;
  childIndex: number;
  index: number;
  plainTextIndex: number;
};

export const AmityLiveChatMessageComposeBar = ({
  channel,
  suggestionRef,
  composeAction: { replyMessage, mentionMessage, clearReplyMessage, clearMention },
}: AmityLiveChatMessageComposeBarProps) => {
  const [mentionList, setMentionList] = useState<{
    [key: ComposeBarMention['id']]: ComposeBarMention;
  }>({});

  const { getConfig } = useCustomization();
  const componentConfig = getConfig('live_chat/message_composer/*');

  const [message, setMessage] = useState('');
  const commentInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const { queryMentionees } = useMention({
    targetId: channel.channelId,
    targetType: 'channel',
  });

  const { isModerator } = useChannelPermission(channel.channelId);

  const { formatMessage } = useIntl();

  const sendMessage = async (inputText: string) => {
    if (!channel) return;
    if (message.trim().length === 0) return;

    setMessage('');

    // Packing mentions into the message
    const mentionArray =
      Object.values(mentionList).filter(({ display }) => inputText.includes(display)) || [];

    const mentionees: (Amity.UserMention | Amity.ChannelMention)[] = [];
    const mentionUsers = mentionArray.filter(({ id }) => id !== '@all').map(({ id }) => id);
    const mentionAll = mentionArray.find(({ id }) => id === '@all');

    if (mentionUsers.length > 0) {
      mentionees.push({ type: 'user', userIds: mentionUsers });
    }

    if (mentionAll) {
      mentionees.push({ type: 'channel' });
    }

    try {
      await MessageRepository.createMessage({
        tags: [],
        subChannelId: channel.channelId,
        data: { text: inputText },
        dataType: 'text',
        mentionees,
        metadata: {
          mentioned: mentionArray.map(({ id, index, display }) => {
            if (id === '@all') {
              return {
                index,
                userId: '',
                type: 'channel',
                length: display.length - 1,
              };
            }

            return {
              index,
              userId: id,
              type: 'user',
              length: display.length - 1,
            };
          }),
        },
        parentId: replyMessage?.messageId || undefined,
      });
    } catch (e) {
      confirm({
        title: formatMessage({ id: 'post.renderingError.title' }),
        content: formatMessage({ id: 'general.error.tryAgainLater' }),
        okText: formatMessage({ id: 'general.action.ok' }),
      });
      setMessage(inputText);
      return;
    }

    setMentionList({});
    clearMention && clearMention();
    clearReplyMessage && clearReplyMessage();
  };

  useEffect(() => {
    commentInputRef.current?.focus();
  }, []);

  useEffect(() => {
    if (mentionMessage) {
      UserRepository.getUser(mentionMessage.creatorId, ({ loading, data }) => {
        if (loading) return;

        const mentionData = {
          id: data.userId,
          display: data.displayName,
          childIndex: 0,
          index: message.length,
          plainTextIndex: message.length,
        } as ComposeBarMention;

        setMentionList({
          ...mentionList,
          [mentionData.id]: mentionData,
        });

        setMessage(`${message}@${mentionData.display}`);
      });
    }
  }, [mentionMessage]);

  return (
    <div className={styles.composeBarContainer}>
      <div className={styles.composeBar}>
        <div className={styles.textInputContainer}>
          <InputText
            ref={commentInputRef}
            suggestionRef={suggestionRef}
            data-qa-anchor="live-chat-compose-bar"
            multiline
            placeholder={
              componentConfig?.placeholder_text ||
              formatMessage({
                id: 'livechat.composebar.placeholder',
              })
            }
            mentionAllowed
            isModerator={isModerator}
            onChange={(e) => {
              // Set current inputted text to state
              setMessage(e.plainText);

              // Collect all mentions to local state to prevent got deleted from next change
              const incomingMentions = e.mentions as ComposeBarMention[];

              if (incomingMentions.length > 0) {
                const mergedMentions = incomingMentions.reduce((acc, currentMention) => {
                  return { ...acc, [currentMention.id]: currentMention };
                }, mentionList);
                setMentionList(mergedMentions);
              }
            }}
            value={message}
            queryMentionees={queryMentionees}
            onKeyPress={(e) => {
              if (message.trim().length < 200) return;
              e.preventDefault();
              if (message.trim().length > 0) {
                sendMessage(message);
              }
            }}
          />
        </div>
        <div className={styles.sendButtonContainer}>
          <ArrowTop className={styles.sendButton} onClick={() => sendMessage(message)} />
          {/* {message.length > 0 ? (
            <ArrowTop className={styles.sendButton} onClick={sendMessage} />
          ) : (
            <HeartReaction className={styles.reactionButton} />
          )} */}
        </div>
      </div>
      <HomeIndicator />
    </div>
  );
};

export default AmityLiveChatMessageComposeBar;
