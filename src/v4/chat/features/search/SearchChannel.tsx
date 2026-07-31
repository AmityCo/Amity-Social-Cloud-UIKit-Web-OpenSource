import { Tabs } from '~/v4/core/design/molecules/Tabs';
import { useString } from '~/v4/core/localization';
import { SEARCH_TAB } from '~/v4/chat/constants';
import { useSearchChannel } from '~/v4/chat/features/search/hooks';
import { Header, SearchChannelList, SearchMessageList } from '~/v4/chat/features/search/components';
import styles from './SearchChannel.module.css';

export function SearchChannel() {
  const {
    searchText,
    setSearchText,
    debouncedQuery,
    clearSearch,
    cancel,
    activeTab,
    setActiveTab,
  } = useSearchChannel();
  const chatsTabLabel = useString('amity_chat_search_tab_chats');
  const messagesTabLabel = useString('amity_chat_search_tab_messages');

  return (
    <div className={styles.searchChannel}>
      <Header
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onClear={clearSearch}
        onCancel={cancel}
      />
      <Tabs
        variant="underlined"
        value={activeTab}
        onChange={setActiveTab}
        tabListClassName={styles.searchChannel__tabList}
        tabs={[
          {
            value: SEARCH_TAB.CHATS,
            label: chatsTabLabel,
            content: () => <SearchChannelList query={debouncedQuery} />,
          },
          {
            value: SEARCH_TAB.MESSAGES,
            label: messagesTabLabel,
            content: () => <SearchMessageList query={debouncedQuery} />,
          },
        ]}
      />
    </div>
  );
}
