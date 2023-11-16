import React, { memo } from 'react';
import customizableComponent from '~/core/hocs/customization';

import { TabsContainer, TabsList, TabItem, TabButton } from './styles';

const Tabs = ({ 'data-qa-anchor': dataQaAnchor = '', className, tabs, activeTab, onChange }) => (
  <TabsContainer className={className}>
    <TabsList data-qa-anchor={`${dataQaAnchor}-tabs-list`}>
      {tabs.map(({ value, label }) => (
        <TabItem key={value} data-qa-anchor={`${dataQaAnchor}-${value}-tab-item`}>
          <TabButton
            data-qa-anchor={
              value === activeTab
                ? `${dataQaAnchor}-${value}-tab-button-active`
                : `${dataQaAnchor}-${value}-tab-button`
            }
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
