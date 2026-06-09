import React from 'react';
import { UserAvatar } from './UserAvatar';

export default {
  title: 'v4/social/elements/UserAvatar',
};

export const UserAvatarStory = {
  render: () => {
    return <UserAvatar userId={'Web-Test'} />;
  },
};
