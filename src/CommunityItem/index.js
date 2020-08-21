import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';

import {
  Avatar,
  CommunityItemContainer,
  CommunityName,
  VervifiedIcon,
  PrivateIcon,
} from './styles';

const CommunityItem = ({ community, active, onClick }) => (
  <CommunityItemContainer onClick={onClick} active={active}>
    <Avatar avatar={community.avatar} />
    {community.isPrivate && <PrivateIcon />}
    <CommunityName title={community.name}>{community.name}</CommunityName>
    {community.verified && <VervifiedIcon />}
  </CommunityItemContainer>
);

export default customizableComponent('CommunityItem')(CommunityItem);
