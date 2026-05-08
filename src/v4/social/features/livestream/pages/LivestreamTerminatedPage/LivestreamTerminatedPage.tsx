import React from 'react';
import { useString } from '~/v4/core/localization';
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
          <Typography.TitleBold>
            {useString('amity_social_status_create_livestream_terminated_toolbar_title')}
          </Typography.TitleBold>
        </div>
        <div className={styles.liveStreamTerminatedPage__terminatedContent}>
          <Terminated className={styles.liveStreamTerminatedPage__terminatedIcon} />
          <Typography.Headline>
            {useString('amity_social_modal_dialog_livestream_time_limit')}
          </Typography.Headline>
          <Typography.Body>{useString('amity_social_livestream_terminated_body')}</Typography.Body>
        </div>
        <div className={styles.liveStreamTerminatedPage__playbackContent}>
          <Typography.BodyBold>
            {useString('amity_social_label_create_livestream_terminated_question')}
          </Typography.BodyBold>
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
