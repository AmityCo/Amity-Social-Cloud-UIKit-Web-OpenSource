import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';

import {
  Avatar,
  CommunityItemContainer,
  CommunityName,
  VervifiedIcon,
  PrivateIcon,
} from './styles';

const CommunityItem = ({ community, selected, onSelect }) => (
  <CommunityItemContainer onClick={() => onSelect(channel.channelId)} selected={selected}>
    <Avatar />
    {community.isPrivate && <PrivateIcon />}
    <CommunityName>{community.name}</CommunityName>
    {community.verified && <VervifiedIcon />}
  </CommunityItemContainer>
);

export default customizableComponent('CommunityItem')(CommunityItem);
