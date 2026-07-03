import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import styles from './InviteButton.module.css';

type InviteButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
};

export function InviteButton({ pageId = '*', componentId = '*', ...props }: InviteButtonProps) {
  const elementId = 'invite_button';
  const { accessibilityId, resolveText } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  return (
    <Button
      size="medium"
      type="button"
      variant="fill"
      color="primary"
      data-testid={accessibilityId}
      className={styles.inviteButton}
      {...props}
    >
      {resolveText('amity_social_button_community_add_member_button')}
    </Button>
  );
}
