import clsx from 'clsx';
import React from 'react';
import { Typography } from '~/v4/core/components';
import { ParticipantHeader } from '~/v4/social/features/livestream/internal-components/LivestreamStage/StreamerStage/ParticipantHeader';
import { useLivestreamData } from '~/v4/social/features/livestream/providers';
import styles from './CoHostPlaceholder.module.css';

export interface CoHostPlaceholderProps {
  pageId?: string;
  className?: string;
  isMuted?: boolean;
}

export const CoHostPlaceholder: React.FC<CoHostPlaceholderProps> = ({
  pageId = '*',
  className,
  isMuted,
}) => {
  const { invitationByMe, coHost } = useLivestreamData();

  const imgUrl = invitationByMe?.user?.avatar?.fileUrl ?? coHost?.user?.avatar?.fileUrl;

  return (
    <div className={clsx(styles.coHostPlaceholder__container, className)}>
      <ParticipantHeader pageId={pageId} isMuted={isMuted} />
      <img src={imgUrl} className={styles.coHostPlaceholder__avatar} />
      <Typography.Title className={styles.coHostPlaceholder__text}>
        Waiting for co-host to get ready…
      </Typography.Title>
    </div>
  );
};
