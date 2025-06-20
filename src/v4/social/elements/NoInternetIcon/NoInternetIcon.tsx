import clsx from 'clsx';
import React from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { NoInternetConnection } from '~/v4/icons/NoInternetConnection';
import styles from './NoInternetIcon.module.css';

type NoInternetIconProps = {
  pageId?: string;
  componentId?: string;
  imgClassName?: string;
  iconClassName?: string;
};

export const NoInternetIcon = ({
  pageId = '*',
  imgClassName,
  iconClassName,
  componentId = '*',
}: NoInternetIconProps) => {
  const elementId = 'no_internet_icon';
  const { isExcluded, config, uiReference } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  return (
    <IconComponent
      configIconName={config.icon}
      imgIcon={() => <img src={config.icon} alt={uiReference} className={imgClassName} />}
      defaultIcon={() => (
        <NoInternetConnection className={clsx(styles.noInternetIcon, iconClassName)} />
      )}
    />
  );
};
