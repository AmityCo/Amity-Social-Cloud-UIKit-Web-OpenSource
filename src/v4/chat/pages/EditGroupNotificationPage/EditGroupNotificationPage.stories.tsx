import type { Meta, StoryObj } from '@storybook/react';
import { EditGroupNotificationPage } from '~/v4/chat/pages/EditGroupNotificationPage';

const meta: Meta<typeof EditGroupNotificationPage> = {
  title: 'V4/Chat/Pages/EditGroupNotificationPage',
  component: EditGroupNotificationPage,
  args: { channelId: 'demo' },
};

export default meta;
type Story = StoryObj<typeof EditGroupNotificationPage>;

export const Default: Story = {};
