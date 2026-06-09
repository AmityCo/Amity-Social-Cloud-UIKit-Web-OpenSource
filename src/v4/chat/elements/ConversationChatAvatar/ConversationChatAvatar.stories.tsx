import type { Meta, StoryObj } from '@storybook/react';
import { ConversationChatAvatar } from './ConversationChatAvatar';

const meta: Meta<typeof ConversationChatAvatar> = {
  component: ConversationChatAvatar,
  title: 'v4/chat/elements/ConversationChatAvatar',
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '2.5rem', height: '2.5rem' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    isDeleted: {
      control: 'boolean',
    },
  },
};

export default meta;

type Story = StoryObj<typeof ConversationChatAvatar>;

export const Default: Story = {
  name: 'User',
  args: {
    user: { userId: 'Web-Test', displayName: 'Web Test' } as Amity.User,
  },
};

export const Deleted: Story = {
  name: 'Deleted user',
  args: {
    isDeleted: true,
  },
};
