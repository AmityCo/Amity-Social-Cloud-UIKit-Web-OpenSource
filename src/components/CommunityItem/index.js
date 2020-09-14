import React from 'react';

import { customizableComponent } from 'hocs/customization';
import CommunityName from 'components/CommunityName';

import { Avatar, CommunityItemContainer } from './styles';

const CommunityItem = ({ community, active, onClick }) => (
  <CommunityItemContainer onClick={onClick} active={active}>
    <Avatar avatar={community.avatar} />
    <CommunityName community={community} />
  </CommunityItemContainer>
);

export default customizableComponent('CommunityItem', CommunityItem);
