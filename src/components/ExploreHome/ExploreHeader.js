import React from 'react';

import { customizableComponent } from 'hocs/customization';

import CommunitySearch from './CommunitySearch';

import { CreateCommunityButton, ExploreHeaderContainer, PlusIcon } from './styles';

const searchContainerSize = 480;

const ExploreHeader = ({ onSearchResultCommunityClick, onCreateCommunityClick }) => (
  <ExploreHeaderContainer>
    Explore community
    <CommunitySearch
      searchContainerSize={searchContainerSize}
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
