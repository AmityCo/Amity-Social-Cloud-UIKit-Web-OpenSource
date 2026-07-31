import { Button } from '~/v4/core/design/atoms/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { Plus } from '~/v4/core/design/icons/Plus';
import styles from './AddTile.module.css';

type AddTileProps = {
  onPress: () => void;
  label?: string;
  ariaLabel?: string;
};

export function AddTile({ onPress, label, ariaLabel }: AddTileProps) {
  return (
    <div className={styles.addTile}>
      <Button.Icon
        icon={<Plus />}
        styleType="filled"
        hierarchy="secondary"
        size={40}
        onPress={onPress}
        aria-label={ariaLabel}
      />
      <Typography.Caption className={styles.addTile__name}>{label}</Typography.Caption>
    </div>
  );
}
