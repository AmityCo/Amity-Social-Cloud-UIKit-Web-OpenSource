import { Button } from '~/v4/core/design/atoms/Button';
import { SearchInput } from '~/v4/core/design/molecules/SearchInput';
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
        aria-label={placeholder}
        maxLength={SEARCH_MAX_QUERY_LENGTH}
        className={styles.header__input}
      />
      <Button.Main
        styleType="ghost"
        hierarchy="primary"
        size="sm"
        label={cancelLabel}
        onPress={onCancel}
        aria-label={cancelLabel}
      />
    </header>
  );
}
