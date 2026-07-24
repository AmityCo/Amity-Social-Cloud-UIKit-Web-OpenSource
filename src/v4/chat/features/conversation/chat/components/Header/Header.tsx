import { useState } from 'react';
import { useNetworkState } from 'react-use';
import { Button as AriaButton } from 'react-aria-components';
import { FileRepository } from '@amityco/ts-sdk';
import { useString } from '~/v4/core/localization';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { Loader } from '~/v4/core/design/atoms/Loader';
import { Avatar } from '~/v4/core/design/atoms/Avatar';
import { Button } from '~/v4/core/design/atoms/Button';
import { Banner } from '~/v4/core/design/atoms/Banner';
import { ChevronLeft } from '~/v4/core/design/icons/ChevronLeft';
import { ImageViewer } from '~/v4/chat/features/shared/components/ImageViewer';
import { ActionMenu, type ActionMenuItem } from '~/v4/chat/components/ActionMenu';
import styles from './Header.module.css';

type HeaderProps = {
  userId?: string;
  onBack: () => void;
  userDisplayName?: string;
  actions: ActionMenuItem[];
};

export function Header({ userId, userDisplayName, onBack, actions }: HeaderProps) {
  const { online } = useNetworkState();
  const isOnline = online !== false;
  const { user } = useUser({ userId, shouldCall: !!userId });
  const waitingForNetwork = useString('amity_chat_waiting_for_network');
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  const displayName = userDisplayName ?? user?.displayName ?? '';
  const initials = displayName.trim().charAt(0).toUpperCase() || '?';
  const imageUrl = user?.avatar?.fileUrl
    ? FileRepository.fileUrlWithSize(user.avatar.fileUrl, 'large')
    : undefined;

  const leading = user ? (
    imageUrl ? (
      <AriaButton
        className={styles.header__avatarButton}
        onPress={() => setIsViewerOpen(true)}
        aria-label="View profile picture"
      >
        <Avatar variant="image" shape="rounded" size={40} imageUrl={imageUrl} alt={displayName} />
      </AriaButton>
    ) : (
      <Avatar variant="text" shape="rounded" size={40} initials={initials} alt={displayName} />
    )
  ) : undefined;

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
        header={displayName}
        description={isOnline ? undefined : waitingForNetwork}
        descriptionIcon={isOnline ? undefined : <Loader.Spinner size="sm" />}
        trailing={
          actions.length > 0
            ? [
                <ActionMenu
                  key="actions"
                  getItems={() => actions}
                  ariaLabel="Conversation actions"
                />,
              ]
            : undefined
        }
      />
      {isViewerOpen && imageUrl ? (
        <ImageViewer src={imageUrl} onClose={() => setIsViewerOpen(false)} />
      ) : null}
    </header>
  );
}
