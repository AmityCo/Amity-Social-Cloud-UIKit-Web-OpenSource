import React from 'react';
import { PullToRefresh } from '.';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof PullToRefresh> = {
  title: 'V4/core/components/PullToRefresh',
  component: PullToRefresh,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof PullToRefresh>;

export const Default: Story = {
  render: () => {
    return (
      <PullToRefresh onTouchEndCallback={() => alert('Refreshed')}>
        <h1 style={{ textAlign: 'center' }}>Pull Me</h1>
      </PullToRefresh>
    );
  },
};
