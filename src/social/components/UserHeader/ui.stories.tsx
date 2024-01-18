import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';

import UIUserHeader from './UIUserHeader';

const meta: Meta<typeof UIUserHeader> = {
  component: UIUserHeader,
  title: 'Ui Only/Social/User',
};

export default meta;
type Story = StoryObj<typeof UIUserHeader>;

export const UiUserHeader: Story = {
  render: (args) => {
    return <UIUserHeader {...args} />;
  },
  name: 'Header',

  args: {
    userId: 'Web-Test',
    displayName: 'Web-Test',
    avatarFileUrl: 'https://via.placeholder.com/32/dfdfdf?text=foobar',
    children: <span>children slot</span>,
    isBanned: false,
  },

  argTypes: {
    userId: { control: { type: 'text' } },
    displayName: { control: { type: 'text' } },
    avatarFileUrl: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
    isBanned: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
  },
};
