import React from 'react';
import styles from './EmptyNotification.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Data } from '~/v4/icons/Data';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';

type EmptyNotificationProps = {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
};

export const EmptyNotification = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
}: EmptyNotificationProps) => {
  const elementId = 'empty_notification';

  const { accessibilityId, themeStyles, isExcluded, config, defaultConfig, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div data-testid={accessibilityId} style={themeStyles} className={styles.emptyNotification}>
      <IconComponent
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
        imgIcon={() => <img src={config.image} alt={uiReference} className={imgClassName} />}
        defaultIcon={() => (
          <Data className={clsx(styles.emptyNotification__icon, defaultClassName)} />
        )}
      />

      <Typography.TitleBold className={styles.emptyNotification__text}>
        {config.text}
      </Typography.TitleBold>
    </div>
  );
};
