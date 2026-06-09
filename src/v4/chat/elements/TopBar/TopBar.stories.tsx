import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '~/v4/core/components/AriaButton/Button';
import { Typography } from '~/v4/core/components/Typography/Typography';
import { TopBar } from '~/v4/chat/elements/TopBar';

const meta: Meta<typeof TopBar> = {
  title: 'V4/Chat/Elements/TopBar',
  component: TopBar,
  args: {
    title: 'Group profile',
    onLeading: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof TopBar>;

export const Back: Story = {};

export const Close: Story = {
  args: { leadingType: 'close', title: 'New conversation' },
};

export const WithTrailing: Story = {
  args: {
    leadingType: 'close',
    title: 'New group',
    trailing: (
      <Button type="submit" variant="text" color="primary">
        <Typography.Body>Create</Typography.Body>
      </Button>
    ),
  },
};
