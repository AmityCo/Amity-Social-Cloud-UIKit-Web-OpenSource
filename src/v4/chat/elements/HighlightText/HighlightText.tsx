import type { ReactNode } from 'react';
import Linkify from 'linkify-react';
import { Button as AriaButton } from 'react-aria-components';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import type { MentionMetadata } from '~/v4/chat/types';
import styles from './HighlightText.module.css';

type HighlightTextProps = {
  text: string;
  metadata?: MentionMetadata | null;
  mentionees?: Amity.Message['mentionees'];
  variant?: 'inbound' | 'outbound';
};

const LINKIFY_OPTIONS = { target: '_blank', rel: 'noopener noreferrer' } as const;

export function HighlightText({
  text,
  metadata,
  mentionees,
  variant = 'inbound',
}: HighlightTextProps) {
  const { AmityMessageBubbleBehavior } = usePageBehavior();
  const onMentionUserTap = AmityMessageBubbleBehavior?.onMentionUserTap;

  const mentioned = metadata?.mentioned ?? [];
  if (mentioned.length === 0) {
    return <Linkify options={LINKIFY_OPTIONS}>{text}</Linkify>;
  }

  const resolvedUserIds = new Set(
    (mentionees ?? []).flatMap((mentionee) =>
      mentionee.type === 'user' ? (mentionee as Amity.UserMention).userIds : [],
    ),
  );

  const sorted = [...mentioned].sort((a, b) => a.index - b.index);
  const out: ReactNode[] = [];
  let cursor = 0;

  sorted.forEach((m, i) => {
    const startsWithAt = text.charAt(m.index) === '@';
    const span = startsWithAt ? m.length + 1 : m.length;
    const start = Math.max(m.index, cursor);
    const end = Math.min(start + span, text.length);

    if (start > cursor) {
      out.push(
        <Linkify key={`t-${cursor}`} options={LINKIFY_OPTIONS}>
          {text.slice(cursor, start)}
        </Linkify>,
      );
    }

    if (end > start) {
      const label = text.slice(start, end);
      const mentionedUserId = m.userId;
      const isChannelMention = m.type === 'channel';
      const isResolvedUser = !!mentionedUserId && resolvedUserIds.has(mentionedUserId);

      if (isResolvedUser) {
        out.push(
          <AriaButton
            key={`m-${i}`}
            className={styles.highlightText__mention}
            data-variant={variant}
            onPress={() => onMentionUserTap?.({ userId: mentionedUserId })}
            aria-label={`View profile of ${label}`}
          >
            {label}
          </AriaButton>,
        );
      } else if (isChannelMention) {
        out.push(
          <span key={`m-${i}`} className={styles.highlightText__mention} data-variant={variant}>
            {label}
          </span>,
        );
      } else {
        out.push(<span key={`m-${i}`}>{label}</span>);
      }
    }

    cursor = end;
  });

  if (cursor < text.length) {
    out.push(
      <Linkify key="t-tail" options={LINKIFY_OPTIONS}>
        {text.slice(cursor)}
      </Linkify>,
    );
  }

  return <>{out}</>;
}
