import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { TopBar } from '~/v4/chat/elements/TopBar';
import { useString } from '~/v4/core/localization';
import styles from './Header.module.css';

type HeaderProps = {
  isFormValid: boolean;
  onClose: () => void;
};

export function Header({ isFormValid, onClose }: HeaderProps) {
  const title = useString('amity_chat_create_group_title');
  const createLabel = useString('amity_chat_create_group_button');
  return (
    <TopBar
      title={title}
      leadingType="close"
      onLeading={onClose}
      trailing={
        <Button
          type="submit"
          variant="text"
          color="primary"
          isDisabled={!isFormValid}
          className={styles.header__createButton}
          aria-label={createLabel}
        >
          <Typography.Body className={styles.header__createLabel}>{createLabel}</Typography.Body>
        </Button>
      }
    />
  );
}
