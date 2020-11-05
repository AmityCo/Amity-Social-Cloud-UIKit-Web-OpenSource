import React from 'react';

import Skeleton, { SKELETON_SHAPES } from '.';

export default {
  title: 'Ui Only',
};

export function UiSkeleton(props) {
  return (
    <div style={{ width: '100px', height: '100px' }}>
      <Skeleton {...props} />
    </div>
  );
}

UiSkeleton.storyName = 'Skeleton';

UiSkeleton.args = Skeleton.defaultProps;

UiSkeleton.argTypes = {
  shape: { control: { type: 'select', options: Object.values(SKELETON_SHAPES) } },
  borderRadius: { control: { type: 'number' } },
  primaryColor: { control: { type: 'color' } },
  secondaryColor: { control: { type: 'color' } },
};
