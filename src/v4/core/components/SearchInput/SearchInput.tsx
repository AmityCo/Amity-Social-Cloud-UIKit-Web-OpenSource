import { Input } from 'react-aria-components';
import React from 'react';
import { useString } from '~/v4/core/localization';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { SearchIcon } from '~/v4/social/elements/SearchIcon';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import styles from './SearchInput.module.css';

export type SearchInputProps = {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  onFocus?: () => void;
  onClear?: () => void;
};

export function SearchInput({
  pageId = '*',
  componentId = '*',
  elementId = 'search_input',
  value,
  onChange,
  placeholder,
  onFocus,
  onClear,
}: SearchInputProps) {
  const defaultPlaceholder = useString('amity_social_button_search');
  const { isExcluded, themeStyles, accessibilityId } = useAmityElement({
    pageId,
    componentId,
    elementId,
  });

  if (isExcluded) return null;

  const handleClear = () => {
    onChange('');
    onClear?.();
  };

  return (
    <div className={styles.searchInput} style={themeStyles} data-testid={accessibilityId}>
      <div className={styles.searchInput__container}>
        <SearchIcon
          pageId={pageId}
          componentId={componentId}
          defaultClassName={styles.searchInput__searchIcon}
          imgClassName={styles.searchInput__searchIcon_img}
        />
        <Input
          type="text"
          onFocus={onFocus}
          value={value}
          placeholder={placeholder ?? defaultPlaceholder}
          className={styles.searchInput__textInput}
          onChange={(ev) => onChange(ev.target.value)}
        />
      </div>

      {value !== '' && (
        <ClearButton
          pageId={pageId}
          componentId={componentId}
          onPress={handleClear}
          buttonClassName={styles.searchInput__clearButton}
          imgClassName={styles.searchInput__clearButton__img}
          defaultClassName={styles.searchInput__clearButton__default}
        />
      )}
    </div>
  );
}
