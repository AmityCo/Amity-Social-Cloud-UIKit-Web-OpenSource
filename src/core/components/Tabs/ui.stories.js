import React from 'react';
import { useArgs } from '@storybook/client-api';

import UiKitTabs from '.';

export default {
  title: 'Ui Only/Tabs',
};

// Global config
const mockUpTabs = {
  tab1: 'Tab 1',
  tab2: 'Tab 2',
  tab3: 'Tab 3',
};

// We test generation of tabs
export const Distribution = ({ tabs, onChange }) => {
  return <UiKitTabs tabs={tabs} activeTab={Object.keys(tabs)[0]} onChange={onChange} />;
};

Distribution.args = {
  tabs: { ...mockUpTabs },
};

Distribution.argTypes = {
  tabs: {
    control: {
      type: 'object',
    },
  },
  onChange: { action: 'onChange()' },
};

export const Active = () => {
  const [{ activeTab, onChange }, updateArgs] = useArgs();

  const setActiveTab = val => {
    onChange(val);
    updateArgs({ activeTab: val });
  };

  return <UiKitTabs tabs={mockUpTabs} activeTab={activeTab} onChange={setActiveTab} />;
};

Active.args = {
  activeTab: Object.values(mockUpTabs)[0],
};

Active.argTypes = {
  activeTab: {
    control: {
      type: 'select',
      options: Object.values(mockUpTabs),
    },
  },
  onChange: { action: 'onChange()' },
};
