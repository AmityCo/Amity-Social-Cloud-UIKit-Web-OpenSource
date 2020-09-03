import React from 'react';
import { customizableComponent } from '../../hoks/customization';
import Tab from '../Tab';

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

export default customizableComponent('Tabs')(Tabs);
