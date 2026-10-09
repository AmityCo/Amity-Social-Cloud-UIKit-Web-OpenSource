import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Button, ButtonProps } from '~/v4/core/components/AriaButton';
import styles from './InviteButton.module.css';
import { Typography } from '~/v4/core/components';

type InviteButtonProps = ButtonProps & {
  pageId?: string;
  componentId?: string;
};

export function InviteButton({ pageId = '*', componentId = '*', ...props }: InviteButtonProps) {
  const elementId = 'invite_button';
  const { accessibilityId, resolveText, isExcluded } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  // Owned by a module. A reusable element can be rendered on any page,
  // including one another module owns, so it answers for itself.
  if (isExcluded) return null;

  return (
    <Button
      fullWidth
      size="medium"
      type="button"
      variant="fill"
      color="primary"
      data-testid={accessibilityId}
      className={styles.inviteButton}
      {...props}
    >
      <Typography.CaptionBold>
        {resolveText('amity_social_button_community_add_member_button')}
      </Typography.CaptionBold>
    </Button>
  );
}
