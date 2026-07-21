import { useNetworkState } from 'react-use';
import { Button as AriaButton } from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Button } from '~/v4/core/design/atoms/Button';
import { ChevronLeft } from '~/v4/core/design/icons/ChevronLeft';
import { Loader } from '~/v4/core/design/atoms/Loader';
import { Avatar } from '~/v4/chat/elements/Avatar';
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
      <Button.Icon
        icon={<ChevronLeft />}
        styleType="ghost"
        hierarchy="secondary"
        size={32}
        onPress={onBack}
        aria-label="Back"
      />
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
        <AriaButton
          type="button"
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
                <Loader.Spinner size="sm" />
                <Typography.Caption className={styles.header__subtitleText}>
                  {waitingForNetworkLabel}
                </Typography.Caption>
              </div>
            ) : null}
          </div>
        </AriaButton>
      )}
    </header>
  );
}
