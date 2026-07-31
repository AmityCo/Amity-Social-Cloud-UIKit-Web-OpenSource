import { useString } from '~/v4/core/localization';
import { Button } from '~/v4/core/design/atoms/Button';
import { Search } from '~/v4/core/design/icons/Search';
import { useChatNavigation, ChatPageTypes } from '~/v4/chat/providers/ChatNavigationProvider';

export function SearchButton() {
  const { push } = useChatNavigation();
  const ariaLabel = useString('amity_chat_search_placeholder');

  function handlePress() {
    push({ type: ChatPageTypes.SearchChannelPage });
  }

  return (
    <Button.Icon
      icon={<Search />}
      styleType="filled"
      hierarchy="secondary"
      size={32}
      aria-label={ariaLabel}
      onPress={handlePress}
    />
  );
}
