import React, { useState, useEffect } from 'react';
import { toHumanString } from 'human-readable-numbers';
import { customizableComponent } from '../hoks/customization';
import Button from '../commonComponents/Button';
import Tab from '../commonComponents/Tab';

import {
  Avatar,
  Buttons,
  UserFeedHeaderContainer,
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

const UserFeedHeader = ({ className }) => {
  return (
    <UserFeedHeaderContainer className={className}>
      <Tabs>
        <Tab active>Timeline</Tab>
      </Tabs>
    </UserFeedHeaderContainer>
  );
};

export default customizableComponent('UserFeedHeader')(UserFeedHeader);
