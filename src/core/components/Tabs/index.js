import React from 'react';
import { customizableComponent } from '~/core/hocs/customization';

import { TabsContainer, TabsList, TabItem, TabButton } from './styles';

const Tabs = ({ className, tabs, activeTab, onChange }) => (
  <TabsContainer className={className}>
    <TabsList>
      {Object.entries(tabs).map(([key, val]) => (
        <TabItem key={key}>
          <TabButton className={key === activeTab ? 'active' : ''} onClick={() => onChange(key)}>
            {val}
          </TabButton>
        </TabItem>
      ))}
    </TabsList>
  </TabsContainer>
);

export default customizableComponent('Tabs', Tabs);
