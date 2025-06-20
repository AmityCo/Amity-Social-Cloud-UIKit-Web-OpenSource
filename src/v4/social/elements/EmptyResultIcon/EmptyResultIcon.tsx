import clsx from 'clsx';
import React from 'react';
import { List } from '~/v4/icons/List';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './EmptyResultIcon.module.css';

type EmptyResultIconProps = {
  pageId?: string;
  componentId?: string;
  imgClassName?: string;
  iconClassName?: string;
};

export const EmptyResultIcon = ({
  pageId = '*',
  imgClassName,
  iconClassName,
  componentId = '*',
}: EmptyResultIconProps) => {
  const elementId = 'empty_result_icon';
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
      defaultIcon={() => <List className={clsx(styles.emptyResultIcon, iconClassName)} />}
    />
  );
};
