import EmptyClip from '~/v4/icons/EmptyClip';
import { useString } from '~/v4/core/localization';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './EmptyClipFeed.module.css';

export const EmptyClipFeed = () => {
  return (
    <div data-testid="empty-clip-feed" className={styles.emptyClipFeed}>
      <IconComponent
        defaultIcon={() => <EmptyClip className={styles.emptyClipFeed__icon} />}
        imgIcon={() => <EmptyClip className={styles.emptyClipFeed__icon} />}
      />
      <Typography.TitleBold className={styles.emptyClipFeed__text}>
        {useString('amity_social_empty_state_empty_clip_feed')}
      </Typography.TitleBold>
    </div>
  );
};
