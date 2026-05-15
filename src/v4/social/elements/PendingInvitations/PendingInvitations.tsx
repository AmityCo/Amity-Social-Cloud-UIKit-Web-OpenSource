import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import ChevronRight from '~/v4/icons/ChevronRight';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button/Button';
import { PendingInvitations as PendingInvitationsIcon } from '~/v4/icons/PendingInvitation';
import styles from './PendingInvitations.module.css';

type PendingInvitationsProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  imgIconClassName?: string;
  defaultIconClassName?: string;
};

export const PendingInvitations = ({
  pageId = '*',
  componentId = '*',
  imgIconClassName,
  defaultIconClassName,
  ...props
}: PendingInvitationsProps) => {
  const elementId = 'pending_invitations';

  const {
    themeStyles,
    isExcluded,
    config,
    accessibilityId,
    uiReference,
    defaultConfig,
    resolveText,
  } = useAmityElement({ pageId, componentId, elementId });

  if (isExcluded) return null;

  return (
    <Button
      {...props}
      type="button"
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.pendingInvitations}
    >
      <div className={styles.pendingInvitations__iconContainer}>
        <IconComponent
          configIconName={config.icon}
          defaultIconName={defaultConfig.icon}
          imgIcon={() => <img src={config.icon} alt={uiReference} className={imgIconClassName} />}
          defaultIcon={() => (
            <PendingInvitationsIcon
              className={clsx(styles.pendingInvitations__icon, defaultIconClassName)}
            />
          )}
        />
        {resolveText('amity_social_setting_community_setting_pending_invitations') && (
          <Typography.Body>
            {resolveText('amity_social_setting_community_setting_pending_invitations')}
          </Typography.Body>
        )}
      </div>
      <ChevronRight className={styles.pendingInvitations__arrowIcon} />
    </Button>
  );
};
