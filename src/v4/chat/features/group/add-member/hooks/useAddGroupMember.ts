import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from 'react-use';
import { SEARCH_DEBOUNCE_MS } from '~/v4/chat/constants/search';
import { useString } from '~/v4/core/localization';
import { useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useChannelMembershipQuery } from '~/v4/chat/hooks/queries';
import type { AddGroupMemberPageProps } from '~/v4/chat/pages/AddGroupMemberPage';

const schema = z.object({
  searchText: z.string(),
  selectedUsers: z.array(z.custom<Amity.User>()).min(1),
});

type AddGroupMemberForm = z.infer<typeof schema>;

export function useAddGroupMember({ channelId }: AddGroupMemberPageProps) {
  const { pop } = useChatNavigation();
  const { success } = useNotifications();
  const { addMembers } = useChannelMembershipQuery();
  const [debouncedText, setDebouncedText] = useState('');
  const memberAddedToast = useString('amity_chat_toast_member_added');
  const membersAddedToast = useString('amity_chat_toast_members_added');

  const form = useForm<AddGroupMemberForm>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      searchText: '',
      selectedUsers: [],
    },
  });

  const searchText = form.watch('searchText');
  const selectedUsers = form.watch('selectedUsers');

  useDebounce(() => setDebouncedText(searchText), SEARCH_DEBOUNCE_MS, [searchText]);

  function setSearchText(value: string) {
    form.setValue('searchText', value, { shouldValidate: true });
  }

  function setSelectedUsers(users: Amity.User[]) {
    form.setValue('selectedUsers', users, { shouldValidate: true, shouldDirty: true });
  }

  function removeUser(userId: string) {
    const current = form.getValues('selectedUsers');
    form.setValue(
      'selectedUsers',
      current.filter((u) => u.userId !== userId),
      { shouldValidate: true, shouldDirty: true },
    );
  }

  function handleClose() {
    pop();
  }

  const handleAddMember = form.handleSubmit(async (values) => {
    const userIds = values.selectedUsers.map((u) => u.userId);
    await addMembers({ channelId, userIds });
    pop();
    success({
      content: userIds.length > 1 ? membersAddedToast : memberAddedToast,
    });
  });

  return {
    form,
    searchText,
    debouncedText,
    selectedUsers,
    setSearchText,
    setSelectedUsers,
    removeUser,
    handleClose,
    handleAddMember,
    isFormValid: form.formState.isValid || form.formState.isSubmitting,
  };
}
