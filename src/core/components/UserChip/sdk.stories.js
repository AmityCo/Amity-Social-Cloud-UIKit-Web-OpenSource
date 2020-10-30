/* eslint-disable react/destructuring-assignment */

import React from 'react';

import UiKitUserChip from '.';

export default {
  title: 'SDK Connected/User',
};

export const Chip = args => {
  const props = { ...args };

  if (!props.removable) delete props.onRemove;

  return <UiKitUserChip {...props} />;
};

Chip.storyName = 'Chip';

Chip.args = {
  userId: 'upstra-console',
  removable: false,
};

Chip.argTypes = {
  userId: { control: { type: 'text' } },
  removable: { control: { type: 'boolean' } },
  onClick: { action: 'onClick()' },
  onRemove: { action: 'onRemove()' },
};
