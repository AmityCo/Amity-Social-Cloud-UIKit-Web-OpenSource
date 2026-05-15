import React from 'react';
import { useString } from '~/v4/core/localization';
import { Button } from '~/v4/core/components/AriaButton';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import FailedClip from '~/v4/icons/FailedClip';
import styles from './DeletedClipView.module.css';

type DeletedClipViewProps = {
  onWatchNext: () => void;
};

export const DeletedClipView = ({ onWatchNext }: DeletedClipViewProps) => {
  return (
    <div className={styles.deletedClipView__container}>
      <div className={styles.deletedClipView__errorStateWrapper}>
        <IconComponent
          defaultIcon={() => <FailedClip className={styles.deletedClipView__failedClipIcon} />}
          imgIcon={() => <FailedClip className={styles.deletedClipView__failedClipIcon} />}
        />
        <Typography.Body className={styles.deletedClipView__errorStateText}>
          {useString('amity_social_label_this_clip_is_no_longer_available')}
        </Typography.Body>
        <Button
          variant="text"
          className={styles.deletedClipView__errorStateButton}
          onPress={onWatchNext}
        >
          <Typography.BodyBold className={styles.deletedClipView__errorStateText}>
            {useString('amity_social_label_watch_next_clip')}
          </Typography.BodyBold>
        </Button>
      </div>
    </div>
  );
};
