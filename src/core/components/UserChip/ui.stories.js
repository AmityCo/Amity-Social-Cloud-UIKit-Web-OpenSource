/* eslint-disable react/destructuring-assignment */

import React from 'react';

import StyledUserChip from './styles';

export default {
  title: 'Ui Only/User',
};

export const UiUserChip = args => {
  const props = { ...args };

  if (!props.removable) delete props.onRemove;

  return <StyledUserChip {...props} />;
};

UiUserChip.storyName = 'Chip';

UiUserChip.args = {
  displayName: 'Boaty Mc Boat',
  fileUrl: 'https://via.placeholder.com/150x150',
  removable: false,
};

UiUserChip.argTypes = {
  displayName: { control: { type: 'text' } },
  fileUrl: { control: { type: 'text' } },
  removable: { control: { type: 'boolean' } },
  onClick: { action: 'onClick()' },
  onRemove: { action: 'onRemove()' },
};
