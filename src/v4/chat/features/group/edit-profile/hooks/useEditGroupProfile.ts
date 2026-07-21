import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useChannelObject } from '~/v4/chat/hooks/objects';
import { useUpdateChannelQuery } from '~/v4/chat/hooks/queries';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { GROUP_NAME_MAX_LENGTH } from '~/v4/chat/constants';
import { useString } from '~/v4/core/localization';
import { useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import type { EditGroupProfilePageProps } from '~/v4/chat/pages/EditGroupProfilePage';

const schema = z.object({
  avatar: z.custom<Amity.File<'image'>>().nullable(),
  name: z.string().trim().min(1).max(GROUP_NAME_MAX_LENGTH),
});

type EditGroupProfileForm = z.infer<typeof schema>;

export function useEditGroupProfile({ channelId }: EditGroupProfilePageProps) {
  const { pop } = useChatNavigation();
  const { channel, isLoading } = useChannelObject({ channelId });
  const { success } = useNotifications('chat');
  const { updateChannel } = useUpdateChannelQuery();
  const updateSuccessToast = useString('amity_chat_group_edit_profile');

  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting, isValid },
  } = useForm<EditGroupProfileForm>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    values: {
      avatar: channel?.avatar ?? null,
      name: channel?.displayName ?? '',
    },
  });

  function handleClose() {
    pop();
  }

  const handleSave = handleSubmit(async (values: EditGroupProfileForm) => {
    await updateChannel({
      channelId,
      payload: {
        displayName: values.name,
        avatarFileId: values.avatar?.fileId,
      },
    });
    success({ content: updateSuccessToast });
    handleClose();
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
