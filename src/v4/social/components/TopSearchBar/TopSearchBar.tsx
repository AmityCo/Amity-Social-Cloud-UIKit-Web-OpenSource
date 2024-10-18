import React, { useEffect, useState } from 'react';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { CancelButton } from '~/v4/social/elements/CancelButton';
import { SearchIcon } from '~/v4/social/elements/SearchIcon';

import styles from './TopSearchBar.module.css';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Input } from 'react-aria-components';

export interface TopSearchBarProps {
  pageId?: string;
  search: (keyword: string) => void;
}

export function TopSearchBar({ pageId = '*', search }: TopSearchBarProps) {
  const componentId = 'top_search_bar';
  const { config, isExcluded, themeStyles, accessibilityId } = useAmityComponent({
    pageId,
    componentId,
  });

  const { onBack } = useNavigation();

  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    search(searchValue);
  }, [searchValue]);

  if (isExcluded) return null;

  return (
    <div className={styles.topSearchBar} style={themeStyles}>
      <div className={styles.topSearchBar__inputBar}>
        <SearchIcon
          pageId={pageId}
          componentId={componentId}
          defaultClassName={styles.topSearchBar__searchIcon}
          imgClassName={styles.topSearchBar__searchIcon_img}
        />
        <Input
          className={styles.topSearchBar__textInput}
          type="text"
          value={searchValue}
          placeholder={config.text}
          onChange={(ev) => setSearchValue(ev.target.value)}
          data-qa-anchor={accessibilityId}
        />
        {searchValue != '' ? (
          <ClearButton
            pageId={pageId}
            componentId={componentId}
            defaultClassName={styles.topSearchBar__clearButton}
            imgClassName={styles.topSearchBar__clearButton__img}
            onPress={() => {
              setSearchValue('');
            }}
          />
        ) : null}
      </div>
      <CancelButton pageId={pageId} componentId={componentId} onPress={() => onBack()} />
    </div>
  );
}
