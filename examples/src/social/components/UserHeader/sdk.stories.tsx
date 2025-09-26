import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import UiKitUserHeader from '.';

const meta: Meta<typeof UiKitUserHeader> = {
  component: UiKitUserHeader,
  title: 'SDK Connected/Social/User',
};

export default meta;
type Story = StoryObj<typeof UiKitUserHeader>;

export const SDKUserHeader: Story = {
  render: ({ userId, children, onClick, isBanned }) => {
    return (
      <UiKitUserHeader userId={userId} isBanned={isBanned} onClick={onClick}>
        {children}
      </UiKitUserHeader>
    );
  },

  name: 'Header',

  args: {
    userId: 'Web-Test',
    children: 'children slot',
    isBanned: false,
  },

  argTypes: {
    userId: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
    isBanned: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
  },
};
