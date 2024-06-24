import React from 'react';
import { UserAvatar } from './UserAvatar';

export default {
  title: 'v4-social/internal-components/UserAvatar',
};

export const UserAvatarStory = {
  render: () => {
    return <UserAvatar userId={'Web-Test'} />;
  },
};
