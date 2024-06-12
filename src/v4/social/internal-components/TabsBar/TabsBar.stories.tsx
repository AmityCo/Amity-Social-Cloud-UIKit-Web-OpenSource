import React from 'react';
import { TabsBar } from './TabsBar';

export default {
  title: 'v4-social/internal-components/TabsBar',
};

export const TabsBarStory = {
  render: () => {
    const tabs = [
      { label: 'tab1', value: 'tab1', content: () => 'Tab 1' },
      { label: 'tab2', value: 'tab2', content: () => 'Tab 2' },
      { label: 'tab3', value: 'tab3', content: () => 'Tab 3' },
    ];

    const [activeTab, setActiveTab] = React.useState('tab1');

    return (
      <TabsBar activeTab={activeTab} tabs={tabs} onTabChange={(newTab) => setActiveTab(newTab)} />
    );
  },
};
