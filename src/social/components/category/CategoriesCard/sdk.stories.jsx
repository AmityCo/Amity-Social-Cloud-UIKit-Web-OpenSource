import React from 'react';

import UiKitCategoryList from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Category',
};

export const SDKCategoryList = {
  render: () => {
    const [props] = useArgs();
    return <UiKitCategoryList {...props} />;
  },
  name: 'Categories Card',

  argTypes: {
    onClick: { action: 'onClick()' },
  },
};
