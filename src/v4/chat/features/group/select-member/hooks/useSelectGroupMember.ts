import * as z from 'zod';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useDebounce } from 'react-use';
import { SEARCH_DEBOUNCE_MS } from '~/v4/chat/constants';
import { useString } from '~/v4/core/localization';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import type { SelectGroupMemberPageProps } from '~/v4/chat/pages/SelectGroupMemberPage';
import { MEMBER_MAX_COUNT } from '~/v4/chat/features/group/select-member/constants';

const schema = z.object({
  searchText: z.string(),
  selectedUsers: z.array(z.custom<Amity.User>()).min(1).max(MEMBER_MAX_COUNT),
});

type SelectGroupMemberForm = z.infer<typeof schema>;

export function useSelectGroupMember({
  selectedGroupMember = [],
}: SelectGroupMemberPageProps = {}) {
  const { pop, replace } = useChatNavigation();
  const { info } = useConfirmContext();
  const memberLimitTitle = useString('amity_chat_member_limit_reached_title');
  const memberLimitMessage = useString('amity_chat_member_limit_reached_message');
  const [debouncedText, setDebouncedText] = useState('');

  const form = useForm<SelectGroupMemberForm>({
    mode: 'onChange',
    resolver: zodResolver(schema),
    defaultValues: {
      searchText: '',
      selectedUsers: selectedGroupMember,
    },
  });

  const searchText = form.watch('searchText');
  const selectedUsers = form.watch('selectedUsers');

  useDebounce(() => setDebouncedText(searchText), SEARCH_DEBOUNCE_MS, [searchText]);

  function setSearchText(value: string) {
    form.setValue('searchText', value, { shouldValidate: true });
  }

  function removeUser(userId: string) {
    const current = form.getValues('selectedUsers');
    form.setValue(
      'selectedUsers',
      current.filter((u) => u.userId !== userId),
      { shouldValidate: true, shouldDirty: true },
    );
  }

  function setSelectedUsers(users: Amity.User[]) {
    if (users.length > MEMBER_MAX_COUNT) {
      info({
        title: memberLimitTitle,
        content: memberLimitMessage,
      });
      return;
    }
    form.setValue('selectedUsers', users, { shouldValidate: true, shouldDirty: true });
  }

  function handleClose() {
    pop();
  }

  const handleNext = form.handleSubmit((values) => {
    replace({
      type: ChatPageTypes.CreateGroupChatPage,
      context: { selectedUsers: values.selectedUsers },
    });
  });

  return {
    form,
    searchText,
    setSearchText,
    debouncedText,
    selectedUsers,
    setSelectedUsers,
    removeUser,
    isFormValid: form.formState.isValid || form.formState.isSubmitting,
    handleClose,
    handleNext,
  };
}
