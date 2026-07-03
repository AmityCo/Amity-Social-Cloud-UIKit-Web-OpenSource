import { SelectedMember } from '~/v4/chat/features/shared/components';
import styles from './SelectedUsersBar.module.css';

type SelectedUsersBarProps = {
  users: Amity.User[];
  onRemoveUser: (userId: string) => void;
};

export function SelectedUsersBar({ users, onRemoveUser }: SelectedUsersBarProps) {
  if (users.length === 0) return null;
  return (
    <div className={styles.selectedUsersBar}>
      <div className={styles.selectedUsersBar__list}>
        {users.map((user) => (
          <SelectedMember key={user.userId} user={user} onRemove={onRemoveUser} />
        ))}
      </div>
      <div className={styles.selectedUsersBar__divider} />
    </div>
  );
}
