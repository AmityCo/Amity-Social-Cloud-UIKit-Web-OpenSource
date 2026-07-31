import { TopBar } from '~/v4/chat/elements/TopBar';
import { SearchInput } from '~/v4/core/design/molecules/SearchInput';
import { useString } from '~/v4/core/localization';
import styles from './Header.module.css';

type HeaderProps = {
  onClose: () => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
};

export function Header({ onClose, searchValue, onSearchChange }: HeaderProps) {
  const title = useString('amity_chat_create_conversation_title');
  const searchPlaceholder = useString('amity_chat_search_placeholder');
  return (
    <header className={styles.header}>
      <TopBar title={title} leadingType="close" onLeading={onClose} />
      <div className={styles.header__searchBar}>
        <SearchInput
          value={searchValue}
          onChange={onSearchChange}
          placeholder={searchPlaceholder}
          aria-label={searchPlaceholder}
        />
      </div>
    </header>
  );
}
