import React from 'react';
import { customizableComponent } from '~/core/hocs/customization';
import Tab from '~/core/components/Tab';

import { TabsContainer } from './styles';

const Tabs = ({ className, tabs, activeTab, onChange }) => (
  <TabsContainer className={className}>
    {tabs.map(tab => (
      <Tab key={tab} active={tab === activeTab} onClick={() => onChange(tab)}>
        {tab}
      </Tab>
    ))}
  </TabsContainer>
);

export default customizableComponent('Tabs', Tabs);
