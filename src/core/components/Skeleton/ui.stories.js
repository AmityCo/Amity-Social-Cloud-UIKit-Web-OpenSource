import React from 'react';
import styled from 'styled-components';

import Skeleton from '.';

export default {
  title: 'Ui Only',
};

const UiSkeletonContainer = styled.div`
  width: 100px;
  height: 100px;
`;

export const UiSkeleton = props => {
  return (
    <UiSkeletonContainer>
      <Skeleton {...props} />
    </UiSkeletonContainer>
  );
};

UiSkeleton.storyName = 'Skeleton';

UiSkeleton.args = Skeleton.defaultProps;

UiSkeleton.argTypes = {
  circle: { control: { type: 'boolean' } },
  borderRadius: { control: { type: 'number' } },
  primaryColor: { control: { type: 'color' } },
  secondaryColor: { control: { type: 'color' } },
};
