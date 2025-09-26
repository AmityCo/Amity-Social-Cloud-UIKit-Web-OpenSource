import { FloatingActionButton } from './FloatingActionButton';
import { Plus } from '~/icons';
import React, { Fragment } from 'react';
import { StoryObj, Meta } from '@storybook/react';

const meta: Meta<typeof FloatingActionButton> = {
  component: FloatingActionButton,
  title: 'V4/Core/Components/FloatingActionButton',
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

type Story = StoryObj<typeof FloatingActionButton>;

export const Default: Story = {
  name: 'Default',
  render: () => {
    return (
      <Fragment>
        <FloatingActionButton icon={Plus} />
      </Fragment>
    );
  },
};
