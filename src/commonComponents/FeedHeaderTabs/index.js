import React, { useState, useEffect } from 'react';
import { toHumanString } from 'human-readable-numbers';
import { customizableComponent } from '../../hoks/customization';
import Button from '../Button';
import Tab from '../Tab';

import { FeedHeaderContainer, Tabs } from './styles';

const FeedHeaderTabs = ({ className, tabs, activeTab, onChange }) => {
  return (
    <FeedHeaderContainer className={className}>
      <Tabs>
        {tabs.map(tab => (
          <Tab key={tab} active={tab === activeTab} onClick={() => onChange(tab)}>
            {tab}
          </Tab>
        ))}
      </Tabs>
    </FeedHeaderContainer>
  );
};

export default customizableComponent('FeedHeaderTabs')(FeedHeaderTabs);
