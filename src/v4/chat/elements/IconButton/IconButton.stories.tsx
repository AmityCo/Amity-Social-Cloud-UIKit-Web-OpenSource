import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';

const meta: Meta<typeof IconButton> = {
  component: IconButton,
  title: 'v4/chat/elements/IconButton',
  tags: ['autodocs'],
  argTypes: {
    icon: {
      control: 'select',
      options: ['plus'],
    },
    variant: {
      control: 'select',
      options: ['filled', 'transparent'],
    },
    isDisabled: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof IconButton>;

export const Plus: Story = {
  name: 'Plus (filled)',
  args: {
    icon: 'plus',
    variant: 'filled',
    'aria-label': 'Create chat',
  },
};

export const PlusTransparent: Story = {
  name: 'Plus (transparent)',
  args: {
    icon: 'plus',
    variant: 'transparent',
    'aria-label': 'Add member',
  },
};
