import { SearchInput } from '~/v4/core/design/molecules/SearchInput';
import { useString } from '~/v4/core/localization';
import { Header } from '~/v4/chat/features/group/banned-members/components/Header';
import { BannedMemberList } from '~/v4/chat/features/group/banned-members/components/BannedMemberList';
import { useBannedGroupMembers } from '~/v4/chat/features/group/banned-members/hooks/useBannedGroupMembers';
import type { BannedGroupMemberListPageProps } from '~/v4/chat/pages/BannedGroupMemberListPage';
import styles from './BannedGroupMembers.module.css';

export function BannedGroupMembers(props: BannedGroupMemberListPageProps) {
  const { channelId, searchText, setSearchText, debouncedSearch, handleBack, getActionItems } =
    useBannedGroupMembers(props);
  const searchPlaceholder = useString('amity_chat_search_placeholder');

  return (
    <div className={styles.bannedGroupMembers}>
      <Header onBack={handleBack} />
      <div className={styles.bannedGroupMembers__searchBar}>
        <SearchInput
          value={searchText}
          onChange={setSearchText}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </div>
      <BannedMemberList
        channelId={channelId}
        search={debouncedSearch}
        getActionItems={getActionItems}
      />
    </div>
  );
}
