import React from 'react';
import PostHeader from './UIPostHeader';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/Post',
};

export const UIPostHeader = {
  render: () => {
    const [{ timeAgo, ...restArgs }] = useArgs();
    const normalizedTimeAgo = new Date(timeAgo);
    return <PostHeader timeAgo={normalizedTimeAgo} {...restArgs} />;
  },

  name: 'Header',

  args: {
    avatarFileUrl: '',
    postAuthorName: 'Web-Test',
    postTargetName: '',
    timeAgo: new Date(),
    isModerator: false,
    hidePostTarget: false,
    isBanned: false,
  },

  argTypes: {
    avatarFileUrl: { control: { type: 'text' } },
    postAuthorName: { control: { type: 'text' } },
    postTargetName: { control: { type: 'text' } },
    timeAgo: { control: { type: 'date' } },
    isModerator: { control: { type: 'boolean' } },
    hidePostTarget: { control: { type: 'boolean' } },
    isBanned: { control: { type: 'boolean' } },
  },
};
