import React from 'react';

import useOneCategory from '~/mock/useOneCategory';
import UiKitCategoryHeader from '.';

export default {
  title: 'SDK Connected/Social/Category',
};

export const SDKCategoryHeader = ({ categoryIdOverride, children, onClick }) => {
  const { categoryId } = useOneCategory();

  let targetCategoryId = categoryId;
  if (categoryIdOverride) {
    targetCategoryId = categoryIdOverride;
  }

  return (
    <UiKitCategoryHeader categoryId={targetCategoryId} onClick={onClick}>
      {children}
    </UiKitCategoryHeader>
  );
};

SDKCategoryHeader.storyName = 'Header';

SDKCategoryHeader.args = {
  categoryIdOverride: '',
  children: 'children slot',
};

SDKCategoryHeader.argTypes = {
  categoryId: { control: { type: 'text' } },
  children: { control: { type: 'text' } },
  onClick: { action: 'onClick()' },
};
