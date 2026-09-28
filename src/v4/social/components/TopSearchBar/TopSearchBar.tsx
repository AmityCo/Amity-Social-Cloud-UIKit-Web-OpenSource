import { Input } from 'react-aria-components';
import React, { useEffect, useState } from 'react';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { SearchIcon } from '~/v4/social/elements/SearchIcon';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { CancelButton } from '~/v4/social/elements/CancelButton';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useDebounce } from 'react-use';
import { BackButton } from '~/v4/social/elements';
import styles from './TopSearchBar.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useSearchResultContext } from '~/v4/social/providers/SearchResultProvider';
import { resolveString } from '~/v4/core/localization';

export type TopSearchBarProps = {
  pageId?: string;
  onFocus?: () => void;
  hasCancelButton?: boolean;
  search: (keyword: string) => void;
  initialValue?: string;
  onCloseSearch?: () => void;
  inputTestId?: string;
  placeholderKey?: string;
};

export function TopSearchBar({
  pageId = '*',
  search,
  onFocus,
  hasCancelButton = true,
  initialValue = '',
  onCloseSearch,
  inputTestId,
  // Plain "Search", which is true of every page that shares this bar. The old
  // default said "Search my communities", which was wrong on global search and
  // a promise a Community-less build could not keep. The shared key keeps its
  // own wording — Android and iOS both show "Search my communities" for it — so
  // a caller with something more specific to say still passes its own key, the
  // way CommunityInviteMemberPage does.
  placeholderKey = 'amity_social_label_search',
}: TopSearchBarProps) {
  const componentId = 'top_search_bar';
  const { onBack } = useNavigation();
  const [searchValue, setSearchValue] = useState(initialValue);
  const { isDesktop } = useResponsive();
  const { resetSearchValue } = useSearchResultContext();

  // Update searchValue when initialValue changes, but only if user hasn't started typing
  useEffect(() => {
    if (initialValue && initialValue !== searchValue) {
      setSearchValue(initialValue);
    }
  }, [initialValue]);
  const { isExcluded, themeStyles, accessibilityId, resolveText } = useAmityComponent({
    pageId,
    componentId,
  });

  useDebounce(() => search(searchValue), 500, [searchValue]);

  if (isExcluded) return null;

  return (
    <div
      className={styles.topSearchBar}
      data-cancel={!!hasCancelButton}
      style={themeStyles}
      data-testid={accessibilityId}
    >
      {!isDesktop && (
        <BackButton pageId={pageId} componentId={componentId} onPress={() => onBack()} />
      )}
      <div className={styles.topSearchBar__inputBar}>
        <div className={styles.topSearchBar__inputContainer}>
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
            placeholder={resolveString(placeholderKey)}
            data-testid={inputTestId ?? `${accessibilityId}/input`}
            className={styles.topSearchBar__textInput}
            onChange={(ev) => setSearchValue(ev.target.value)}
          />
        </div>

        {searchValue != '' ? (
          <ClearButton
            pageId={pageId}
            componentId={componentId}
            onPress={() => {
              resetSearchValue();
              setSearchValue('');
              onCloseSearch?.();
            }}
            buttonClassName={styles.topSearchBar__clearButton}
            imgClassName={styles.topSearchBar__clearButton__img}
            defaultClassName={styles.topSearchBar__clearButton__default}
          />
        ) : null}
      </div>
      {hasCancelButton && (
        <div className={styles.topSearchBar__cancelButton}>
          <CancelButton pageId={pageId} componentId={componentId} onPress={() => onBack()} />
        </div>
      )}
    </div>
  );
}
