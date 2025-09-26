import React, { useState } from 'react';
import { Radio } from '.';
import { StoryObj, Meta } from '@storybook/react';
import { RadioGroup } from 'react-aria-components';

const meta: Meta<typeof Radio> = {
  component: Radio,
  title: 'V4/Core/Components/Radio',
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

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    const [gender, setGender] = useState('male');

    return (
      <RadioGroup
        value={gender}
        onChange={setGender}
        orientation="horizontal"
        style={{ display: 'flex', gap: '1rem' }}
      >
        <Radio value="male" />
        <Radio value="male" isDisabled />
        <Radio value="female" />
        <Radio value="female" isDisabled />
      </RadioGroup>
    );
  },
};
