import React from 'react';

import { customizableComponent } from '~/core/hocs/customization';

import CommunitySearch from './CommunitySearch';

import { CreateCommunityButton, ExploreHeaderContainer, PlusIcon } from './styles';

const searchContainerClassName = 'explore-header-search-container';

const ExploreHeader = ({ onSearchResultCommunityClick, onCreateCommunityClick }) => (
  <ExploreHeaderContainer>
    Explore community
    <CommunitySearch
      className={searchContainerClassName}
      placeholder="Search communities..."
      onSearchResultCommunityClick={onSearchResultCommunityClick}
    />
    or create your own community
    <CreateCommunityButton onClick={onCreateCommunityClick}>
      <PlusIcon />
      Create community
    </CreateCommunityButton>
  </ExploreHeaderContainer>
);

export default customizableComponent('ExploreHeader', ExploreHeader);
