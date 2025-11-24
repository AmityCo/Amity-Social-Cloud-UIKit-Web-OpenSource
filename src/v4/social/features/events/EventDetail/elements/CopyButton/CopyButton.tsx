import Copy from '~/v4/icons/Copy';
import { Button } from '~/v4/core/components/AriaButton';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

type CopyButtonProps = {
  text: string;
};

export function CopyButton({ text }: CopyButtonProps) {
  const { success, info } = useNotifications();

  return (
    <Button
      icon={Copy}
      color="secondary"
      variant="outlined"
      aria-label="Copy link to clipboard"
      onPress={async () => {
        try {
          await navigator?.clipboard?.writeText(text);
          success({ content: 'Link copied' });
        } catch (err) {
          info({ content: 'Failed to copy link' });
        }
      }}
    >
      Copy
    </Button>
  );
}
