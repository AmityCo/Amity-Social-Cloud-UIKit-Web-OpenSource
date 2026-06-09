import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { useString } from '~/v4/core/localization';
import styles from './AddMemberButton.module.css';

type AddMemberButtonProps = {
  isDisabled: boolean;
};

export function AddMemberButton({ isDisabled }: AddMemberButtonProps) {
  const buttonLabel = useString('amity_chat_add_member_button');
  return (
    <div className={styles.addMemberButton__container}>
      <Button
        type="submit"
        variant="fill"
        color="primary"
        size="medium"
        fullWidth
        isDisabled={isDisabled}
        className={styles.addMemberButton}
        aria-label={buttonLabel}
      >
        <Typography.BodyBold>{buttonLabel}</Typography.BodyBold>
      </Button>
    </div>
  );
}
