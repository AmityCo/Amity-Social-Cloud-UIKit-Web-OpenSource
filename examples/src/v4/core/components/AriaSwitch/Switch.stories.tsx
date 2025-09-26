import React, { useState } from 'react';
import { Switch } from '.';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof Switch> = {
  component: Switch,
  title: 'V4/Core/Components/Switch',
  decorators: [
    (Story) => (
      <div
        style={{
          gap: '1rem',
          padding: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Story />
      </div>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    const [isSelected, setSelected] = useState(true);

    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Switch isSelected={!isSelected} onChange={setSelected} />
        <Switch isSelected={isSelected} onChange={setSelected} />
        <Switch isSelected={!isSelected} isDisabled onChange={setSelected} />
        <Switch isSelected={isSelected} isDisabled onChange={setSelected} />
      </div>
    );
  },
};
