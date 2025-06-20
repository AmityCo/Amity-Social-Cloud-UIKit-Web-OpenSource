import React from 'react';
import styles from './CommunityPrivacyIcon.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';

type CommunityPrivacyIconProps = {
  pageId?: string;
  componentId?: string;
  elementId: string;
  imgClassName?: string;
  defaultIcon: JSX.Element;
};

export const CommunityPrivacyIcon = ({
  pageId = '*',
  componentId = '*',
  elementId,
  imgClassName,
  defaultIcon,
}: CommunityPrivacyIconProps) => {
  const { isExcluded, config, uiReference, accessibilityId, defaultConfig } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;
  return (
    <div className={styles.communityPrivacyIcon_iconWrapper}>
      <IconComponent
        defaultIcon={() => defaultIcon}
        imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
        defaultIconName={defaultConfig.icon}
        configIconName={config.icon}
        data-testid={accessibilityId}
      />
    </div>
  );
};
