import EmptyVideo from '~/v4/icons/EmptyVideo';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './EmptyVideoFeed.module.css';

export const EmptyVideoFeed = () => {
  return (
    <div data-testid="empty-community-video-feed" className={styles.emptyVideoFeed}>
      <IconComponent
        defaultIcon={() => <EmptyVideo className={styles.emptyVideoFeed__icon} />}
        imgIcon={() => <EmptyVideo className={styles.emptyVideoFeed__icon} />}
      />
      <Typography.TitleBold className={styles.emptyVideoFeed__text}>
        No videos yet
      </Typography.TitleBold>
    </div>
  );
};
