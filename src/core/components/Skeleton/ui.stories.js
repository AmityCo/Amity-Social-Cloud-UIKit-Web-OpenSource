import React from 'react';

import Skeleton from '.';

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
  circle: { control: { type: 'boolean' } },
  borderRadius: { control: { type: 'number' } },
  primaryColor: { control: { type: 'color' } },
  secondaryColor: { control: { type: 'color' } },
};
