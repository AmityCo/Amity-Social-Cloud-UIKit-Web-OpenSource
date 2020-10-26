import React, { useState, useEffect } from 'react';

import Popover from '~/core/components/Popover';
import customizableComponent from '~/core/hocs/customization';
import CommunitiesList from '~/social/components/CommunitiesList';
import {
  CommunitiesSearchContainer,
  CommunitiesSearchInput,
  SearchIcon,
  CommunitiesSearchResults,
} from './styles';

const CommunitySearch = ({ onSearchResultCommunityClick, className, placeholder }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    search.length && open();
  }, [search]);

  const handleSearchResultClick = communityId => {
    onSearchResultCommunityClick(communityId);
    setSearch('');
    close();
  };

  const menu = (
    <CommunitiesSearchResults className={className}>
      <CommunitiesList
        communitiesQueryParam={{ search }}
        onClickCommunity={handleSearchResultClick}
      />
    </CommunitiesSearchResults>
  );

  const isPopoverOpen = isOpen && search.length;

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
          value={search}
          onChange={e => setSearch(e.target.value)}
          type="text"
          placeholder={placeholder}
        />
        <SearchIcon />
      </CommunitiesSearchContainer>
    </Popover>
  );
};

export default customizableComponent('CommunitySearch', CommunitySearch);
