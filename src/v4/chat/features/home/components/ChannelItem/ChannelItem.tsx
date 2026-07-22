import type { ReactNode } from 'react';
import { Skeleton } from '~/v4/core/design/components/Skeleton/Skeleton';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useChatNavigation, ChatPageTypes } from '~/v4/chat/providers/ChatNavigationProvider';
import { formatTimestamp } from '~/v4/chat/utils/timestamp';
import { Avatar } from '~/v4/chat/elements/Avatar';
import { ConversationChatAvatar } from '~/v4/chat/elements/ConversationChatAvatar/ConversationChatAvatar';
import { hasModeratorRole } from '~/v4/chat/utils/isModerator';
import { Badge } from '~/v4/core/design/atoms/Badge';
import { Trash } from '~/v4/core/design/icons/Trash';
import { Image } from '~/v4/core/design/icons/Image';
import { CirclePlay } from '~/v4/core/design/icons/CirclePlay';
import { At } from '~/v4/core/design/icons/At';
import { ArchivedBadge } from '~/v4/chat/elements/ArchivedBadge';
import { highlightMatch } from '~/v4/chat/utils/highlightMatch';
import styles from './ChannelItem.module.css';

type ChannelItemProps = {
  channel: Amity.Channel;
  searchQuery?: string;
  isArchived?: boolean;
  messageBodyOverride?: string;
  timestampOverride?: Amity.timestamp;
  hideUnreadIndicators?: boolean;
  highlightStyle?: 'primary' | 'bold';
  onPress?: () => void;
};

type PreviewStrings = {
  noMessage: string;
  sentPhoto: string;
  sentVideo: string;
  noPreview: string;
};

function formatMemberCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return String(count);
}

function getPreviewText(preview: Amity.Channel['messagePreview'], t: PreviewStrings): string {
  if (!preview) return t.noMessage;

  const text = (preview.data as { text?: string } | undefined)?.text;
  if (typeof text === 'string' && text.length > 0) return text;

  switch (preview.dataType) {
    case 'text':
      return text ?? '';
    case 'image':
      return t.sentPhoto;
    case 'video':
      return t.sentVideo;
    case 'file':
    case 'audio':
      return t.noPreview;
    default:
      return t.noMessage;
  }
}

function ChannelAvatar({ channel }: { channel: Amity.Channel }) {
  const { currentUserId } = useSDK();

  if (channel.type === 'conversation') {
    const otherMember = channel.previewMembers?.find((m) => m.userId !== currentUserId);
    const isDeleted = (otherMember?.user as (Amity.RawUser & { isDeleted?: boolean }) | undefined)
      ?.isDeleted;
    const isModerator = hasModeratorRole(otherMember?.roles);
    return (
      <ConversationChatAvatar
        user={otherMember?.user}
        isDeleted={isDeleted}
        isModerator={isModerator}
      />
    );
  }

  return <Avatar.GroupChat avatar={channel.avatar} isPublic={channel.isPublic} />;
}

function ChannelName({
  channel,
  searchQuery,
  highlightClassName,
}: {
  channel: Amity.Channel;
  searchQuery?: string;
  highlightClassName: string;
}) {
  const { currentUserId } = useSDK();
  const deletedUserLabel = useString('amity_chat_deleted_user');

  if (channel.type === 'conversation') {
    const otherMember = channel.previewMembers?.find((m) => m.userId !== currentUserId);
    const isDeleted = (otherMember?.user as (Amity.RawUser & { isDeleted?: boolean }) | undefined)
      ?.isDeleted;
    if (isDeleted) {
      return (
        <Typography.TitleBold className={styles.channelItem__nameDeleted}>
          {deletedUserLabel}
        </Typography.TitleBold>
      );
    }
    const name = otherMember?.user?.displayName ?? channel.displayName ?? '';
    return (
      <Typography.TitleBold className={styles.channelItem__name}>
        {searchQuery ? highlightMatch(name, searchQuery, highlightClassName) : name}
      </Typography.TitleBold>
    );
  }

  const memberCount = channel.memberCount;
  const name = channel.displayName ?? '';
  return (
    <>
      <Typography.TitleBold className={styles.channelItem__name}>
        {searchQuery ? highlightMatch(name, searchQuery, highlightClassName) : name}
      </Typography.TitleBold>
      {memberCount != null && memberCount > 0 && (
        <Typography.Caption className={styles.channelItem__memberCount}>
          ({formatMemberCount(memberCount)})
        </Typography.Caption>
      )}
    </>
  );
}

const MENTION_REGEX = /@\S+/g;

function MessagePreview({
  preview,
  searchQuery,
  bodyOverride,
  highlightClassName,
}: {
  preview: Amity.Channel['messagePreview'];
  searchQuery?: string;
  bodyOverride?: string;
  highlightClassName: string;
}) {
  const previewDeletedLabel = useString('amity_chat_preview_deleted');
  const previewStrings: PreviewStrings = {
    noMessage: useString('amity_chat_preview_no_message'),
    sentPhoto: useString('amity_chat_preview_sent_photo'),
    sentVideo: useString('amity_chat_preview_sent_video'),
    noPreview: useString('amity_chat_message_no_preview'),
  };

  if (bodyOverride !== undefined) {
    return (
      <Typography.Body className={styles.channelItem__preview}>
        {searchQuery ? highlightMatch(bodyOverride, searchQuery, highlightClassName) : bodyOverride}
      </Typography.Body>
    );
  }

  if (preview?.isDeleted) {
    return (
      <div className={styles.channelItem__previewWithIcon}>
        <Trash className={styles.channelItem__previewLeadingIcon} />
        <Typography.Body className={styles.channelItem__preview}>
          {previewDeletedLabel}
        </Typography.Body>
      </div>
    );
  }

  const text = getPreviewText(preview, previewStrings);

  if (preview?.dataType === 'image' || preview?.dataType === 'video') {
    const MediaIcon = preview.dataType === 'image' ? Image.Solid : CirclePlay.Solid;
    return (
      <div className={styles.channelItem__previewWithIcon}>
        <MediaIcon className={styles.channelItem__previewLeadingIcon} />
        <Typography.Body className={styles.channelItem__preview}>{text}</Typography.Body>
      </div>
    );
  }

  if (preview?.dataType !== 'text' || text.length === 0) {
    return <Typography.Body className={styles.channelItem__preview}>{text}</Typography.Body>;
  }

  const parts: ReactNode[] = [];
  let cursor = 0;
  let matchIndex = 0;

  for (const match of text.matchAll(MENTION_REGEX)) {
    const start = match.index ?? 0;
    const end = start + match[0].length;
    if (start > cursor) parts.push(<span key={`t-${cursor}`}>{text.slice(cursor, start)}</span>);
    parts.push(
      <span key={`m-${matchIndex}`} className={styles.channelItem__previewMention}>
        {match[0]}
      </span>,
    );
    cursor = end;
    matchIndex += 1;
  }

  if (parts.length === 0) {
    return <Typography.Body className={styles.channelItem__preview}>{text}</Typography.Body>;
  }

  if (cursor < text.length) parts.push(<span key="t-tail">{text.slice(cursor)}</span>);

  return <Typography.Body className={styles.channelItem__preview}>{parts}</Typography.Body>;
}

function MentionBadge() {
  return <Badge.Icon icon={<At.Solid />} preset={{ family: 'chat', case: 'mention' }} size={20} />;
}

function UnreadBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <Badge.Label
      label={count > 99 ? '99+' : String(count)}
      preset={{ family: 'general', case: 'notification' }}
      size={20}
    />
  );
}

function ChannelItemSkeleton() {
  return (
    <Skeleton className={styles.channelItem__skeletonRow}>
      <Skeleton.Circle width="2.5rem" height="2.5rem" />
      <Skeleton className={styles.channelItem__skeletonLines}>
        <Skeleton.Line width="8.75rem" height="0.625rem" radius="0.75rem" />
        <Skeleton.Line width="12.5rem" height="0.625rem" radius="0.75rem" />
      </Skeleton>
    </Skeleton>
  );
}

export function ChannelItem({
  channel,
  searchQuery,
  isArchived = false,
  messageBodyOverride,
  timestampOverride,
  hideUnreadIndicators = false,
  highlightStyle = 'primary',
  onPress,
}: ChannelItemProps) {
  const { push } = useChatNavigation();
  const { currentUserId } = useSDK();
  const timestampSource = timestampOverride ?? channel.lastActivity;
  const timestamp = timestampSource ? formatTimestamp(timestampSource) : '';
  const highlightClassName =
    highlightStyle === 'bold' ? styles.channelItem__highlightBold : styles.channelItem__highlight;

  function handlePress() {
    if (channel.type === 'conversation') {
      const otherMember = channel.previewMembers?.find((m) => m.userId !== currentUserId);
      push({
        type: ChatPageTypes.ChatPage,
        context: {
          channelId: channel.channelId,
          userId: otherMember?.userId,
          userDisplayName: otherMember?.user?.displayName,
          avatarUrl: otherMember?.user?.avatarFileId,
        },
      });
    } else {
      push({ type: ChatPageTypes.GroupChatPage, context: { channelId: channel.channelId } });
    }
  }

  return (
    <div className={styles.channelItem} onClick={onPress ?? handlePress}>
      <div className={styles.channelItem__avatarWrapper}>
        <ChannelAvatar channel={channel} />
      </div>
      <div className={styles.channelItem__body}>
        <div className={styles.channelItem__nameRow}>
          <div className={styles.channelItem__nameGroup}>
            <ChannelName
              channel={channel}
              searchQuery={searchQuery}
              highlightClassName={highlightClassName}
            />
          </div>
          <Typography.Caption className={styles.channelItem__timestamp}>
            {timestamp}
          </Typography.Caption>
        </div>
        <div className={styles.channelItem__previewRow}>
          <MessagePreview
            preview={channel.messagePreview}
            searchQuery={searchQuery}
            highlightClassName={highlightClassName}
            bodyOverride={messageBodyOverride}
          />
          <div className={styles.channelItem__notifications}>
            {!hideUnreadIndicators && channel.isMentioned && <MentionBadge />}
            {isArchived && <ArchivedBadge />}
            {!hideUnreadIndicators && <UnreadBadge count={channel.unreadCount ?? 0} />}
          </div>
        </div>
      </div>
    </div>
  );
}

ChannelItem.Skeleton = ChannelItemSkeleton;
