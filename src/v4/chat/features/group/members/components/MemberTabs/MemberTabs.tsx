import { useState } from 'react';
import type { Key } from 'react-aria-components';
import { useDebounce } from 'react-use';
import { Tabs } from '~/v4/core/components/Tabs/Tabs';
import { SearchInput } from '~/v4/core/components/SearchInput/SearchInput';
import { useString } from '~/v4/core/localization';
import { SEARCH_DEBOUNCE_MS } from '~/v4/chat/constants/search';
import { MemberList } from '~/v4/chat/features/group/members/components/MemberList';
import type { OpenMemberActionsParams } from '~/v4/chat/features/group/members/hooks/useGroupMembers';
import styles from './MemberTabs.module.css';

export enum MembershipsTab {
  Members = 'members',
  Moderators = 'moderators',
}

type MemberTabsProps = {
  channelId: string;
  currentUserId: string | null | undefined;
  onOpenMemberActions: (params: OpenMemberActionsParams) => void;
};

export function MemberTabs({ channelId, currentUserId, onOpenMemberActions }: MemberTabsProps) {
  const [activeTab, setActiveTab] = useState<Key>(MembershipsTab.Members);
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const searchPlaceholder = useString('amity_chat_search_placeholder');
  const membersTabLabel = useString('amity_chat_member_tab_members');
  const moderatorsTabLabel = useString('amity_chat_member_tab_moderators');

  useDebounce(() => setDebouncedSearch(searchText), SEARCH_DEBOUNCE_MS, [searchText]);

  function handleTabChange(key: Key) {
    setActiveTab(key);
    setSearchText('');
    setDebouncedSearch('');
  }

  function renderTabContent(onlyModerators: boolean) {
    return (
      <>
        <div className={styles.memberTabs__searchBar}>
          <SearchInput
            value={searchText}
            onChange={setSearchText}
            placeholder={searchPlaceholder}
          />
        </div>
        <MemberList
          channelId={channelId}
          search={debouncedSearch}
          onlyModerators={onlyModerators}
          currentUserId={currentUserId}
          onOpenMemberActions={onOpenMemberActions}
        />
      </>
    );
  }

  return (
    <Tabs
      variant="underlined"
      fullWidth={false}
      value={activeTab}
      onChange={handleTabChange}
      tabListClassName={styles.memberTabs__list}
      tabPanelClassName={styles.memberTabs__panel}
      tabs={[
        {
          value: MembershipsTab.Members,
          label: membersTabLabel,
          content: () => renderTabContent(false),
        },
        {
          value: MembershipsTab.Moderators,
          label: moderatorsTabLabel,
          content: () => renderTabContent(true),
        },
      ]}
    />
  );
}
