import React from 'react';
import Tab from '~/core/components/Tab';
import { customizableComponent } from '~/core/hocs/customization';

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

export default customizableComponent('UserFeedHeader', UserFeedHeader);
