import React from 'react';
import { Checkbox } from '.';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof Checkbox> = {
  component: Checkbox,
  title: 'V4/Core/Components/Checkbox',
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

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    return (
      <div style={{ display: 'flex', gap: '1rem' }}>
        <Checkbox isSelected={true} />
        <Checkbox isSelected={true} isDisabled />
        <Checkbox isSelected={false} />
        <Checkbox isSelected={false} isDisabled />
      </div>
    );
  },
};
