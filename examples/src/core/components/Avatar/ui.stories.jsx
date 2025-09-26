import React from 'react';

import { backgroundImage as UserImage } from '~/icons/User';
import { backgroundImage as CommunityImage } from '~/icons/Community';
import { backgroundImage as CategoryImage } from '~/icons/Category';

import UiKitAvatar from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only',
};

const getBackgroundImage = (type) => {
  return {
    user: UserImage,
    community: CommunityImage,
    category: CategoryImage,
  }[type];
};

export const Avatar = {
  render: () => {
    const [{ backgroundImage, isClickable, onClick, ...props }] = useArgs();
    const handleClick = isClickable ? onClick : null;
    return (
      <div>
        <UiKitAvatar
          backgroundImage={getBackgroundImage(backgroundImage)}
          onClick={handleClick}
          {...props}
        />
      </div>
    );
  },

  argTypes: {
    avatar: { control: { type: 'text' } },
    size: { control: { type: 'select' }, options: ['small', 'big', 'tiny'] },
    className: { control: { type: 'text' } },
    backgroundImage: {
      control: { type: 'select' },
      options: ['', 'user', 'community', 'category'],
    },
    isClickable: { control: { type: 'boolean' } },
    onClick: { action: 'onClick()' },
  },

  args: {
    avatar: 'https://via.placeholder.com/600/771796',
    size: 'big',
    className: '',
    backgroundImage: '',
    isClickable: false,
  },
};
