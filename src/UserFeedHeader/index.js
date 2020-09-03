import React from 'react';
import { customizableComponent } from '../hoks/customization';
import Tab from '../commonComponents/Tab';

import { UserFeedHeaderContainer, Tabs } from './styles';

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
