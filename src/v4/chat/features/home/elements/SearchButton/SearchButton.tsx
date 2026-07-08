import { useString } from '~/v4/core/localization';
import { IconButton } from '~/v4/chat/elements/IconButton';
import { useChatNavigation, ChatPageTypes } from '~/v4/chat/providers/ChatNavigationProvider';

export function SearchButton() {
  const { push } = useChatNavigation();
  const ariaLabel = useString('amity_chat_search_placeholder');

  function handlePress() {
    push({ type: ChatPageTypes.SearchChannelPage });
  }

  return <IconButton icon="search" aria-label={ariaLabel} onPress={handlePress} />;
}
