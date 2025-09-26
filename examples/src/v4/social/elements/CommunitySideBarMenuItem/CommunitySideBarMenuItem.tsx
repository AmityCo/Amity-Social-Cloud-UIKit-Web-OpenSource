import clsx from 'clsx';
import React, { PropsWithChildren } from 'react';
import { Button } from '~/v4/core/natives/Button';
import styles from './CommunitySideBarMenuItem.module.css';

type CommunitySideBarMenuItemProps = PropsWithChildren<{
  isActive?: boolean;
  className?: string;
  onPress: () => void;
  isDisabled?: boolean;
  accessibilityId: string;
  themeStyles?: React.CSSProperties;
  icon?: (props: { 'data-active'?: boolean; className: string }) => React.ReactNode;
}>;

export const CommunitySideBarMenuItem = ({
  icon,
  onPress,
  isActive,
  children,
  className,
  isDisabled,
  themeStyles,
  accessibilityId,
}: CommunitySideBarMenuItemProps) => {
  return (
    <Button
      onPress={onPress}
      style={themeStyles}
      data-active={isActive}
      isDisabled={isDisabled}
      data-testid={accessibilityId}
      className={clsx(styles.communitySideBarMenuItem, className)}
    >
      {icon && (
        <span data-active={isActive} className={styles.communitySideBarMenuItem__iconWrapper}>
          {icon({ 'data-active': isActive, className: styles.communitySideBarMenuItem__icon })}
        </span>
      )}
      <span data-active={isActive} className={styles.communitySideBarMenuItem__label}>
        {children}
      </span>
    </Button>
  );
};
