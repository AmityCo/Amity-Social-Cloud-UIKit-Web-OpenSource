import React from 'react';

import customizableComponent from '~/core/hocs/customization';
import CommunityName from '~/social/components/CommunityName';
import { backgroundImage as CommunityImage } from '~/icons/Community';

import { Avatar, CommunityItemContainer } from './styles';

const CommunityItem = ({ community, active, onClick }) => (
  <CommunityItemContainer onClick={onClick} active={active}>
    <Avatar avatar={community.avatar} backgroundImage={CommunityImage} />
    <CommunityName community={community} />
  </CommunityItemContainer>
);

export default customizableComponent('CommunityItem', CommunityItem);
