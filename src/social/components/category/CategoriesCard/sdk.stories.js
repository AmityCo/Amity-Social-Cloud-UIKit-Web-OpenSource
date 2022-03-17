import React from 'react';

import UiKitCategoryList from '.';

export default {
  title: 'SDK Connected/Social/Category',
};

export const SDKCategoryList = (props) => <UiKitCategoryList {...props} />;

SDKCategoryList.storyName = 'Categories Card';

SDKCategoryList.argTypes = {
  onClick: { action: 'onClick()' },
};
