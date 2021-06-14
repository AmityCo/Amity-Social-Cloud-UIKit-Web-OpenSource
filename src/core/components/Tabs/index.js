import React, { memo } from 'react';
import customizableComponent from '~/core/hocs/customization';

import { TabsContainer, TabsList, TabItem, TabButton } from './styles';

const Tabs = ({ className, tabs, activeTab, onChange }) => (
  <TabsContainer className={className}>
    <TabsList>
      {Object.entries(tabs).map(([key, val]) => (
        <TabItem key={key}>
          <TabButton className={val === activeTab ? 'active' : ''} onClick={() => onChange(val)}>
            {val}
          </TabButton>
        </TabItem>
      ))}
    </TabsList>
  </TabsContainer>
);

export default memo(customizableComponent('Tabs', Tabs));
