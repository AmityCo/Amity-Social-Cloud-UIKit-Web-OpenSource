import { useState } from 'react';
import { useDebounce } from 'react-use';
import { useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useString } from '~/v4/core/localization';
import type { ActionMenuItem } from '~/v4/chat/components/ActionMenu';
import Banned from '~/v4/icons/Banned';
import { SEARCH_DEBOUNCE_MS } from '~/v4/chat/constants/search';
import { useChannelBanQuery } from '~/v4/chat/hooks/queries';
import type { BannedGroupMemberListPageProps } from '~/v4/chat/pages/BannedGroupMemberListPage';

export type OpenUnbanActionParams = {
  user: Amity.User;
};

export function useBannedGroupMembers({ channelId }: BannedGroupMemberListPageProps) {
  const { pop } = useChatNavigation();
  const { confirm } = useConfirmContext();
  const { success } = useNotifications();
  const { unbanUser } = useChannelBanQuery();

  const unbanLabel = useString('amity_chat_member_action_unban');
  const unbanConfirmTitle = useString('amity_chat_unban_confirm_title');
  const unbanConfirmMessage = useString('amity_chat_unban_confirm_message');
  const unbanConfirmButton = useString('amity_chat_unban_confirm_label');
  const cancelLabel = useString('amity_chat_cancel');
  const unbanSuccessToast = useString('amity_chat_action_unban_user');

  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  useDebounce(() => setDebouncedSearch(searchText), SEARCH_DEBOUNCE_MS, [searchText]);

  function handleBack() {
    pop();
  }

  function handleUnbanConfirm(user: Amity.User) {
    confirm({
      title: unbanConfirmTitle,
      content: unbanConfirmMessage,
      okText: unbanConfirmButton,
      cancelText: cancelLabel,
      okButtonColor: 'primary',
      onOk: async () => {
        await unbanUser({ channelId, userIds: [user.userId] });
        success({ content: unbanSuccessToast, alignment: 'fullscreen' });
      },
    });
  }

  const getActionItems: (user: Amity.User) => ActionMenuItem[] = (user: Amity.User) => [
    {
      key: 'unban',
      icon: Banned,
      label: unbanLabel,
      onPress: () => handleUnbanConfirm(user),
    },
  ];

  return {
    channelId,
    searchText,
    setSearchText,
    debouncedSearch,
    handleBack,
    getActionItems,
  };
}
