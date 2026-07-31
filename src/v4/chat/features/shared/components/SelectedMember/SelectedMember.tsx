import { FileRepository } from '@amityco/ts-sdk';
import { Avatar } from '~/v4/core/design/atoms/Avatar';
import { Button } from '~/v4/core/design/atoms/Button';
import { Cross } from '~/v4/core/design/icons/Cross';
import { Typography } from '~/v4/core/components/Typography/Typography';
import styles from './SelectedMember.module.css';

type SelectedMemberProps = {
  user: Amity.User;
  onRemove?: (userId: string) => void;
};

export function SelectedMember({ user, onRemove }: SelectedMemberProps) {
  const displayName = user.displayName ?? user.userId;
  const initials = displayName.trim().charAt(0).toUpperCase() || '?';
  const imageUrl = user.avatar?.fileUrl
    ? FileRepository.fileUrlWithSize(user.avatar.fileUrl, 'small')
    : undefined;

  return (
    <div className={styles.selectedMember}>
      <div className={styles.selectedMember__avatarWrapper}>
        <Avatar
          variant={imageUrl ? 'image' : 'text'}
          shape="rounded"
          size={40}
          imageUrl={imageUrl}
          initials={initials}
          alt={displayName}
        />
        {onRemove && (
          <Button.Icon
            className={styles.selectedMember__removeButton}
            icon={<Cross />}
            styleType="transparent"
            hierarchy="primary"
            size={16}
            onPress={() => onRemove(user.userId)}
            aria-label={`Remove ${displayName}`}
          />
        )}
      </div>
      <Typography.Caption className={styles.selectedMember__name}>{displayName}</Typography.Caption>
    </div>
  );
}
