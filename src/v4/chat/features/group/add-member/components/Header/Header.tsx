import { TopBar } from '~/v4/chat/elements/TopBar';
import { SearchInput } from '~/v4/core/components/SearchInput/SearchInput';
import { SelectedUsersBar } from '~/v4/chat/features/group/select-member/components/SelectedUsersBar';
import { useString } from '~/v4/core/localization';
import styles from './Header.module.css';

type HeaderProps = {
  searchValue: string;
  selectedUsers: Amity.User[];
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onRemoveUser: (userId: string) => void;
};

export function Header({
  searchValue,
  selectedUsers,
  onClose,
  onSearchChange,
  onRemoveUser,
}: HeaderProps) {
  const pageTitle = useString('amity_chat_add_member_title');
  const searchPlaceholder = useString('amity_chat_search_placeholder');
  return (
    <header className={styles.header}>
      <TopBar title={pageTitle} leadingType="close" onLeading={onClose} />
      <div className={styles.header__searchBar}>
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
        />
      </div>
      <SelectedUsersBar users={selectedUsers} onRemoveUser={onRemoveUser} />
    </header>
  );
}
