import React, { memo } from 'react';
import customizableComponent from '~/core/hocs/customization';

import { TabsContainer, TabsList, TabItem, TabButton } from './styles';

const Tabs = ({ className, tabs, activeTab, onChange }) => (
  <TabsContainer className={className}>
    <TabsList>
      {tabs.map(({ value, label }) => (
        <TabItem key={value}>
          <TabButton
            className={value === activeTab ? 'active' : ''}
            onClick={() => onChange(value)}
          >
            {label}
          </TabButton>
        </TabItem>
      ))}
    </TabsList>
  </TabsContainer>
);

export default memo(customizableComponent('Tabs', Tabs));
