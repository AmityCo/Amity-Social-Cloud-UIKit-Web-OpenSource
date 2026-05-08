import React, { useState } from 'react';
import { useString } from '~/v4/core/localization';
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
  const joinAsCohostLabel = useString('amity_social_label_join_as_co_host');
  const cohostInvitationMessage = useString('amity_social_status_cohost_invitation_message');
  const rejectButtonLabel = useString('amity_social_button_community_invitation_reject_button');
  const acceptButtonLabel = useString('amity_social_button_accept_invite');

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
            {joinAsCohostLabel}
          </Typography.Headline>
          <Typography.Body className={styles.inviteSheet__description}>
            {cohostInvitationMessage.replace('%s', host.displayName ?? '')}
          </Typography.Body>
        </div>
        <div className={styles.inviteSheet__footer}>
          <Button
            color="secondary"
            variant="outlined"
            className={styles.inviteSheet__footer__button}
            onPress={onCloseSheet}
          >
            {rejectButtonLabel}
          </Button>
          <Button className={styles.inviteSheet__footer__button} onPress={onAccept}>
            {acceptButtonLabel}
          </Button>
        </div>
      </div>
    </>
  );
};
