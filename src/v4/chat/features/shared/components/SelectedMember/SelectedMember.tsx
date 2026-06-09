import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Avatar } from '~/v4/chat/elements/Avatar';
import CloseIcon from '~/v4/icons/Close';
import styles from './SelectedMember.module.css';

type SelectedMemberProps = {
  user: Amity.User;
  onRemove?: (userId: string) => void;
};

export function SelectedMember({ user, onRemove }: SelectedMemberProps) {
  const displayName = user.displayName ?? user.userId;
  return (
    <div className={styles.selectedMember}>
      <div className={styles.selectedMember__avatarWrapper}>
        <Avatar.User user={user} size="md" />
        {onRemove && (
          <Button
            variant="default"
            className={styles.selectedMember__removeButton}
            onPress={() => onRemove(user.userId)}
            aria-label={`Remove ${displayName}`}
          >
            <CloseIcon className={styles.selectedMember__removeIcon} />
          </Button>
        )}
      </div>
      <Typography.Caption className={styles.selectedMember__name}>{displayName}</Typography.Caption>
    </div>
  );
}
