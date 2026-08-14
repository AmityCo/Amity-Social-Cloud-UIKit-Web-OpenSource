import { Button } from '~/v4/core/design/atoms/Button';
import { TopBar } from '~/v4/chat/elements/TopBar';
import { SearchInput } from '~/v4/core/design/molecules/SearchInput';
import { SelectedUsersBar } from '~/v4/chat/features/group/select-member/components/SelectedUsersBar/SelectedUsersBar';
import { useString } from '~/v4/core/localization';
import styles from './Header.module.css';

type HeaderProps = {
  searchValue: string;
  selectedUsers: Amity.User[];
  isFormValid: boolean;
  onClose: () => void;
  onSearchChange: (value: string) => void;
  onRemoveUser: (userId: string) => void;
};

export function Header({
  searchValue,
  selectedUsers,
  isFormValid,
  onClose,
  onSearchChange,
  onRemoveUser,
}: HeaderProps) {
  const title = useString('amity_chat_select_members_title');
  const nextLabel = useString('amity_chat_next');
  const searchPlaceholder = useString('amity_chat_search_placeholder');

  return (
    <header className={styles.header}>
      <TopBar
        title={title}
        leadingType="back"
        onLeading={onClose}
        trailing={
          <Button.Main
            type="submit"
            styleType="ghost"
            hierarchy="primary"
            size="sm"
            label={nextLabel}
            isDisabled={!isFormValid}
            aria-label={nextLabel}
          />
        }
      />
      <div className={styles.header__searchBar}>
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </div>
      <SelectedUsersBar users={selectedUsers} onRemoveUser={onRemoveUser} />
    </header>
  );
}
