import clsx from 'clsx';
import React from 'react';
import { Bell } from '~/v4/icons/Bell';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { IconComponent } from '~/v4/core/IconComponent';
import { Button, ButtonProps } from '~/v4/core/natives/Button';
import useGetNotificationTraySeen from '~/v4/social/hooks/useGetNotificationTraySeen';
import styles from './NotificationTrayButton.module.css';

export interface NotificationTrayButtonProps {
  pageId?: string;
  componentId?: string;
  defaultClassName?: string;
  imgClassName?: string;
  onPress: ButtonProps['onPress'];
}

export function NotificationTrayButton({
  pageId = '*',
  componentId = '*',
  defaultClassName,
  imgClassName,
  onPress,
}: NotificationTrayButtonProps) {
  const elementId = 'notification_tray_button';
  const { accessibilityId, config, defaultConfig, isExcluded, uiReference, themeStyles } =
    useAmityElement({
      pageId,
      componentId,
      elementId,
    });

  if (isExcluded) return null;

  const { notificationTraySeen, isLoading } = useGetNotificationTraySeen();

  return (
    <Button
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.notificationTrayButton}
      onPress={onPress}
    >
      {!isLoading && !notificationTraySeen?.isSeen && (
        <div className={styles.notificationTrayButton__redDotWrapper}>
          <div className={styles.notificationTrayButton__redDot} />{' '}
        </div>
      )}
      <IconComponent
        defaultIcon={() => (
          <div className={styles.notificationTrayButton__icon}>
            <Bell className={clsx(styles.notificationTrayButton__svg, defaultClassName)} />
          </div>
        )}
        imgIcon={() => (
          <img
            style={themeStyles}
            src={config.image}
            alt={uiReference}
            className={clsx(styles.notificationTrayButton__icon, imgClassName)}
            data-testid={accessibilityId}
          />
        )}
        defaultIconName={defaultConfig.image}
        configIconName={config.image}
      />
    </Button>
  );
}
