import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';

const meta: Meta<typeof Avatar.User> = {
  component: Avatar.User,
  title: 'v4/chat/elements/Avatar',
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md'] },
    isModerator: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Avatar.User>;

const baseUser = {
  userId: 'sample-user-id',
  displayName: 'Byron Robertson',
} as Amity.User;

export const WithImage: Story = {
  name: 'User (with image)',
  args: {
    user: {
      ...baseUser,
      avatar: { fileUrl: 'https://i.pravatar.cc/120?img=12' },
    } as Amity.User,
    size: 'md',
  },
};

export const Placeholder: Story = {
  name: 'User (first-char placeholder)',
  args: {
    user: baseUser,
    size: 'md',
  },
};

export const ModeratorMd: Story = {
  name: 'User + moderator badge (md)',
  args: {
    user: baseUser,
    size: 'md',
    isModerator: true,
  },
};

export const ModeratorSm: Story = {
  name: 'User + moderator badge (sm)',
  args: {
    user: baseUser,
    size: 'sm',
    isModerator: true,
  },
};
