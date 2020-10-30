import React from 'react';

import { backgroundImage as UserImage } from '~/icons/User';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import { backgroundImage as CategoryImage } from '~/icons/Category';

import UiKitAvatar from '.';

export default {
  title: 'Ui Only',
};

const getBackgroundImage = type => {
  return {
    user: UserImage,
    community: CommunityImage,
    category: CategoryImage,
  }[type];
};

export const Avatar = ({ backgroundImage, ...props }) => {
  return (
    <div>
      before <UiKitAvatar {...props} backgroundImage={getBackgroundImage(backgroundImage)} /> after
    </div>
  );
};

Avatar.argTypes = {
  avatar: { control: { type: 'text' } },
  size: { control: { type: 'select', options: ['small', 'big', 'tiny'] } },
  className: { control: { type: 'text' } },
  backgroundImage: { control: { type: 'select', options: ['', 'user', 'community', 'category'] } },
};

Avatar.args = {
  avatar: 'https://via.placeholder.com/600/771796',
  size: 'big',
  className: '',
  backgroundImage: '',
};
