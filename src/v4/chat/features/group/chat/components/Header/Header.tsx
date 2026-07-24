import { useNetworkState } from 'react-use';
import { useString } from '~/v4/core/localization';
import { Button } from '~/v4/core/design/atoms/Button';
import { Banner } from '~/v4/core/design/atoms/Banner';
import { Loader } from '~/v4/core/design/atoms/Loader';
import { ChevronLeft } from '~/v4/core/design/icons/ChevronLeft';
import { Avatar } from '~/v4/chat/elements/Avatar';
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

  const leading = (
    <div className={styles.header__avatar}>
      <Avatar.GroupChat avatar={avatar} variant={variant} />
    </div>
  );

  return (
    <header className={styles.header}>
      <Banner
        className={styles.header__banner}
        leadingController={
          <Button.Icon
            icon={<ChevronLeft />}
            styleType="ghost"
            hierarchy="secondary"
            size={32}
            onPress={onBack}
            aria-label="Back"
          />
        }
        leading={leading}
        header={
          isBanned ? (
            <span className={styles.header__bannedName}>{emptyChatLabel}</span>
          ) : (
            channelDisplayName ?? ''
          )
        }
        description={!isBanned && !isOnline ? waitingForNetworkLabel : undefined}
        descriptionIcon={!isBanned && !isOnline ? <Loader.Spinner size="sm" /> : undefined}
        onPress={isBanned ? undefined : onOpenSettings}
        onPressLabel={isBanned ? undefined : 'Open group settings'}
      />
    </header>
  );
}
