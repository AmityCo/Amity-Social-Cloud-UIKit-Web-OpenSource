import React from 'react';
import UiKitAvatar from '.';

export default {
  title: 'Components/Avatar',
  parameters: { layout: 'centered' },
};

export const SimpleAvatar = props => {
  return (
    <div>
      before <UiKitAvatar {...props} /> after
    </div>
  );
};

SimpleAvatar.argTypes = {
  avatar: { control: { type: 'text' } },
  size: { control: { type: 'select', options: ['small', 'big', 'tiny'] } },
  className: { control: { type: 'text' } },
};

SimpleAvatar.args = {
  avatar: 'https://via.placeholder.com/600/771796',
  size: 'big',
  className: '',
};
