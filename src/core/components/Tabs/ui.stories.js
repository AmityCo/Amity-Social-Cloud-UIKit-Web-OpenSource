import React from 'react';
import { useArgs } from '@storybook/client-api';

import UiKitTabs from '.';
import UiKitMediaGalleryTabs from './MediaGalleryTabs';

export default {
  title: 'Ui Only/Tabs',
};

// Global config
const mockUpTabs = [
  { value: 'tab1', label: 'Tab 1' },
  { value: 'tab2', label: 'Tab 2' },
  { value: 'tab3', label: 'Tab 3' },
];

// We test generation of tabs
export const Distribution = ({ tabs, onChange }) => {
  return <UiKitTabs tabs={tabs} activeTab={mockUpTabs[0].value} onChange={onChange} />;
};

Distribution.args = {
  tabs: mockUpTabs,
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

  const setActiveTab = (val) => {
    onChange(val);
    updateArgs({ activeTab: val });
  };

  return <UiKitTabs tabs={mockUpTabs} activeTab={activeTab} onChange={setActiveTab} />;
};

Active.args = {
  activeTab: mockUpTabs[0].value,
};

Active.argTypes = {
  activeTab: {
    control: { type: 'select' },
    options: mockUpTabs.map((x) => x.value),
  },
  onChange: { action: 'onChange()' },
};

export const ActiveMediaGalleryTabs = () => {
  const [{ activeTab, onChange }, updateArgs] = useArgs();

  const setActiveTab = (val) => {
    onChange(val);
    updateArgs({ activeTab: val });
  };

  return <UiKitMediaGalleryTabs tabs={mockUpTabs} activeTab={activeTab} onChange={setActiveTab} />;
};

ActiveMediaGalleryTabs.args = {
  activeTab: mockUpTabs[0].value,
};

ActiveMediaGalleryTabs.argTypes = {
  activeTab: {
    control: { type: 'select' },
    options: mockUpTabs.map((x) => x.value),
  },
  onChange: { action: 'onChange()' },
};
