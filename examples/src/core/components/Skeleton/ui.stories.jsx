import React from 'react';
import styled from 'styled-components';

import Skeleton from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Ui Only',
};

const UiSkeletonContainer = styled.div`
  width: 100px;
  height: 100px;
`;

export const UiSkeleton = {
  render: () => {
    const [props] = useArgs();
    return (
      <UiSkeletonContainer>
        <Skeleton {...props} />
      </UiSkeletonContainer>
    );
  },

  name: 'Skeleton',
  args: Skeleton.defaultProps,

  argTypes: {
    circle: { control: { type: 'boolean' } },
    borderRadius: { control: { type: 'number' } },
    primaryColor: { control: { type: 'color' } },
    secondaryColor: { control: { type: 'color' } },
  },
};
