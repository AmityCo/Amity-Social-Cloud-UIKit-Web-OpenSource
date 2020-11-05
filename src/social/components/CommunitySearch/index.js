import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

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

const CommunitySearch = ({ className, onClickCommunity, popoverMenuClassName, sticky = false }) => {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(true);
  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);

  useEffect(() => {
    search.length && open();
  }, [search]);

  const handleSearchResultClick = communityId => {
    onClickCommunity(communityId);
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
      <CommunitiesSearchContainer className={className} sticky={sticky}>
        <FormattedMessage id="exploreHeader.searchCommunityPlaceholder">
          {([placeholder]) => (
            <CommunitiesSearchInput
              value={search}
              onChange={e => setSearch(e.target.value)}
              type="text"
              placeholder={placeholder}
            />
          )}
        </FormattedMessage>

        <SearchIcon />
      </CommunitiesSearchContainer>
    </Popover>
  );
};

CommunitySearch.propTypes = {
  className: PropTypes.string,
  onClickCommunity: PropTypes.func,
  popoverMenuClassName: PropTypes.string,
  sticky: PropTypes.bool,
};

CommunitySearch.defaultProps = {
  popoverMenuClassName: null,
  sticky: false,
};

export default customizableComponent('CommunitySearch', CommunitySearch);
