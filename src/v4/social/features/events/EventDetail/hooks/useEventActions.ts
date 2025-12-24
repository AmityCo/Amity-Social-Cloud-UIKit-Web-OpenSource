import { useEventMutation } from '~/v4/social/features/events/hooks';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

export function useEventActions() {
  const { onBack } = useNavigation();
  const { confirm } = useConfirmContext();
  const { success, info } = useNotifications();
  const { deleteEventMutation } = useEventMutation();

  const deleteEvent = (eventId: string) => {
    confirm({
      okText: 'Delete',
      title: 'Delete this event?',
      onOk: () =>
        deleteEventMutation.mutate(eventId, {
          onSuccess: () => {
            onBack();
            success({ content: 'Event deleted.' });
          },
          onError: () => {
            info({ content: 'Failed to delete event. Please try again.' });
          },
        }),
      content:
        'This event will be permanently deleted. You and others will no longer see and find this event.',
    });
  };

  return { deleteEvent };
}
