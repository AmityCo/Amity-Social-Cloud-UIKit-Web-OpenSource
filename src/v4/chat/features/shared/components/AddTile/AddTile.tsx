import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Plus } from '~/v4/icons/Plus';
import styles from './AddTile.module.css';

type AddTileProps = {
  onPress: () => void;
  label?: string;
  ariaLabel?: string;
};

export function AddTile({ onPress, label, ariaLabel }: AddTileProps) {
  return (
    <Button variant="default" className={styles.addTile} onPress={onPress} aria-label={ariaLabel}>
      <div className={styles.addTile__circle}>
        <Plus className={styles.addTile__icon} />
      </div>
      <Typography.Caption className={styles.addTile__name}>{label}</Typography.Caption>
    </Button>
  );
}
