import clsx from 'clsx';
import React, { forwardRef } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { Typography } from '~/v4/core/components/Typography/Typography';
import styles from './Banner.module.css';
import type { BannerProps } from './types';

export const Banner = forwardRef<HTMLDivElement, BannerProps>(function Banner(
  {
    hierarchy = 'default',
    leadingController,
    leading,
    overline,
    header,
    headerLeadingBadge,
    headerTrailingBadge,
    subhead,
    description,
    descriptionIcon,
    trailing,
    centered = false,
    loading = false,
    onPress,
    onPressLabel,
    className,
  },
  ref,
) {
  if (loading) {
    return (
      <div
        ref={ref}
        data-hierarchy={hierarchy}
        data-state="skeleton"
        className={clsx(styles.banner, className)}
      >
        <div className={styles.banner__body}>
          <span className={styles.banner__skeletonCircle} />
          <span className={styles.banner__skeletonBar} />
        </div>
      </div>
    );
  }

  const hasTitle =
    header != null || headerLeadingBadge != null || headerTrailingBadge != null || subhead != null;
  const trailingItems = (trailing ?? []).filter(Boolean).slice(0, 3);

  const body = (
    <>
      {leading != null && <div className={styles.banner__leading}>{leading}</div>}
      <div className={styles.banner__content}>
        {overline != null && (
          <Typography as="p" className={styles.banner__overline}>
            {overline}
          </Typography>
        )}
        {hasTitle && (
          <div className={styles.banner__title}>
            {headerLeadingBadge}
            {header != null && (
              <Typography as="p" className={styles.banner__header}>
                {header}
              </Typography>
            )}
            {headerTrailingBadge}
            {subhead != null && (
              <Typography as="p" className={styles.banner__subhead}>
                {subhead}
              </Typography>
            )}
          </div>
        )}
        {description != null && (
          <div className={styles.banner__description}>
            {descriptionIcon != null && (
              <span className={styles.banner__descriptionIcon}>{descriptionIcon}</span>
            )}
            <Typography as="p" className={styles.banner__descriptionText}>
              {description}
            </Typography>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      ref={ref}
      data-hierarchy={hierarchy}
      data-state="default"
      data-centered={centered ? 'true' : undefined}
      className={clsx(styles.banner, className)}
    >
      {leadingController != null && (
        <div className={styles.banner__leadingController}>{leadingController}</div>
      )}
      {onPress ? (
        <AriaButton className={styles.banner__body} onPress={onPress} aria-label={onPressLabel}>
          {body}
        </AriaButton>
      ) : (
        <div className={styles.banner__body}>{body}</div>
      )}
      {trailingItems.length > 0 && (
        <div className={styles.banner__trailing}>
          {trailingItems.map((item, index) => (
            <div key={index} className={styles.banner__trailingItem}>
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});
