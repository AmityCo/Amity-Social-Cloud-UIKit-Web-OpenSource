import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useChannelObject } from '~/v4/chat/hooks/objects';
import {
  useUpdateChannelMutePermissionQuery,
  AmityChannelMessagingPermissionEnum,
} from '~/v4/chat/hooks/queries';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';
import { useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import type { EditGroupMemberPermissionsPageProps } from '~/v4/chat/pages/EditGroupMemberPermissionsPage';

const schema = z.object({
  permission: z.nativeEnum(AmityChannelMessagingPermissionEnum),
});

type EditGroupMemberPermissionsForm = z.infer<typeof schema>;

export function useEditGroupMemberPermissions({ channelId }: EditGroupMemberPermissionsPageProps) {
  const { pop } = useChatNavigation();
  const { channel, isLoading } = useChannelObject({ channelId });
  const { success } = useNotifications();
  const successToast = useString('amity_chat_edit_group_perm_toast_success');
  const { updateChannelMutePermission } = useUpdateChannelMutePermissionQuery();

  const initialPermission = channel?.isMuted
    ? AmityChannelMessagingPermissionEnum.ModeratorsOnly
    : AmityChannelMessagingPermissionEnum.Everyone;

  const {
    control,
    handleSubmit,
    formState: { isDirty, isSubmitting, isValid },
  } = useForm<EditGroupMemberPermissionsForm>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    values: {
      permission: initialPermission,
    },
  });

  function handleClose() {
    pop();
  }

  const handleSave = handleSubmit(async (values: EditGroupMemberPermissionsForm) => {
    await updateChannelMutePermission({
      channelId,
      permission: values.permission,
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
