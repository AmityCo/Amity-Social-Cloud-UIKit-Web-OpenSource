import { useNetworkState } from 'react-use';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { Avatar } from '~/v4/chat/elements/Avatar';
import { IconButton } from '~/v4/chat/elements/IconButton';
import styles from './Header.module.css';

type HeaderProps = {
  userId?: string;
  userDisplayName?: string;
  onBack: () => void;
  onOpenActions?: () => void;
};

export function Header({ userId, userDisplayName, onBack, onOpenActions }: HeaderProps) {
  const { online } = useNetworkState();
  const isOnline = online !== false;
  const { user } = useUser({ userId, shouldCall: !!userId });
  const waitingForNetwork = useString('amity_chat_waiting_for_network');

  return (
    <header className={styles.header}>
      <IconButton icon="chevron-left" variant="transparent" onPress={onBack} aria-label="Back" />
      <div className={styles.header__identity}>
        {user && <Avatar.User user={user} size="md" fullscreen />}
        <div className={styles.header__title}>
          <Typography.TitleBold className={styles.header__name}>
            {userDisplayName ?? ''}
          </Typography.TitleBold>
          {!isOnline ? (
            <div className={styles.header__subtitle}>
              <Spinner />
              <Typography.Caption className={styles.header__subtitleText}>
                {waitingForNetwork}
              </Typography.Caption>
            </div>
          ) : null}
        </div>
      </div>
      {onOpenActions && (
        <IconButton
          icon="ellipsis-v"
          variant="transparent"
          onPress={onOpenActions}
          aria-label="Open menu actions"
        />
      )}
    </header>
  );
}
