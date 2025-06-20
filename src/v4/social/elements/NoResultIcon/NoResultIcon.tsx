import clsx from 'clsx';
import React from 'react';
import { NoResultIcon as $NoResultIcon } from '~/v4/icons/NoResult';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './NoResultIcon.module.css';

type NoResultIconProps = {
  pageId?: string;
  componentId?: string;
  imgClassName?: string;
  iconClassName?: string;
};

export const NoResultIcon = ({
  pageId = '*',
  imgClassName,
  iconClassName,
  componentId = '*',
}: NoResultIconProps) => {
  const elementId = 'no_result_icon';
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
      defaultIcon={() => <$NoResultIcon className={clsx(styles.noResultIcon, iconClassName)} />}
    />
  );
};
