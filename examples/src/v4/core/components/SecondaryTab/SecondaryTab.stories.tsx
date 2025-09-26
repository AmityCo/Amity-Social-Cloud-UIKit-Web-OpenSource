import React from 'react';
import { SecondaryTab } from './SecondaryTab';
import { Key } from 'react-aria';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof SecondaryTab> = {
  title: 'V4/core/components/SecondaryTab',
  component: SecondaryTab,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof SecondaryTab>;

export const Default: Story = {
  render: () => {
    const tabs = [
      { label: 'Tab1', value: 'tab1', content: () => 'Tab 1' },
      { label: 'Tab2', value: 'tab2', content: () => 'Tab 2' },
      { label: 'Tab3', value: 'tab3', content: () => 'Tab 3' },
    ];
    const [activeTab, setActiveTab] = React.useState<Key>('tab1');
    return (
      <div
        style={{
          gap: '1rem',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <SecondaryTab tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />
      </div>
    );
  },
};
