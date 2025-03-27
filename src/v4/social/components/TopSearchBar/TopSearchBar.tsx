import { Input } from 'react-aria-components';
import React, { useEffect, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { SearchIcon } from '~/v4/social/elements/SearchIcon';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { CancelButton } from '~/v4/social/elements/CancelButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import styles from './TopSearchBar.module.css';

export type TopSearchBarProps = {
  pageId?: string;
  onFocus?: () => void;
  search: (keyword: string) => void;
};

export function TopSearchBar({ pageId = '*', search, onFocus }: TopSearchBarProps) {
  const componentId = 'top_search_bar';
  const { onBack } = useNavigation();
  const [searchValue, setSearchValue] = useState('');
  const { config, isExcluded, themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  useEffect(() => {
    search(searchValue);
  }, [searchValue]);

  if (isExcluded) return null;

  return (
    <div className={styles.topSearchBar} style={themeStyles} data-testid={accessibilityId}>
      <div className={styles.topSearchBar__inputBar}>
        <SearchIcon
          pageId={pageId}
          componentId={componentId}
          defaultClassName={styles.topSearchBar__searchIcon}
          imgClassName={styles.topSearchBar__searchIcon_img}
        />
        <Input
          type="text"
          onFocus={onFocus}
          value={searchValue}
          placeholder={config.text}
          className={styles.topSearchBar__textInput}
          onChange={(ev) => setSearchValue(ev.target.value)}
        />
        {searchValue != '' ? (
          <ClearButton
            pageId={pageId}
            componentId={componentId}
            buttonClassName={styles.topSearchBar__clearButton}
            imgClassName={styles.topSearchBar__clearButton__img}
            defaultClassName={styles.topSearchBar__clearButton__default}
            onPress={() => {
              setSearchValue('');
            }}
          />
        ) : null}
      </div>
      <div className={styles.topSearchBar__cancelButton}>
        <CancelButton pageId={pageId} componentId={componentId} onPress={() => onBack()} />
      </div>
    </div>
  );
}
