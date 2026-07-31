import { FileRepository } from '@amityco/ts-sdk';
import { Avatar } from '~/v4/core/design/atoms/Avatar';
import { ModeratorBadge } from '~/v4/core/design/elements/ModeratorBadge';

type ConversationChatAvatarProps = {
  user?: Amity.User;
  isDeleted?: boolean;
  isModerator?: boolean;
};

export function ConversationChatAvatar({
  user,
  isDeleted,
  isModerator,
}: ConversationChatAvatarProps) {
  const indicator = isModerator ? <ModeratorBadge /> : undefined;

  if (isDeleted) {
    return <Avatar variant="icon" shape="rounded" size={40} indicator={indicator} />;
  }

  if (!user) return null;

  const displayName = user.displayName ?? user.userId ?? '';
  const initials = displayName.trim().charAt(0).toUpperCase() || '?';
  const imageUrl = user.avatar?.fileUrl
    ? FileRepository.fileUrlWithSize(user.avatar.fileUrl, 'large')
    : undefined;

  return (
    <Avatar
      variant={imageUrl ? 'image' : 'text'}
      shape="rounded"
      size={40}
      imageUrl={imageUrl}
      initials={initials}
      alt={displayName}
      indicator={indicator}
    />
  );
}
