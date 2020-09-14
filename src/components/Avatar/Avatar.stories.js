import React from 'react';
import Avatar from '.';

export default {
  title: 'Avatar',
  component: Avatar,
  argTypes: {
    avatar: { control: { type: 'text' } },
    size: { control: { type: 'select', options: ['small', 'big', 'tiny'] } },
    className: { control: { type: 'text' } },
  },
};

const Template = args => <Avatar {...args} />;

export const avatar = Template.bind({});
avatar.args = {
  avatar: 'https://via.placeholder.com/600/771796',
  size: 'big',
  className: '',
};
