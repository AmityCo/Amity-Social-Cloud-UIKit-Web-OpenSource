import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import NoCamera from '~/v4/icons/NoCamera';
import styles from './CameraPlaceholder.module.css';

export interface CameraPlaceholderProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  withIcon?: boolean;
}

const CameraPlaceholderBase: React.FC<CameraPlaceholderProps> = ({
  title,
  description,
  icon,
  className,
  children,
  withIcon = true,
}) => {
  return (
    <div className={clsx(styles.cameraPlaceholder__container, className)}>
      <div className={styles.cameraPlaceholder__inner}>
        {withIcon && icon && <div className={styles.cameraPlaceholder__icon}>{icon}</div>}
        {title && (
          <Typography.TitleBold className={styles.cameraPlaceholder__title}>
            {title}
          </Typography.TitleBold>
        )}
        {description && (
          <Typography.Caption className={styles.cameraPlaceholder__description}>
            {description}
          </Typography.Caption>
        )}
        {children}
      </div>
    </div>
  );
};

// Preset components
const NoPermission: React.FC<{ className?: string }> = ({ className }) => (
  <CameraPlaceholderBase
    title="Allow access to your camera and microphone"
    description="This lets you record and live stream from this device."
    className={className}
    withIcon={false}
  />
);

const NoCameraFound: React.FC<{ className?: string }> = ({ className }) => (
  <CameraPlaceholderBase
    title="No camera found"
    description="We couldn't found your camera. Make sure it's properly connected, installed, and not blocked, and check that no other app is currently using it."
    icon={<NoCamera className={styles.cameraPlaceholder__noCameraIcon} />}
    className={className}
  />
);

const Loading: React.FC<{ className?: string }> = ({ className }) => (
  <CameraPlaceholderBase
    title="Loading..."
    description="Preparing your camera and microphone"
    className={className}
    withIcon={false}
  />
);

// Main component with compound pattern
export const CameraPlaceholder = Object.assign(CameraPlaceholderBase, {
  NoPermission,
  NoCameraFound,
  Loading,
});
