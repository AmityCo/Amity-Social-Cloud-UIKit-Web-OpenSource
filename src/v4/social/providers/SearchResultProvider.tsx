import React, { createContext, PropsWithChildren, useContext, useState } from 'react';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

interface SearchResultContextProps {
  openSearchResult: boolean;
  setOpenSearchResult: (open: boolean) => void;
  openSearchResultModal: (searchValue: string) => void;
  searchValue: string;
  resetSearchValue: () => void;
  setSearchValue: (value: string) => void;
}

const SearchResultContext = createContext<SearchResultContextProps>({
  openSearchResult: false,
  setOpenSearchResult: () => {},
  openSearchResultModal: () => {},
  searchValue: '',
  resetSearchValue: () => {},
  setSearchValue: () => {},
});

export const useSearchResultContext = () => {
  const context = useContext(SearchResultContext);
  if (!context) {
    throw new Error('useSearchResult must be used within a SearchResultProvider');
  }
  return context;
};

type SearchResultProviderProps = PropsWithChildren<{
  defaultOpen?: boolean;
}>;

export const SearchResultProvider: React.FC<SearchResultProviderProps> = ({
  children,
  defaultOpen = false,
}) => {
  const [openSearchResult, setOpenSearchResult] = useState<boolean>(defaultOpen);
  const [searchValue, setSearchValue] = useState<string>('');

  const { AmityPostDetailPageBehavior } = usePageBehavior();
  const { isDesktop } = useResponsive();

  const openSearchResultModal = (searchValue: string) => {
    if (isDesktop) {
      setSearchValue(searchValue);
      setOpenSearchResult(true);
    } else {
      setSearchValue(searchValue);
      AmityPostDetailPageBehavior?.goToSocialGlobalSearchPage?.({ keyword: searchValue });
    }
  };

  const resetSearchValue = () => {
    setSearchValue('');
  };

  return (
    <SearchResultContext.Provider
      value={{
        openSearchResult,
        setOpenSearchResult,
        openSearchResultModal,
        searchValue,
        resetSearchValue,
        setSearchValue,
      }}
    >
      {children}
    </SearchResultContext.Provider>
  );
};
