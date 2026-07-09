import { Avatar } from '~/v4/chat/elements/Avatar';
import UserFilled from '~/v4/icons/UserFilled';
import styles from './ConversationChatAvatar.module.css';

type ConversationChatAvatarProps = {
  user?: Amity.User;
  isDeleted?: boolean;
};

export function ConversationChatAvatar({ user, isDeleted }: ConversationChatAvatarProps) {
  if (isDeleted) {
    return (
      <div className={styles.conversationChatAvatar__deleted}>
        <UserFilled className={styles.conversationChatAvatar__deletedIcon} />
      </div>
    );
  }

  if (!user) return null;

  return <Avatar.User user={user} size="md" />;
}
