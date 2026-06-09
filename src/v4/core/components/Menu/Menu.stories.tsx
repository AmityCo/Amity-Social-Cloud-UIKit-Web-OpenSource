import type { Meta, StoryObj } from '@storybook/react';
import { Pencil } from '~/v4/icons/Pencil';
import { TrashIcon } from '~/v4/icons/Trash';
import { Menu } from './Menu';

const meta: Meta<typeof Menu> = {
  component: Menu,
  title: 'v4/core/components/Menu',
  tags: ['autodocs'],
  argTypes: {
    container: {
      control: 'select',
      options: ['popover', 'drawer'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Menu>;

export const Popover: Story = {
  name: 'Popover (icons by name)',
  args: { container: 'popover' },
  render: (args) => (
    <Menu {...args}>
      <Menu.Item icon="conversation-chat" label="Direct Chat" onPress={() => undefined} />
      <Menu.Item icon="group-chat" label="Group Chat" onPress={() => undefined} />
    </Menu>
  ),
};

export const Drawer: Story = {
  name: 'Drawer (no icons, destructive)',
  args: { container: 'drawer' },
  render: (args) => (
    <Menu {...args}>
      <Menu.Item label="Resend" onPress={() => undefined} />
      <Menu.Item label="Delete" destructive onPress={() => undefined} />
    </Menu>
  ),
};

export const IconAsComponent: Story = {
  name: 'Icon as React component',
  args: { container: 'popover' },
  render: (args) => (
    <Menu {...args}>
      <Menu.Item icon={Pencil} label="Edit event" onPress={() => undefined} />
      <Menu.Item icon={TrashIcon} label="Delete event" destructive onPress={() => undefined} />
    </Menu>
  ),
};

export const IconAsElement: Story = {
  name: 'Icon as React element',
  args: { container: 'popover' },
  render: (args) => (
    <Menu {...args}>
      <Menu.Item icon={<Pencil />} label="Edit" onPress={() => undefined} />
      <Menu.Item icon="trash" label="Delete" destructive onPress={() => undefined} />
    </Menu>
  ),
};

export const WithSkeletonItem: Story = {
  name: 'With skeleton row (chat popover)',
  args: { container: 'popover', variant: 'chat' },
  render: (args) => (
    <Menu {...args}>
      <Menu.Item icon={Pencil} label="Edit" onPress={() => undefined} />
      <Menu.Item.Skeleton />
      <Menu.Item icon="trash" label="Delete" destructive onPress={() => undefined} />
    </Menu>
  ),
};
