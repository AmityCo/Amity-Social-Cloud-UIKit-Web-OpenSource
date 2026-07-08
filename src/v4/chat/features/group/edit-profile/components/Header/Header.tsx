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
  const title = useString('amity_chat_edit_group_profile_navbar_title');
  const saveLabel = useString('amity_chat_group_edit_profile_save');
  return (
    <TopBar
      title={title}
      leadingType="back"
      onLeading={onClose}
      trailing={
        <Button
          type="submit"
          variant="text"
          color="primary"
          isDisabled={!isFormValid}
          className={styles.header__saveButton}
          data-disabled={!isFormValid ? 'true' : 'false'}
          aria-label={saveLabel}
        >
          <Typography.Body className={styles.header__saveLabel}>{saveLabel}</Typography.Body>
        </Button>
      }
    />
  );
}
