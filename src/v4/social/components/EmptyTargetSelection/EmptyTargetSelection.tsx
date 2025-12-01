import { Typography } from '~/v4/core/components';
import { Illustration } from '~/v4/social/elements/Illustration';
import styles from './EmptyTargetSelection.module.css';

export function EmptyTargetSelection() {
  return (
    <div className={styles.emptyTargetSelection}>
      <Illustration />
      <Typography.TitleBold className={styles.emptyTargetSelection__label}>
        You haven't joined any communities yet.
      </Typography.TitleBold>
    </div>
  );
}
