import React from 'react';

import { customizableComponent } from '../hoks/customization';

import CommunitySearch from './CommunitySearch';

import { Avatar, CreateCommunityButton, ExploreHeaderContainer, PlusIcon } from './styles';

const ExploreHeader = ({ onSearchResultCommunityClick, onCreateCommunityClick }) => (
  <ExploreHeaderContainer>
    Explore community
    <CommunitySearch onSearchResultCommunityClick={onSearchResultCommunityClick} />
    or create your own community
    <CreateCommunityButton onClick={onCreateCommunityClick}>
      <PlusIcon />
      Create community
    </CreateCommunityButton>
  </ExploreHeaderContainer>
);

export default customizableComponent('ExploreHeader')(ExploreHeader);