import type { Meta, StoryObj } from '@storybook/react';
import { EditGroupProfilePage } from '~/v4/chat/pages/EditGroupProfilePage';

const meta: Meta<typeof EditGroupProfilePage> = {
  title: 'V4/Chat/Pages/EditGroupProfilePage',
  component: EditGroupProfilePage,
  args: { channelId: 'demo' },
};

export default meta;
type Story = StoryObj<typeof EditGroupProfilePage>;

export const Default: Story = {};
