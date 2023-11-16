import React from 'react';
import EmptyState from '.';
import EmptyFeedIcon from '~/icons/EmptyFeed';
import UserIcon from '~/icons/User';
import BalloonIcon from '~/icons/Balloon';

export default {
  title: 'Ui Only/Empty State',
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

export const emptyState = ({ iconType, ...props }) => {
  const selectedIcon = Icons[iconType];
  return <EmptyState icon={selectedIcon} {...props} />;
};

emptyState.argTypes = {
  iconType: {
    control: { type: 'select' },
    options: Object.values(IconTypes),
  },
  title: { control: { type: 'text' } },
  description: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
};

emptyState.args = {
  iconType: IconTypes.EmptyFeed,
  title: "It's empty here...",
  description: 'No community found in this category',
  children: '',
};
