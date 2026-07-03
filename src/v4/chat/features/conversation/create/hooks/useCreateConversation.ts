import { useState } from 'react';
import { useDebounce } from 'react-use';
import { ChannelRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { SEARCH_DEBOUNCE_MS } from '~/v4/chat/constants';
import { ChatPageTypes, useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';

type CreateChannelParams = Parameters<typeof ChannelRepository.createChannel>[0];

type CreateChannelResponse = Awaited<ReturnType<typeof ChannelRepository.createChannel>>;

export function useCreateConversation() {
  const { pop, replace } = useChatNavigation();
  const [searchText, setSearchText] = useState('');
  const [debouncedText, setDebouncedText] = useState('');

  const { mutateAsync } = useMutation<CreateChannelResponse, Error, CreateChannelParams>({
    mutationFn: ChannelRepository.createChannel,
  });

  useDebounce(() => setDebouncedText(searchText), SEARCH_DEBOUNCE_MS, [searchText]);

  async function handleSelectUser(user: Amity.User) {
    await mutateAsync(
      {
        type: 'conversation',
        userIds: [user.userId],
      },
      {
        onSuccess: (result) => {
          replace({
            type: ChatPageTypes.ChatPage,
            context: {
              channelId: result?.data?.channelId,
              userId: user.userId,
              userDisplayName: user.displayName,
              isJustCreated: true,
            },
          });
        },
      },
    );
  }

  return {
    searchText,
    setSearchText,
    debouncedText,
    handleSelectUser,
    handleClose: pop,
  };
}
