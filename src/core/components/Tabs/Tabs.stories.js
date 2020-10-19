import React from 'react';
import { useArgs } from '@storybook/client-api';
import Tabs from '.';

export default {
  title: 'Components/Tabs',
  parameters: { layout: 'centered' },
};

// Global config
const mockUpTabs = {
  tab1: 'Tab 1',
  tab2: 'Tab 2',
  tab3: 'Tab 3',
};

// We test generation of tabs
export const TabsDistribution = ({ tabs, onChange }) => {
  return <Tabs tabs={tabs} activeTab={Object.keys(tabs)[0]} onChange={onChange} />;
};

TabsDistribution.args = {
  tabs: { ...mockUpTabs },
};

TabsDistribution.argTypes = {
  tabs: {
    control: {
      type: 'object',
    },
  },
  onChange: { action: 'onChange' },
};

export const ChangingTabs = () => {
  const [{ activeTab, onChange }, updateArgs] = useArgs();

  const setActiveTab = val => {
    onChange(val);
    updateArgs({ activeTab: val });
  };

  return <Tabs tabs={mockUpTabs} activeTab={activeTab} onChange={setActiveTab} />;
};

ChangingTabs.args = {
  activeTab: Object.values(mockUpTabs)[0],
};

ChangingTabs.argTypes = {
  activeTab: {
    control: {
      type: 'select',
      options: Object.values(mockUpTabs),
    },
  },
  onChange: { action: 'onChange' },
};
