import React from 'react';
import EmptyState from '.';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import UserIcon from '~/icons/User';
import BalloonIcon from '~/icons/Balloon';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only',
};

const IconTypes = {
  EmptyFeed: 'Empty feed icon',
  User: 'User icon',
  Balloon: 'Balloon icon',
};

const Icons = {
  [IconTypes.EmptyFeed]: <EmptyFeedIcon width="48" height="48" />,
  [IconTypes.User]: <UserIcon width="48" height="48" />,
  [IconTypes.Balloon]: <BalloonIcon width="48" height="48" />,
};

export const emptyState = {
  render: () => {
    const [{ iconType, ...props }] = useArgs();
    const selectedIcon = Icons[iconType];
    return <EmptyState icon={selectedIcon} {...props} />;
  },

  argTypes: {
    iconType: {
      control: { type: 'select' },
      options: Object.values(IconTypes),
    },
    title: { control: { type: 'text' } },
    description: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
  },

  args: {
    iconType: IconTypes.EmptyFeed,
    title: "It's empty here...",
    description: 'No community found in this category',
    children: '',
  },
};
