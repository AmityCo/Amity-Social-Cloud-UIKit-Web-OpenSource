import React, { useState, useEffect } from 'react';
import { toHumanString } from 'human-readable-numbers';
import { customizableComponent } from '../hoks/customization';
import Button from '../commonComponents/Button';
import Tab from '../commonComponents/Tab';

import { CommunityHeaderContainer, Tabs } from './styles';

const CommunityHeader = ({ className }) => {
  return (
    <CommunityHeaderContainer className={className}>
      <Tabs>
        <Tab active>Timeline</Tab>
        <Tab>Members</Tab>
      </Tabs>
    </CommunityHeaderContainer>
  );
};

export default customizableComponent('CommunityHeader')(CommunityHeader);
