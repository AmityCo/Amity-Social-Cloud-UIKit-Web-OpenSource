import type { Meta, StoryObj } from '@storybook/react';
import { AvatarPicker } from '~/v4/chat/elements/AvatarPicker';
import { CHAT_PAGE_IDS } from '~/v4/chat/constants/chatPageIds';

const meta: Meta<typeof AvatarPicker> = {
  title: 'V4/Chat/Elements/AvatarPicker',
  component: AvatarPicker,
  args: {
    pageId: CHAT_PAGE_IDS.EDIT_GROUP_PROFILE_PAGE,
    value: null,
    onChange: () => {},
  },
};

export default meta;
type Story = StoryObj<typeof AvatarPicker>;

export const Empty: Story = {};

export const Filled: Story = {
  args: {
    value: {
      fileId: 'demo',
      fileUrl: 'https://placekitten.com/200/200',
      type: 'image',
    } as Amity.File<'image'>,
  },
};
