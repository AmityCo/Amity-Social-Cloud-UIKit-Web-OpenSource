import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import EyeSlash from '~/v4/icons/EyeSlash';
import { CountdownSpinner } from './CountdownSpinner';
import styles from './LivestreamOverlay.module.css';

export const LoadingSpinner = () => {
  return <div className={styles.livestreamOverlay__loadingSpinner} />;
};

export interface LivestreamOverlayProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
  withIcon?: boolean;
}

const LivestreamOverlayBase: React.FC<LivestreamOverlayProps> = ({
  title,
  description,
  icon = <LoadingSpinner />,
  className,
  children,
  withIcon = true,
}) => {
  return (
    <div className={clsx(styles.livestreamOverlay, className)}>
      <div className={styles.livestreamOverlay__content}>
        {withIcon && <div className={styles.livestreamOverlay__icon}>{icon}</div>}
        {title && (
          <Typography.TitleBold className={styles.livestreamOverlay__title}>
            {title}
          </Typography.TitleBold>
        )}
        {description && (
          <Typography.Caption className={styles.livestreamOverlay__description}>
            {description}
          </Typography.Caption>
        )}
        {children}
      </div>
    </div>
  );
};

// Preset components
const Starting: React.FC<{ className?: string }> = ({ className }) => (
  <LivestreamOverlayBase
    title="Starting livestream"
    description="Please wait while we prepare your stream..."
    className={className}
  />
);

const Reconnecting: React.FC<{ className?: string }> = ({ className }) => (
  <LivestreamOverlayBase
    title="Reconnecting"
    description="Due to poor connection, this live stream has been paused. It will resume automatically once the connection is stable."
    className={className}
  />
);

const WaitForApproval: React.FC<{ className?: string; view?: 'moderator' | 'streamer' }> = ({
  className,
  view,
}) =>
  view === 'streamer' ? (
    <LivestreamOverlayBase
      title="Waiting for approval"
      description="This live stream has started. However, it will have limited visibility until your post has been approved."
      icon={<EyeSlash className={styles.livestreamOverlay__waitingApprovalIcon} />}
      className={className}
    />
  ) : (
    <>
      <div className={styles.livestreamOverlay__top} />
      <div className={styles.livestreamOverlay__bottom}>
        <Typography.Body className={styles.livestreamOverlay__watingApproval__bottomText}>
          This live stream has started, but with limited visibility until the post has been
          approved.
        </Typography.Body>
      </div>
    </>
  );

const Ending: React.FC<{ className?: string }> = ({ className }) => (
  <LivestreamOverlayBase title="Ending live stream" className={className} />
);

const CountdownEnding: React.FC<{ countdown: number; className?: string }> = ({
  countdown,
  className,
}) => (
  <LivestreamOverlayBase title="Live stream ends in" withIcon={false} className={className}>
    <CountdownSpinner countdown={countdown} />
  </LivestreamOverlayBase>
);

// Main component with compound pattern
export const LivestreamOverlay = Object.assign(LivestreamOverlayBase, {
  Starting,
  Ending,
  Reconnecting,
  WaitForApproval,
  CountdownEnding,
});
