import React from 'react';
import { useString } from '~/v4/core/localization';
import styles from './PrivateEventBanner.module.css';

export type PrivateEventBannerProps = {
  className?: string;
};

export function PrivateEventBanner({ className }: PrivateEventBannerProps) {
  const message = useString('amity_social_label_private_event_target_banner');

  return (
    <div className={`${styles.privateEventBanner} ${className ?? ''}`.trim()} role="note">
      <p className={styles.privateEventBanner__text}>{message}</p>
    </div>
  );
}
