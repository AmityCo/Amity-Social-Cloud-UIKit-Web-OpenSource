import clsx from 'clsx';
import React from 'react';
import { Plus } from '~/v4/icons/Plus';
import { Typography } from '~/v4/core/components';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import styles from './CommunityInviteMemberButton.module.css';

type CommunityInviteMemberButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
  imgClassName?: string;
  iconClassName?: string;
};

export const CommunityInviteMemberButton = ({
  pageId = '*',
  imgClassName,
  iconClassName,
  componentId = '*',
  ...props
}: CommunityInviteMemberButtonProps) => {
  const elementId = 'community_invite_member_button';
  const {
    config,
    accessibilityId,
    themeStyles,
    isExcluded,
    defaultConfig,
    uiReference,
    resolveText,
  } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <Button
      {...props}
      type="button"
      style={themeStyles}
      aria-label={resolveText('amity_social_button_invite_member')}
      data-testid={accessibilityId}
      className={styles.communityInviteMemberButton}
    >
      <div className={styles.communityInviteMemberButton__iconContainer}>
        <IconComponent
          configIconName={config.image}
          defaultIconName={defaultConfig.image}
          imgIcon={() => <img src={config.image} alt={uiReference} className={imgClassName} />}
          defaultIcon={() => (
            <Plus className={clsx(styles.communityInviteMemberButton__icon, iconClassName)} />
          )}
        />
      </div>
      <Typography.Body className={styles.communityInviteMemberButton__label}>
        {resolveText('amity_social_button_invite_member')}
      </Typography.Body>
    </Button>
  );
};
