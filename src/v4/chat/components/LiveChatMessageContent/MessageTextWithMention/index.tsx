import React from 'react';
import styles from './styles.module.css';
import { Typography } from '~/v4/core/components';
import { useCustomization } from '~/v4/core/providers/CustomizationProvider';
import HyperLinkText from '~/v4/core/components/HyperlinkText/index';

interface MessageTextWithMentionProps {
  message: Amity.Message<'text'>;
  className?: string;
}

const MessageTextWithMention = ({ message, className }: MessageTextWithMentionProps) => {
  const { getConfig } = useCustomization();

  // TODO: uncomment this when full configuration on the component is supported
  // const pageConfig = getConfig('live_chat/*/*');
  // const componentConfig = getConfig('live_chat/message_list/*');

  const mentionList = message.metadata?.mentioned as {
    index: number;
    userId: string;
    type: 'user' | 'channel';
    length: number;
  }[];
  const mentionListSorted = mentionList?.sort((a, b) => a.index - b.index);

  if (mentionListSorted?.length) {
    const messageText = message.data?.text || '';
    const segments = [];

    let currentIndex = 0;

    mentionListSorted.forEach((mention) => {
      const start = mention.index;
      const end = mention.index + mention.length + 1;
      const beforeMention = messageText.slice(currentIndex, start);
      const mentionText = messageText.slice(start, end);

      if (beforeMention) {
        segments.push({ text: beforeMention, isMention: false });
      }

      segments.push({ text: mentionText, isMention: true });
      currentIndex = end;
    });

    const afterLastMention = messageText.slice(currentIndex);
    if (afterLastMention) {
      segments.push({ text: afterLastMention, isMention: false });
    }

    return (
      <Typography.Body className={className}>
        {segments.map((segment, index) =>
          segment.isMention ? (
            <span
              key={index}
              className={styles.mentionText}
              // TODO: uncomment this when full configuration on the component is supported
              // style={{
              //   color:
              //     componentConfig?.theme?.dark?.primary_color ||
              //     pageConfig?.theme?.dark?.primary_color,
              // }}
            >
              {segment.text}
            </span>
          ) : (
            <span key={index}>
              <HyperLinkText>{segment.text}</HyperLinkText>
            </span>
          ),
        )}
      </Typography.Body>
    );
  }

  return (
    <Typography.Body className={className}>
      <HyperLinkText>{message.data?.text}</HyperLinkText>
    </Typography.Body>
  );
};

export default MessageTextWithMention;
