import React from 'react';
import styles from './CommunityPrivacyPublicIcon.module.css';
import clsx from 'clsx';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import World from '~/v4/icons/World';

type CommunityPrivacyPublicIconProps = {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
};

export const CommunityPrivacyPublicIcon = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
}: CommunityPrivacyPublicIconProps) => {
  const elementId = 'community_privacy_public_icon';
  const { isExcluded, config, uiReference, accessibilityId, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <div className={styles.communityPrivacyPublicIcon_iconWrapper}>
      <IconComponent
        defaultIcon={() => (
          <World className={clsx(styles.communityPrivacyPublicIcon_icon, defaultClassName)} />
        )}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
        data-testid={accessibilityId}
      />
    </div>
  );
};
