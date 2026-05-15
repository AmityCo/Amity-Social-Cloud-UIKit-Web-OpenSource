import { Typography } from '~/v4/core/components';
import { useString } from '~/v4/core/localization';
import { Illustration } from '~/v4/social/elements/Illustration';
import styles from './EmptyTargetSelection.module.css';

export function EmptyTargetSelection() {
  return (
    <div className={styles.emptyTargetSelection}>
      <Illustration />
      <Typography.TitleBold className={styles.emptyTargetSelection__label}>
        {useString('amity_social_you_havent_joined_any_communities')}
      </Typography.TitleBold>
    </div>
  );
}
