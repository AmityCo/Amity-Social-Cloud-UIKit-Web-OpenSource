import React, { createContext, useContext, useMemo, useState } from 'react';
import type { Key } from 'react-aria-components';
import { useDebounce } from 'react-use';
import { SEARCH_DEBOUNCE_MS, SEARCH_TAB } from '~/v4/chat/constants';

type SearchTabValue = (typeof SEARCH_TAB)[keyof typeof SEARCH_TAB];

type ChatSearchContextValue = {
  searchText: string;
  setSearchText: (value: string) => void;
  debouncedQuery: string;
  activeTab: SearchTabValue;
  setActiveTab: (key: Key) => void;
  clearSearch: () => void;
};

const defaultValue: ChatSearchContextValue = {
  searchText: '',
  setSearchText: () => {},
  debouncedQuery: '',
  activeTab: SEARCH_TAB.CHATS,
  setActiveTab: () => {},
  clearSearch: () => {},
};

const ChatSearchContext = createContext<ChatSearchContextValue>(defaultValue);

export function ChatSearchProvider({ children }: { children: React.ReactNode }) {
  const [searchText, setSearchText] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [activeTab, setActiveTabState] = useState<SearchTabValue>(SEARCH_TAB.CHATS);

  useDebounce(() => setDebouncedQuery(searchText.trim()), SEARCH_DEBOUNCE_MS, [searchText]);

  function clearSearch() {
    setSearchText('');
    setDebouncedQuery('');
  }

  function setActiveTab(key: Key) {
    setActiveTabState(key as SearchTabValue);
  }

  const value = useMemo(
    () => ({
      searchText,
      setSearchText,
      debouncedQuery,
      activeTab,
      setActiveTab,
      clearSearch,
    }),
    [searchText, debouncedQuery, activeTab],
  );

  return <ChatSearchContext.Provider value={value}>{children}</ChatSearchContext.Provider>;
}

export function useChatSearch(): ChatSearchContextValue {
  return useContext(ChatSearchContext);
}
