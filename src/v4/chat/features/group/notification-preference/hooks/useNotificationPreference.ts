import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { AmityChannelNotificationModeEnum } from '@amityco/ts-sdk';
import { useChannelObject } from '~/v4/chat/hooks/objects';
import { useChannelPushNotificationQuery } from '~/v4/chat/hooks/queries';
import { useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import type { GroupNotificationPreferencePageProps } from '~/v4/chat/pages/GroupNotificationPreferencePage';

const schema = z.object({
  isEnabled: z.boolean(),
});

type NotificationPreferenceForm = z.infer<typeof schema>;

export function useNotificationPreference({ channelId }: GroupNotificationPreferencePageProps) {
  const { pop } = useChatNavigation();
  const { channel, isLoading: isChannelLoading } = useChannelObject({ channelId });
  const {
    isEnabled: persistedIsEnabled,
    isLoading: isSettingsLoading,
    updateChannelPushNotification,
  } = useChannelPushNotificationQuery({ channelId });

  const isSilent = channel?.notificationMode === AmityChannelNotificationModeEnum.Silent;
  const isLoading = isChannelLoading || isSettingsLoading;

  const { control, handleSubmit } = useForm<NotificationPreferenceForm>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    values: {
      isEnabled: persistedIsEnabled,
    },
  });

  function handleClose() {
    pop();
  }

  const handleSave = handleSubmit(async (values: NotificationPreferenceForm) => {
    await updateChannelPushNotification({ channelId, isEnabled: values.isEnabled });
  });

  return {
    control,
    isLoading,
    isSilent,
    persistedIsEnabled,
    handleClose,
    handleSave,
  };
}
