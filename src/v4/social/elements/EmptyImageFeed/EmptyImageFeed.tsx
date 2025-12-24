import EmptyImage from '~/v4/icons/EmptyImage';
import { Typography } from '~/v4/core/components';
import { IconComponent } from '~/v4/core/IconComponent';
import styles from './EmptyImageFeed.module.css';

export const EmptyImageFeed = () => {
  return (
    <div data-testid="empty-community-image-feed" className={styles.emptyImageFeed}>
      <IconComponent
        defaultIcon={() => <EmptyImage className={styles.emptyImageFeed__icon} />}
        imgIcon={() => <EmptyImage className={styles.emptyImageFeed__icon} />}
      />
      <div>
        <Typography.TitleBold className={styles.emptyImageFeed__text}>
          No photos yet
        </Typography.TitleBold>
      </div>
    </div>
  );
};
