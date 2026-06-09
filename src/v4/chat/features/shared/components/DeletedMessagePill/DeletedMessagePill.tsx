import { Typography } from '~/v4/core/components/Typography/Typography';
import { TrashIcon } from '~/v4/icons/Trash';
import { useString } from '~/v4/core/localization';
import styles from './DeletedMessagePill.module.css';

type DeletedMessagePillProps = {
  isUser: boolean;
};

export function DeletedMessagePill({ isUser }: DeletedMessagePillProps) {
  const deletedLabel = useString('amity_chat_message_deleted');
  return (
    <div className={styles.deletedMessagePill} data-user={isUser ? 'own' : 'other'}>
      <TrashIcon className={styles.deletedMessagePill__icon} />
      <Typography.Caption className={styles.deletedMessagePill__label}>
        {deletedLabel}
      </Typography.Caption>
    </div>
  );
}
