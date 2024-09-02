import React from 'react';
import styles from './AnnouncementBadge.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { FeaturedIcon } from '~/v4/icons/Featured/Featured';

interface AnnouncementBadge {
  pageId?: string;
  componentId?: string;
}

export const AnnouncementBadge = ({ pageId = '*', componentId = '*' }: AnnouncementBadge) => {
  const elementId = 'announcement_badge';
  const { config, isExcluded, accessibilityId, uiReference, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      data-qa-anchor={accessibilityId}
      defaultIcon={() => <FeaturedIcon className={styles.announcementBadge} />}
      imgIcon={() => <img src={config.icon} alt={uiReference} />}
      configIconName={config.icon}
      defaultIconName={defaultConfig.icon}
    />
  );
};
