import React from 'react';
import useOneCategory from '~/mock/useOneCategory';
import CategoryCommunitiesList from '.';

export default {
  title: 'Sdk connected/Social/Community',
};

export const SdkCategoryCommunitiesList = props => {
  const category = useOneCategory();
  if (!category.categoryId) return <p>Loading...</p>;
  return <CategoryCommunitiesList {...props} categoryId={category.categoryId} />;
};

SdkCategoryCommunitiesList.storyName = 'Category communities list';

SdkCategoryCommunitiesList.argTypes = {
  onBack: { action: 'onBack()' },
};
