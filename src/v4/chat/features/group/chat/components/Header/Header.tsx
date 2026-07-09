import { useNetworkState } from 'react-use';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Spinner } from '~/v4/social/internal-components/Spinner';
import { Avatar } from '~/v4/chat/elements/Avatar';
import { IconButton } from '~/v4/chat/elements/IconButton';
import { useString } from '~/v4/core/localization';
import styles from './Header.module.css';

type HeaderProps = {
  channel: Amity.Channel | null;
  channelDisplayName?: string;
  variant?: 'default' | 'banned';
  onBack: () => void;
  onOpenSettings: () => void;
};

export function Header({
  channel,
  channelDisplayName,
  variant = 'default',
  onBack,
  onOpenSettings,
}: HeaderProps) {
  const { online } = useNetworkState();
  const isOnline = online !== false;
  const avatar = channel?.avatar;
  const isBanned = variant === 'banned';
  const waitingForNetworkLabel = useString('amity_chat_waiting_for_network');
  const emptyChatLabel = useString('amity_chat_error_banned_chat_navbar_title');

  return (
    <header className={styles.header} data-variant={variant}>
      <IconButton icon="chevron-left" variant="transparent" onPress={onBack} aria-label="Back" />
      {isBanned ? (
        <div className={styles.header__identity} data-variant="banned">
          <div className={styles.header__avatar} data-variant="banned">
            <Avatar.GroupChat avatar={avatar} variant="banned" />
          </div>
          <div className={styles.header__title}>
            <Typography.TitleBold className={styles.header__name} data-variant="banned">
              {emptyChatLabel}
            </Typography.TitleBold>
          </div>
        </div>
      ) : (
        <Button
          type="button"
          variant="default"
          onPress={onOpenSettings}
          className={styles.header__identity}
          aria-label="Open group settings"
        >
          <div className={styles.header__avatar}>
            <Avatar.GroupChat avatar={avatar} />
          </div>
          <div className={styles.header__title}>
            <Typography.TitleBold className={styles.header__name}>
              {channelDisplayName ?? ''}
            </Typography.TitleBold>
            {!isOnline ? (
              <div className={styles.header__subtitle}>
                <Spinner />
                <Typography.Caption className={styles.header__subtitleText}>
                  {waitingForNetworkLabel}
                </Typography.Caption>
              </div>
            ) : null}
          </div>
        </Button>
      )}
    </header>
  );
}
