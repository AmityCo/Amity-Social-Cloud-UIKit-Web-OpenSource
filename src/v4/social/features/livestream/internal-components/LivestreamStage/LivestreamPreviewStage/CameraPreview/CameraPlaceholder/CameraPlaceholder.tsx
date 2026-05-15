import clsx from 'clsx';
import { useString } from '~/v4/core/localization';
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
const NoPermission: React.FC<{ className?: string }> = ({ className }) => {
  const title = useString('amity_social_permission_title_allow_camera_mic_access');
  const description = useString('amity_social_status_allow_camera_desc');
  return (
    <CameraPlaceholderBase
      title={title}
      description={description}
      className={className}
      withIcon={false}
    />
  );
};

const NoCameraFound: React.FC<{ className?: string }> = ({ className }) => {
  const title = useString('amity_social_no_camera_found');
  const description = useString('amity_social_camera_placeholder_no_camera_description');
  return (
    <CameraPlaceholderBase
      title={title}
      description={description}
      icon={<NoCamera className={styles.cameraPlaceholder__noCameraIcon} />}
      className={className}
    />
  );
};

const Loading: React.FC<{ className?: string }> = ({ className }) => {
  const title = useString('amity_social_loading');
  const description = useString('amity_social_camera_placeholder_loading_description');
  return (
    <CameraPlaceholderBase
      title={title}
      description={description}
      className={className}
      withIcon={false}
    />
  );
};

// Main component with compound pattern
export const CameraPlaceholder = Object.assign(CameraPlaceholderBase, {
  NoPermission,
  NoCameraFound,
  Loading,
});
