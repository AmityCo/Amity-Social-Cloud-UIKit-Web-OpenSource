import { Typography } from '~/v4/core/components/Typography/Typography';
import styles from './DateSeparator.module.css';

type DateSeparatorProps = {
  label: string;
};

export function DateSeparator({ label }: DateSeparatorProps) {
  return (
    <div className={styles.dateSeparator} role="separator" aria-label={label}>
      <div className={styles.dateSeparator__pill}>
        <Typography.Caption className={styles.dateSeparator__label}>{label}</Typography.Caption>
      </div>
    </div>
  );
}
