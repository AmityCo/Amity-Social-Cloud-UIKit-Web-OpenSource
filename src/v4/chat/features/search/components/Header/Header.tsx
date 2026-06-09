import { SearchInput } from '~/v4/core/components/SearchInput/SearchInput';
import { useString } from '~/v4/core/localization';
import { SEARCH_MAX_QUERY_LENGTH } from '~/v4/chat/constants';
import styles from './Header.module.css';

type HeaderProps = {
  searchText: string;
  onSearchTextChange: (value: string) => void;
  onClear: () => void;
  onCancel: () => void;
};

export function Header({ searchText, onSearchTextChange, onClear, onCancel }: HeaderProps) {
  const placeholder = useString('amity_chat_search_placeholder');
  const cancelLabel = useString('amity_chat_cancel');

  return (
    <header className={styles.header}>
      <SearchInput
        value={searchText}
        onChange={onSearchTextChange}
        onClear={onClear}
        placeholder={placeholder}
        maxLength={SEARCH_MAX_QUERY_LENGTH}
        cancel={{ label: cancelLabel, onPress: onCancel }}
      />
    </header>
  );
}
