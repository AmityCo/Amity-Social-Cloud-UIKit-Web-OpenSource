import { useState } from 'react';
import { useNetworkState } from 'react-use';
import { Button as AriaButton } from 'react-aria-components';
import { FileRepository } from '@amityco/ts-sdk';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { Loader } from '~/v4/core/design/atoms/Loader';
import { Avatar } from '~/v4/core/design/atoms/Avatar';
import { Button } from '~/v4/core/design/atoms/Button';
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

  return (
    <header className={styles.header}>
      <Button.Icon
        icon={<ChevronLeft />}
        styleType="ghost"
        hierarchy="secondary"
        size={32}
        onPress={onBack}
        aria-label="Back"
      />
      <div className={styles.header__identity}>
        {user &&
          (imageUrl ? (
            <AriaButton
              className={styles.header__avatarButton}
              onPress={() => setIsViewerOpen(true)}
              aria-label="View profile picture"
            >
              <Avatar
                variant="image"
                shape="rounded"
                size={40}
                imageUrl={imageUrl}
                alt={displayName}
              />
            </AriaButton>
          ) : (
            <Avatar
              variant="text"
              shape="rounded"
              size={40}
              initials={initials}
              alt={displayName}
            />
          ))}
        <div className={styles.header__title}>
          <Typography.TitleBold className={styles.header__name}>{displayName}</Typography.TitleBold>
          {!isOnline ? (
            <div className={styles.header__subtitle}>
              <Loader.Spinner size="sm" />
              <Typography.Caption className={styles.header__subtitleText}>
                {waitingForNetwork}
              </Typography.Caption>
            </div>
          ) : null}
        </div>
      </div>
      {actions.length > 0 && (
        <ActionMenu getItems={() => actions} ariaLabel="Conversation actions" />
      )}
      {isViewerOpen && imageUrl ? (
        <ImageViewer src={imageUrl} onClose={() => setIsViewerOpen(false)} />
      ) : null}
    </header>
  );
}
