import { Button } from '~/v4/core/components/AriaButton/Button';
import { SearchInput } from '~/v4/core/components/SearchInput/SearchInput';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { TopBar } from '~/v4/chat/elements/TopBar';
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
        leadingType="close"
        onLeading={onClose}
        trailing={
          <Button
            type="submit"
            variant="text"
            color="primary"
            isDisabled={!isFormValid}
            className={styles.header__nextButton}
            aria-label={nextLabel}
          >
            <Typography.Body className={styles.header__nextLabel} data-enabled={isFormValid}>
              {nextLabel}
            </Typography.Body>
          </Button>
        }
      />
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
