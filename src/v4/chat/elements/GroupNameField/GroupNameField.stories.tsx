import type { Meta, StoryObj } from '@storybook/react';
import { GroupNameField } from '~/v4/chat/elements/GroupNameField';

const meta: Meta<typeof GroupNameField> = {
  title: 'V4/Chat/Elements/GroupNameField',
  component: GroupNameField,
  args: {
    value: '',
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof GroupNameField>;

export const Optional: Story = {
  args: {
    optional: true,
    placeholder: 'Name your group',
  },
};

export const Required: Story = {
  args: {
    required: true,
    placeholder: 'Please enter a group name',
  },
};
