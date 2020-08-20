import React, { useState, useEffect } from 'react';
import { toHumanString } from 'human-readable-numbers';
import { customizableComponent } from '../hoks/customization';
import Button from '../commonComponents/Button';
import Tab from '../commonComponents/Tab';

import { CommunityHeaderContainer, Tabs } from './styles';

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
