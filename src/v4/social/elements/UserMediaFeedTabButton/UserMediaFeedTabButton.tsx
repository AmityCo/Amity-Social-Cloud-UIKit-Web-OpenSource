import Media from '~/v4/icons/Media';
import { ImageFeed } from '~/v4/icons/ImageFeed';
import { IconComponent } from '~/v4/core/IconComponent';
import { ButtonProps, Button } from '~/v4/core/components/AriaButton';
import styles from './UserMediaFeedTabButton.module.css';

type UserMediaFeedTabButtonProps = ButtonProps & {
  isActive?: boolean;
};

export function UserMediaFeedTabButton({ isActive, ...props }: UserMediaFeedTabButtonProps) {
  return (
    <Button
      variant="default"
      data-active={isActive}
      data-testid="user-media-feed-tab-button"
      className={styles.userMediaFeedTabButton}
      {...props}
    >
      <IconComponent
        defaultIcon={() => (
          <Media className={styles.userMediaFeedTabButton__icon} data-active={isActive} />
        )}
        imgIcon={() => (
          <Media className={styles.userMediaFeedTabButton__icon} data-active={isActive} />
        )}
      />
    </Button>
  );
}
