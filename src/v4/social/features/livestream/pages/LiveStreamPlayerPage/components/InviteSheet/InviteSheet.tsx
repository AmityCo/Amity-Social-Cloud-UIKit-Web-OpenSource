import React, { useState } from 'react';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import styles from './InviteSheet.module.css';
import { UserAvatar } from '~/v4/social/elements';
import { HostBadge } from '~/v4/social/elements/HostBadge';
import CloseIcon from '~/v4/icons/Close';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

export interface InviteSheetProps {
  onCloseSheet: () => void;
  onAccept: () => void;
  host: Amity.User;
  coHost: Amity.User;
}

export const InviteSheet: React.FC<InviteSheetProps> = ({
  onCloseSheet,
  onAccept,
  host,
  coHost,
}) => {
  return (
    <>
      <div className={styles.inviteSheet}>
        <div className={styles.inviteSheet__header}>
          <Button
            variant="default"
            onPress={() => {
              onCloseSheet();
            }}
          >
            <CloseIcon className={styles.inviteSheet__closeIcon} />
          </Button>
        </div>
        <div className={styles.inviteSheet__avatar__wrapper}>
          <div className={styles.inviteSheet__hostAvatar}>
            <UserAvatar
              className={styles.inviteSheet__avatar}
              userData={host}
              textPlaceholderClassName={styles.inviteSheet__avatar__text}
            />
            <HostBadge className={styles.inviteSheet__hostBadge} />
          </div>
          <div className={styles.inviteSheet__coHostAvatar}>
            <UserAvatar
              className={styles.inviteSheet__avatar}
              userData={coHost}
              textPlaceholderClassName={styles.inviteSheet__avatar__text}
            />
          </div>
        </div>
        <div className={styles.inviteSheet__text__wrapper}>
          <Typography.Headline className={styles.inviteSheet__title}>
            Join as co-host
          </Typography.Headline>
          <Typography.Body className={styles.inviteSheet__description}>
            {host.displayName} invited you to join their livestream as a co-host. You’ll enter a
            backstage room to set up before going live.
          </Typography.Body>
        </div>
        <div className={styles.inviteSheet__footer}>
          <Button
            color="secondary"
            variant="outlined"
            className={styles.inviteSheet__footer__button}
            onPress={onCloseSheet}
          >
            Decline
          </Button>
          <Button className={styles.inviteSheet__footer__button} onPress={onAccept}>
            Accept
          </Button>
        </div>
      </div>
    </>
  );
};
