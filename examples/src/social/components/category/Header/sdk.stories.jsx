import React from 'react';

import useOneCategory from '~/mock/useOneCategory';
import UiKitCategoryHeader from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Category',
};

export const SDKCategoryHeader = {
  render: () => {
    const [{ categoryIdOverride, children, onClick }] = useArgs();
    const category = useOneCategory();

    if (category == null) return null;

    let targetCategoryId = category.categoryId;
    if (categoryIdOverride) {
      targetCategoryId = categoryIdOverride;
    }

    return (
      <UiKitCategoryHeader categoryId={targetCategoryId} onClick={onClick}>
        {children}
      </UiKitCategoryHeader>
    );
  },

  name: 'Header',

  args: {
    categoryIdOverride: '',
    children: 'children slot',
  },

  argTypes: {
    categoryId: { control: { type: 'text' } },
    children: { control: { type: 'text' } },
    onClick: { action: 'onClick()' },
  },
};
