import type { Meta, StoryObj } from '@storybook/react';
import { SettingMenu } from '~/v4/chat/elements/SettingMenu';
import { PencilFilled } from '~/v4/icons/PencilFilled';

const meta: Meta<typeof SettingMenu> = {
  title: 'V4/Chat/Elements/SettingMenu',
  component: SettingMenu,
  args: {
    icon: PencilFilled,
    label: 'Group profile',
    onPress: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof SettingMenu>;

export const Default: Story = {};

export const WithTrailingText: Story = {
  args: { label: 'Group notifications', trailingText: 'Default' },
};

export const Destructive: Story = {
  args: { label: 'Leave group', destructive: true },
};
