import React from 'react';
import styles from './NoInternetConnection.module.css';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { NoInternetConnection as NoInternetConnectionIcon } from '~/v4/icons/NoInternetConnection';
import { Typography } from '~/v4/core/components';
import clsx from 'clsx';

type NoInternetConnectionProps = {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
};

export const NoInternetConnection = ({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
}: NoInternetConnectionProps) => {
  const elementId = 'no_internet_connection';

  const { accessibilityId, themeStyles, isExcluded, config, defaultConfig, uiReference } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  return (
    <div data-testid={accessibilityId} style={themeStyles} className={styles.noInternetConnection}>
      <IconComponent
        configIconName={config.image}
        defaultIconName={defaultConfig.image}
        imgIcon={() => <img src={config.image} alt={uiReference} className={imgClassName} />}
        defaultIcon={() => (
          <NoInternetConnectionIcon
            className={clsx(styles.noInternetConnection__icon, defaultClassName)}
          />
        )}
      />

      <Typography.TitleBold className={styles.noInternetConnection__text}>
        {config.text}
      </Typography.TitleBold>
    </div>
  );
};
