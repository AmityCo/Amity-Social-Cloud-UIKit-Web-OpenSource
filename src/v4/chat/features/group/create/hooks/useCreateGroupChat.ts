import * as z from 'zod';
import { ChannelRepository } from '@amityco/ts-sdk';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { useUser } from '~/v4/core/hooks/objects/useUser';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useString } from '~/v4/core/localization';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import type { CreateGroupChatPageProps } from '~/v4/chat/pages/CreateGroupChatPage';
import { GROUP_NAME_MAX_LENGTH } from '~/v4/chat/constants';
import { generateDisplayName } from '~/v4/chat/features/group/create/utils/generateDisplayName';

type CreateChannelParams = Parameters<typeof ChannelRepository.createChannel>[0];

type CreateChannelResponse = Awaited<ReturnType<typeof ChannelRepository.createChannel>>;

const schema = z.object({
  avatarFile: z.custom<Amity.File<'image'>>().nullable(),
  name: z.string().trim().max(GROUP_NAME_MAX_LENGTH),
  isPublic: z.boolean(),
  members: z.array(z.custom<Amity.User>()).min(1),
});

export type CreateGroupChatForm = z.infer<typeof schema>;

export function useCreateGroupChat({ selectedUsers }: CreateGroupChatPageProps) {
  const { pop, replace, push } = useChatNavigation();
  const { currentUserId } = useSDK();
  const { user: currentUser } = useUser({ userId: currentUserId });
  const { success, error } = useNotifications('chat');
  const { confirm } = useConfirmContext();
  const leaveConfirmText = useString('amity_chat_group_leave_confirm_label');
  const cancelText = useString('amity_chat_cancel');
  const createSuccessToast = useString('amity_chat_create_group_success');
  const createErrorToast = useString('amity_chat_create_group_error');
  const leaveWithoutFinishingTitle = useString('amity_chat_leave_without_finishing_title');
  const leaveWithoutFinishingContent = useString('amity_chat_leave_without_finishing_message');

  const form = useForm<CreateGroupChatForm>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      avatarFile: null,
      name: '',
      isPublic: true,
      members: selectedUsers,
    },
  });

  const { mutateAsync } = useMutation<CreateChannelResponse, Error, CreateChannelParams>({
    mutationFn: ChannelRepository.createChannel,
  });

  function handleClose() {
    confirm({
      title: leaveWithoutFinishingTitle,
      content: leaveWithoutFinishingContent,
      okText: leaveConfirmText,
      cancelText: cancelText,
      okButtonColor: 'alert',
      onOk: pop,
    });
  }

  function handleAddMember() {
    push({
      type: ChatPageTypes.SelectGroupMemberPage,
      context: { selectedGroupMember: form.getValues('members') },
    });
  }

  const handleCreate = form.handleSubmit(async (values) => {
    const trimmed = values.name.trim();
    const displayName =
      trimmed || generateDisplayName([...(currentUser ? [currentUser] : []), ...values.members]);

    await mutateAsync(
      {
        type: 'community',
        displayName,
        isPublic: values.isPublic,
        userIds: values.members.map((u) => u.userId),
        avatarFileId: values.avatarFile?.fileId,
      },
      {
        onSuccess: (result) => {
          const channelId = result?.data?.channelId;
          if (channelId) {
            success({ content: createSuccessToast });
            replace({
              type: ChatPageTypes.GroupChatPage,
              context: { channelId, isJustCreated: true },
            });
          }
        },
        onError: () => {
          error({
            content: createErrorToast,
          });
        },
      },
    );
  });

  return {
    form,
    currentUser,
    handleClose,
    handleAddMember,
    handleCreate,
    isFormValid: form.formState.isValid || form.formState.isSubmitting,
  };
}
