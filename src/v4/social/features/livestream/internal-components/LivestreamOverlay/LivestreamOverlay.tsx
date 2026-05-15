import clsx from 'clsx';
import { useString } from '~/v4/core/localization';
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
const Starting: React.FC<{ className?: string }> = ({ className }) => {
  const title = useString('amity_social_status_create_livestream_connecting_text');
  const description = useString('amity_social_overlay_starting_description');
  return <LivestreamOverlayBase title={title} description={description} className={className} />;
};

const Reconnecting: React.FC<{ className?: string }> = ({ className }) => {
  const title = useString('amity_social_button_reconnecting');
  return (
    <LivestreamOverlayBase
      title={title}
      description={useString('amity_social_livestream_reconnecting_message')}
      className={className}
    />
  );
};

const WaitForApproval: React.FC<{ className?: string; view?: 'moderator' | 'streamer' }> = ({
  className,
  view,
}) => {
  return view === 'streamer' ? (
    <LivestreamOverlayBase
      title={useString('amity_social_label_waiting_for_approval')}
      description={useString(
        'amity_social_status_this_live_stream_has_started_however_it_will_have_limit',
      )}
      icon={<EyeSlash className={styles.livestreamOverlay__waitingApprovalIcon} />}
      className={className}
    />
  ) : (
    <>
      <div className={styles.livestreamOverlay__top} />
      <div className={styles.livestreamOverlay__bottom}>
        <Typography.Body className={styles.livestreamOverlay__watingApproval__bottomText}>
          {useString('amity_social_status_this_live_stream_has_started_but_with_limited_visibilit')}
        </Typography.Body>
      </div>
    </>
  );
};

const Ending: React.FC<{ className?: string }> = ({ className }) => {
  return (
    <LivestreamOverlayBase
      title={useString('amity_social_ending_live_stream')}
      className={className}
    />
  );
};

const CountdownEnding: React.FC<{ countdown: number; className?: string }> = ({
  countdown,
  className,
}) => {
  return (
    <LivestreamOverlayBase
      title={useString('amity_social_status_create_livestream_count_down_title')}
      withIcon={false}
      className={className}
    >
      <CountdownSpinner countdown={countdown} />
    </LivestreamOverlayBase>
  );
};

const LeavingStage: React.FC<{ className?: string }> = ({ className }) => {
  const title = useString('amity_social_leaving_stage');
  const description = useString('amity_social_overlay_leaving_stage_description');
  return <LivestreamOverlayBase title={title} description={description} className={className} />;
};

// Main component with compound pattern
export const LivestreamOverlay = Object.assign(LivestreamOverlayBase, {
  Starting,
  Ending,
  Reconnecting,
  WaitForApproval,
  CountdownEnding,
  LeavingStage,
});
