import { useEventMutation } from '~/v4/social/features/events/hooks';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { resolveString } from '~/v4/core/localization';

export function useEventActions() {
  const { onBack } = useNavigation();
  const { confirm } = useConfirmContext();
  const { success, info } = useNotifications();
  const { deleteEventMutation } = useEventMutation();

  const deleteEvent = (eventId: string) => {
    confirm({
      okText: resolveString('amity_social_button_delete'),
      cancelText: resolveString('amity_social_button_cancel'),
      title: resolveString('amity_social_delete_this_event'),
      onOk: () =>
        deleteEventMutation.mutate(eventId, {
          onSuccess: () => {
            onBack();
            success({ content: resolveString('amity_social_toast_snackbar_event_deleted') });
          },
          onError: () => {
            info({ content: resolveString('amity_social_toast_snackbar_delete_event_failed') });
          },
        }),
      content: resolveString('amity_social_modal_dialog_delete_event_description'),
    });
  };

  return { deleteEvent };
}
