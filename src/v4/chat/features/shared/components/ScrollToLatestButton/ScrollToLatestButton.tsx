import { Button } from '~/v4/core/components/AriaButton/Button';
import { ChevronDown } from '~/v4/icons/ChevronDown';
import styles from './ScrollToLatestButton.module.css';

type ScrollToLatestButtonProps = {
  onPress: () => void;
};

export function ScrollToLatestButton({ onPress }: ScrollToLatestButtonProps) {
  return (
    <Button
      type="button"
      variant="text"
      className={styles.scrollToLatestButton}
      onPress={onPress}
      aria-label="Scroll to latest message"
    >
      <ChevronDown className={styles.scrollToLatestButton__icon} />
    </Button>
  );
}
