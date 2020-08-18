import React, { useState, useEffect } from 'react';
import { ChannelRepository } from 'eko-sdk';

import { customizableComponent } from '../hoks/customization';
import useLiveObject from '../hooks/useLiveObject';
import CommunityItem from '../CommunityItem';
import SideMenuItem from '../commonComponents/SideMenuItem';

import {
  SideMenuListContainer,
  BlockTitle,
  CommunityBlock,
  MyCommunityBlock,
  NewsIcon,
  SearchIcon,
  PlusIcon,
  VervifiedIcon,
} from './styles';

const SideMenu = ({ onChannelClick, selectedChannelId }) => {
  const communities = [
    { name: 'Billie Ellish Fans' },
    { name: 'BLACKPINK TH', verified: true },
    { name: 'Breakfast Club' },
    { name: 'BTS & ARMY' },
    { name: 'Harry Potter Fans', isPrivate: true },
  ];

  return (
    <SideMenuListContainer>
      <CommunityBlock>
        <BlockTitle>Community</BlockTitle>
        <SideMenuItem icon={<NewsIcon />}>NewsFeed</SideMenuItem>
        <SideMenuItem icon={<SearchIcon />}>Explore</SideMenuItem>
      </CommunityBlock>
      <MyCommunityBlock>
        <BlockTitle>My Community</BlockTitle>
        <SideMenuItem icon={<PlusIcon />}>Create Community</SideMenuItem>
        {communities.map((community, i) => (
          <CommunityItem
            /* selected={selectedCommunityId === community.communityId} */
            /* onSelect={onCommunityClick} */
            key={i}
            community={community}
          />
        ))}
      </MyCommunityBlock>
    </SideMenuListContainer>
  );
};

export default customizableComponent('SideMenu')(SideMenu);
