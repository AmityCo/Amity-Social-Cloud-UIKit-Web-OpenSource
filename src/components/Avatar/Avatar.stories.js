import React from 'react';
import UiKitAvatar from '.';

export default {
  title: 'Components',
  parameters: { layout: 'centered' },
};

export const Avatar = props => {
  return (
    <div>
      before <UiKitAvatar {...props} /> after
    </div>
  );
};

Avatar.argTypes = {
  avatar: { control: { type: 'text' } },
  size: { control: { type: 'select', options: ['small', 'big', 'tiny'] } },
  className: { control: { type: 'text' } },
};

Avatar.args = {
  avatar: 'https://via.placeholder.com/600/771796',
  size: 'big',
  className: '',
};
