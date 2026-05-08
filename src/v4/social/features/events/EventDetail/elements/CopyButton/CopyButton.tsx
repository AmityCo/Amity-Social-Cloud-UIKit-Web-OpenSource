import Copy from '~/v4/icons/Copy';
import { useString } from '~/v4/core/localization';
import { Button } from '~/v4/core/components/AriaButton';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

type CopyButtonProps = {
  text: string;
  toast?: string;
};

export function CopyButton({ text, toast }: CopyButtonProps) {
  const { success, info } = useNotifications();
  const copyLabel = useString('amity_social_button_copy');
  const copiedLabel = useString('amity_social_button_link_copied');
  const failedLabel = useString('amity_social_failed_to_copy_link');

  return (
    <Button
      icon={Copy}
      color="secondary"
      variant="outlined"
      aria-label="Copy link to clipboard"
      onPress={async () => {
        try {
          await navigator?.clipboard?.writeText(text);
          success({ content: toast || copiedLabel });
        } catch (err) {
          info({ content: failedLabel });
        }
      }}
    >
      {copyLabel}
    </Button>
  );
}
