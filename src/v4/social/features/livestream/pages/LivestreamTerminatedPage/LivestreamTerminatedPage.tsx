import React from 'react';
import { TrashIcon } from '~/v4/icons/Trash';
import { Typography } from '~/v4/core/components';
import { Terminated } from '~/v4/icons/Terminated';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { LiveStreamTerminatedActionButton } from '~/v4/social/components/LiveStreamTerminatedActionButton/LiveStreamTerminatedActionButton';
import styles from './LivestreamTerminatedPage.module.css';
import { PAGE_ID } from '~/v4/constants/customization';

export function LivestreamTerminatedPage() {
  const pageId = PAGE_ID.LIVESTREAM_TERMINATED_PAGE;
  const { themeStyles } = useAmityPage({ pageId });

  return (
    <section style={themeStyles} className={styles.liveStreamTerminatedPage}>
      <div>
        <div className={styles.liveStreamTerminatedPage__header}>
          <Typography.TitleBold>Live terminated</Typography.TitleBold>
        </div>
        <div className={styles.liveStreamTerminatedPage__terminatedContent}>
          <Terminated className={styles.liveStreamTerminatedPage__terminatedIcon} />
          <Typography.Headline>The live stream has been terminated.</Typography.Headline>
          <Typography.Body>
            It looks like the live stream you're watching goes against our content moderation
            guidelines.
          </Typography.Body>
        </div>
        <div className={styles.liveStreamTerminatedPage__playbackContent}>
          <Typography.BodyBold>What does it mean?</Typography.BodyBold>
          <div className={styles.liveStreamTerminatedPage__playback}>
            <TrashIcon className={styles.liveStreamTerminatedPage__deletedIcon} />
            <Typography.Body>
              There will be no playback of this live stream on any feeds.
            </Typography.Body>
          </div>
        </div>
      </div>
      <div className={styles.liveStreamTerminatedPage__footer}>
        <LiveStreamTerminatedActionButton pageId={pageId} />
      </div>
    </section>
  );
}
