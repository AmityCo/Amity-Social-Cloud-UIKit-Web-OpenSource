import React, { useState, useEffect } from 'react';
import { toHumanString } from 'human-readable-numbers';
import { customizableComponent } from '../hoks/customization';
import Button from '../commonComponents/Button';
import Tab from '../commonComponents/Tab';

import {
  Avatar,
  Buttons,
  CommunityHeaderContainer,
  CommunityWrapper,
  CommunityName,
  Tabs,
  Count,
  ChatIcon,
  PenIcon,
  PrivateIcon,
} from './styles';

const EditProfileButton = () => (
  <Button>
    <PenIcon />
    Edit Profile
  </Button>
);

const ChatButton = () => (
  <Button>
    <ChatIcon />
  </Button>
);

const CommunityHeader = ({ className }) => {
  const private = true;
  const name = 'Harry Poter Fans';
  const postsCount = 345;
  const membersCount = 4501;

  return (
    <CommunityHeaderContainer className={className}>
      <CommunityWrapper>
        <Avatar />
        <div>
          {private && <PrivateIcon />}
          <CommunityName>{name}</CommunityName>
          <div>
            <Count>{toHumanString(postsCount)}</Count> posts{' '}
            <Count>{toHumanString(membersCount)}</Count> members
          </div>
        </div>
        <Buttons>
          <ChatButton /> <EditProfileButton />
        </Buttons>
      </CommunityWrapper>
      <Tabs>
        <Tab active>Timeline</Tab>
        <Tab>About</Tab>
      </Tabs>
    </CommunityHeaderContainer>
  );
};

export default customizableComponent('CommunityHeader')(CommunityHeader);
