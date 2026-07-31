import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AmityChannelNotificationModeEnum } from '@amityco/ts-sdk';
import { useChannelObject } from '~/v4/chat/hooks/objects';
import { useUpdateChannelQuery } from '~/v4/chat/hooks/queries';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';
import { useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import type { EditGroupNotificationPageProps } from '~/v4/chat/pages/EditGroupNotificationPage';

const schema = z.object({
  notificationMode: z.nativeEnum(AmityChannelNotificationModeEnum),
});

type EditGroupNotificationForm = z.infer<typeof schema>;

export function useEditGroupNotification({ channelId }: EditGroupNotificationPageProps) {
  const { pop } = useChatNavigation();
  const { channel, isLoading } = useChannelObject({ channelId });
  const { success } = useNotifications('chat');
  const errorToast = useString('amity_chat_group_notification_save_error');
  const successToast = useString('amity_chat_group_notification_save_success');
  const { updateChannel } = useUpdateChannelQuery({
    errorToast,
  });

  const initialMode = channel?.notificationMode ?? AmityChannelNotificationModeEnum.Default;

  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting, isValid },
  } = useForm<EditGroupNotificationForm>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    values: {
      notificationMode: initialMode,
    },
  });

  function handleClose() {
    pop();
  }

  const handleSave = handleSubmit(async (values: EditGroupNotificationForm) => {
    await updateChannel({
      channelId,
      payload: {
        notificationMode: values.notificationMode,
      },
    });
    success({ content: successToast });
    pop();
  });

  return {
    control,
    channel,
    isLoading,
    handleClose,
    handleSave,
    isFormValid: !isSubmitting && isDirty && isValid,
  };
}
