import { Button } from '~/v4/core/design/atoms/Button';
import { useString } from '~/v4/core/localization';
import styles from './AddMemberButton.module.css';

type AddMemberButtonProps = {
  isDisabled: boolean;
};

export function AddMemberButton({ isDisabled }: AddMemberButtonProps) {
  const buttonLabel = useString('amity_chat_add_member_button');
  return (
    <div className={styles.addMemberButton__container}>
      <Button.Main
        type="submit"
        styleType="filled"
        hierarchy="primary"
        size="lg"
        label={buttonLabel}
        isDisabled={isDisabled}
        className={styles.addMemberButton}
        aria-label={buttonLabel}
      />
    </div>
  );
}
