import React from 'react';

import UserInfo from './UIUserInfo';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only/Social/User',
};

export const UiUserInfo = {
  render: () => {
    const [props] = useArgs();
    return <UserInfo {...props} />;
  },
  name: 'Information',

  args: {
    userId: 'Web-Test',
    avatarFileId: '',
    displayName: '',
    description: '',
    isMyProfile: false,
    isFollowNone: true,
    isFollowPending: false,
    isPrivateNetwork: true,
  },

  argTypes: {
    userId: { control: { type: 'text' } },
    avatarFileId: { control: { type: 'text' } },
    displayName: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    isMyProfile: { control: { type: 'boolean' } },
    isFollowNone: { control: { type: 'boolean' } },
    isFollowPending: { control: { type: 'boolean' } },
    isPrivateNetwork: { control: { type: 'boolean' } },
  },
};
