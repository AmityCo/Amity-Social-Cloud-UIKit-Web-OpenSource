import React, { useState } from 'react';
import { RadioGroup } from '.';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof RadioGroup> = {
  component: RadioGroup,
  title: 'V4/Core/Components/RadioGroup',
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

type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    const [gender, setGender] = useState('male');

    return (
      <RadioGroup
        label="Gender"
        value={gender}
        onChange={setGender}
        radios={[
          { label: 'Male', value: 'male' },
          { label: 'Female', value: 'female' },
        ]}
      />
    );
  },
};
