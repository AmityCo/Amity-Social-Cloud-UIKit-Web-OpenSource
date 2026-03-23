import React from 'react';
import { Typography } from '~/v4/core/components';
import { Search } from '~/v4/icons/Search';
import styles from './NoResultFound.module.css';

export interface NoResultFoundProps {
  text?: string;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactElement;
  variant?: 'body' | 'bodyBold';
  iconSize?: 'small' | 'medium';
}

export function NoResultFound({
  text = 'No results found',
  className,
  style,
  icon,
  variant = 'body',
  iconSize = 'small',
}: NoResultFoundProps) {
  const TextComponent = variant === 'bodyBold' ? Typography.BodyBold : Typography.Body;

  const iconElement = icon ? (
    React.cloneElement(icon, {
      className: `${styles.noResultFound__icon} ${icon.props.className ?? ''}`,
      'data-size': iconSize,
    })
  ) : (
    <Search className={styles.noResultFound__icon} data-size={iconSize} />
  );

  return (
    <div className={`${styles.noResultFound} ${className ?? ''}`} style={style}>
      {iconElement}
      <TextComponent as="p" className={styles.noResultFound__text}>
        {text}
      </TextComponent>
    </div>
  );
}
