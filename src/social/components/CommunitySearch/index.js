import React, { useState, useEffect } from 'react';

import Popover from '~/core/components/Popover';
import { customizableComponent } from '~/core/hocs/customization';
import CommunitiesSearchList from '~/social/components/CommunitiesSearchList';
import {
  CommunitiesSearchContainer,
  CommunitiesSearchInput,
  SearchIcon,
  CommunitiesSearchResults,
} from './styles';

const CommunitySearch = ({ onSearchResultCommunityClick, className, placeholder }) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    query.length && open();
  }, [query]);

  const handleSearchResultClick = communityId => {
    onSearchResultCommunityClick(communityId);
    setQuery('');
    close();
  };

  const menu = (
    <CommunitiesSearchResults className={className}>
      <CommunitiesSearchList searchInput={query} onClickSearchResult={handleSearchResultClick} />
    </CommunitiesSearchResults>
  );

  const isPopoverOpen = isOpen && query.length;

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={close}
      position="bottom"
      align="start"
      content={menu}
    >
      <CommunitiesSearchContainer className="explore-header-search-container">
        <CommunitiesSearchInput
          value={query}
          onChange={e => setQuery(e.target.value)}
          type="text"
          placeholder={placeholder}
        />
        <SearchIcon />
      </CommunitiesSearchContainer>
    </Popover>
  );
};

export default customizableComponent('CommunitySearch', CommunitySearch);
