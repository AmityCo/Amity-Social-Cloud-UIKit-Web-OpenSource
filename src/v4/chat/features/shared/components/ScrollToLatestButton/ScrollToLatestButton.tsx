import { Button } from '~/v4/core/design/atoms/Button';
import { ChevronDown } from '~/v4/core/design/icons/ChevronDown';
import styles from './ScrollToLatestButton.module.css';

type ScrollToLatestButtonProps = {
  onPress: () => void;
};

export function ScrollToLatestButton({ onPress }: ScrollToLatestButtonProps) {
  return (
    <Button.Icon
      icon={<ChevronDown />}
      styleType="filled"
      hierarchy="secondary"
      size={40}
      onPress={onPress}
      aria-label="Scroll to latest message"
      className={styles.scrollToLatestButton}
    />
  );
}
