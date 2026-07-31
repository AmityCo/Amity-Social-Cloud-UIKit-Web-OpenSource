import clsx from 'clsx';
import { forwardRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import styles from './User.module.css';

export type UserData = {
  userId: string;
  title: string;
  username?: string;
  description?: string;
  actionLabel?: string;
  disabled?: boolean;
};

export type UserProps = {
  user: UserData;
  onActionClick?: (user: UserData) => void;
  className?: string;
};

export const User = forwardRef<HTMLDivElement, UserProps>(function User(
  { user, onActionClick, className },
  ref,
) {
  return (
    <div
      ref={ref}
      className={clsx(styles.user, className)}
      data-disabled={user.disabled || undefined}
    >
      <div className={styles.user__texts}>
        <span className={styles.user__title}>{user.title}</span>
        {user.username ? <span className={styles.user__username}>{user.username}</span> : null}
        {user.description ? (
          <span className={styles.user__description}>{user.description}</span>
        ) : null}
      </div>
      {user.actionLabel ? (
        <AriaButton
          className={styles.user__action}
          isDisabled={user.disabled}
          onPress={() => onActionClick?.(user)}
        >
          {user.actionLabel}
        </AriaButton>
      ) : null}
    </div>
  );
});
