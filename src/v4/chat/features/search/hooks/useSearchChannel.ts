import { useChatNavigation } from '~/v4/chat/providers/ChatNavigationProvider';
import { useChatSearch } from '~/v4/chat/providers/ChatSearchProvider';

export function useSearchChannel() {
  const { pop } = useChatNavigation();
  const { searchText, setSearchText, debouncedQuery, activeTab, setActiveTab, clearSearch } =
    useChatSearch();

  function cancel() {
    clearSearch();
    pop();
  }

  return {
    searchText,
    setSearchText,
    debouncedQuery,
    clearSearch,
    cancel,
    activeTab,
    setActiveTab,
  };
}
