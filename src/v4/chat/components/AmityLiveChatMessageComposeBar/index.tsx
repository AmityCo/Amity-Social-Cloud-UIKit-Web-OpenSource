import { MessageRepository } from '@amityco/ts-sdk';
import React, { RefObject, useEffect, useRef, useState } from 'react';
import ArrowTop from '~/v4/icons/ArrowTop';
import HomeIndicator from '../HomeIndicator';
import styles from './styles.module.css';
import InputText from '~/v4/core/components/InputText';
import useMention from '~/v4/chat/hooks/useMention';
import { useIntl } from 'react-intl';
import useChannelPermission from '~/v4/chat/hooks/useChannelPermission';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useLiveChatNotifications } from '~/v4/chat/providers/LiveChatNotificationProvider';

const COMPOSEBAR_MAX_CHARACTER_LIMIT = 200;

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
  disabled?: boolean;
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
  disabled,
}: AmityLiveChatMessageComposeBarProps) => {
  const [mentionList, setMentionList] = useState<{
    [key: ComposeBarMention['id']]: ComposeBarMention;
  }>({});
  const { confirm } = useConfirmContext();
  const notification = useLiveChatNotifications();

  const { getConfig } = useCustomization();
  const componentConfig = getConfig('live_chat/message_composer/*');
  const commentInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);

  const { queryMentionees, mentionees, onChange, markup, metadata, text } = useMention({
    targetId: channel.channelId,
    targetType: 'channel',
  });

  const { isModerator } = useChannelPermission(channel.channelId);

  const { formatMessage } = useIntl();

  const sendMessage = async () => {
    if (!channel) return;
    if (text?.trim().length === 0) return;

    if (text.trim().length > COMPOSEBAR_MAX_CHARACTER_LIMIT) {
      confirm({
        title: formatMessage({ id: 'livechat.error.tooLongMessage.title' }),
        content: formatMessage({ id: 'livechat.error.tooLongMessage.description' }),
        okText: formatMessage({ id: 'general.action.ok' }),
      });
      return;
    }

    try {
      await MessageRepository.createMessage({
        tags: [],
        subChannelId: channel.channelId,
        data: { text: text.trim() },
        dataType: 'text',
        mentionees,
        metadata,
        parentId: replyMessage?.messageId || undefined,
      });

      onChange({ text: '', plainText: '', mentions: [] });
    } catch (error) {
      const errorMessage = (error as Error).message;
      let notificationMessage = formatMessage({ id: 'livechat.error.sendingMessage.error' });

      if (errorMessage === 'Amity SDK (400308): Text contain blocked word') {
        notificationMessage = formatMessage({ id: 'livechat.error.sendingMessage.blockedWord' });
      } else if (
        errorMessage === 'Amity SDK (400309): Data contain link that is not in whitelist'
      ) {
        notificationMessage = formatMessage({ id: 'livechat.error.sendingMessage.notAllowLink' });
      } else if (errorMessage === 'Amity SDK (400302): User is muted') {
        notificationMessage = formatMessage({ id: 'livechat.member.muted.error' });
      }

      notification.error({
        content: notificationMessage,
      });

      return;
    }

    setMentionList({});
    clearReplyMessage && clearReplyMessage();
  };

  useEffect(() => {
    commentInputRef.current?.focus();
  }, []);

  return (
    <div className={styles.composeBarContainer}>
      <div className={styles.composeBar}>
        <div className={styles.textInputContainer}>
          <InputText
            ref={commentInputRef}
            suggestionRef={suggestionRef}
            data-qa-anchor="live-chat-compose-bar"
            multiline
            disabled={disabled}
            placeholder={
              componentConfig?.placeholder_text ||
              formatMessage({
                id: 'livechat.composebar.placeholder',
              })
            }
            mentionAllowed
            isModerator={isModerator}
            loadMoreMentionees={(query) => queryMentionees(query)}
            onChange={(e) => {
              onChange({
                text: e.text,
                plainText: e.plainText,
                mentions: e.mentions,
              });
            }}
            value={markup}
            queryMentionees={queryMentionees}
          />
        </div>
        <div className={styles.sendButtonContainer}>
          <ArrowTop className={styles.sendButton} onClick={() => sendMessage()} />
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
