import type { Meta, StoryObj } from '@storybook/react';
import { GroupSettingPage } from '~/v4/chat/pages/GroupSettingPage';

const meta: Meta<typeof GroupSettingPage> = {
  title: 'V4/Chat/Pages/GroupSettingPage',
  component: GroupSettingPage,
  args: { channelId: 'demo' },
};

export default meta;
type Story = StoryObj<typeof GroupSettingPage>;

export const Default: Story = {};
