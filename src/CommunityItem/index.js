import React from 'react';

import { customizableComponent } from '../hoks/customization';
import CommunityName from '../commonComponents/CommunityName';

import { Avatar, CommunityItemContainer } from './styles';

const CommunityItem = ({ community, active, onClick }) => (
  <CommunityItemContainer onClick={onClick} active={active}>
    <Avatar avatar={community.avatar} />
    <CommunityName community={community} />
  </CommunityItemContainer>
);

export default customizableComponent('CommunityItem')(CommunityItem);
