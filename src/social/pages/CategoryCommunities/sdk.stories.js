import React from 'react';
import useOneCategory from '~/mock/useOneCategory';
import CategoryCommunitiesPage from '.';

export default {
  title: 'Sdk connected/Social/Community',
};

export const SdkCategoryCommunitiesPage = props => {
  const category = useOneCategory();
  if (!category.categoryId) return <p>Loading...</p>;
  return <CategoryCommunitiesPage categoryId={category.categoryId} {...props} />;
};

SdkCategoryCommunitiesPage.storyName = 'Category communities page';

SdkCategoryCommunitiesPage.argTypes = {
  onBack: { action: 'onBack()' },
};
