import { CheckboxGroup } from '.';
import React, { useState } from 'react';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof CheckboxGroup> = {
  component: CheckboxGroup,
  title: 'V4/Core/Components/CheckboxGroup',
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

type Story = StoryObj<typeof CheckboxGroup>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    const [value, setValue] = useState(['typescript', 'javascript']);

    return (
      <CheckboxGroup
        value={value}
        onChange={setValue}
        label="Programming Languages"
        checkboxes={[
          { value: 'go', label: 'Go' },
          { value: 'c#', label: 'C#' },
          { value: 'java', label: 'Java' },
          { value: 'python', label: 'Python' },
          { value: 'typescript', label: 'TavaScript' },
          { value: 'javascript', label: 'JavaScript' },
        ]}
      />
    );
  },
};
