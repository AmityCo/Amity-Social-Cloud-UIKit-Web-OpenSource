import React from 'react';
import styles from './CommunityPrivacyPrivateIcon.module.css';
import clsx from 'clsx';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import Lock from '~/v4/icons/Lock';

type CommunityPrivacyPrivateIconProps = {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
};

export const CommunityPrivacyPrivateIcon = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
}: CommunityPrivacyPrivateIconProps) => {
  const elementId = 'community_privacy_private_icon';
  const { isExcluded, config, uiReference, accessibilityId, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <div className={styles.communityPrivacyPrivateIcon_iconWrapper}>
      <IconComponent
        defaultIcon={() => (
          <Lock className={clsx(styles.communityPrivacyPrivateIcon_icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
        data-testid={accessibilityId}
      />
    </div>
  );
};
