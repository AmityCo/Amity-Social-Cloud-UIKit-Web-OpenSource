import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import Popover from '~/core/components/Popover';
import customizableComponent from '~/core/hocs/customization';
import CommunitiesList from '~/social/components/CommunitiesList';
import {
  CommunitiesSearchContainer,
  CommunitiesSearchInput,
  SearchIcon,
  CommunitiesSearchResults,
} from './styles';

const Menu = ({ search, handleSearchResultClick, popoverMenuClassName }) => {
  if (!search) return null;
  return (
    <CommunitiesSearchResults className={popoverMenuClassName}>
      <CommunitiesList
        communitiesQueryParam={{ search }}
        onClickCommunity={handleSearchResultClick}
      />
    </CommunitiesSearchResults>
  );
};

const CommunitySearch = ({ onSearchResultCommunityClick, popoverMenuClassName, placeholder }) => {
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

  const isPopoverOpen = isOpen && search.length;

  return (
    <Popover
      isOpen={isPopoverOpen}
      onClickOutside={close}
      position="bottom"
      align="start"
      content={
        <Menu
          search={search}
          handleSearchResultClick={handleSearchResultClick}
          className={popoverMenuClassName}
        />
      }
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

CommunitySearch.propTypes = {
  onSearchResultCommunityClick: PropTypes.func.isRequired,
  popoverMenuClassName: PropTypes.string,
  placeholder: PropTypes.string,
};

CommunitySearch.defaultProps = {
  popoverMenuClassName: null,
  placeholder: '',
};

export default customizableComponent('CommunitySearch', CommunitySearch);
