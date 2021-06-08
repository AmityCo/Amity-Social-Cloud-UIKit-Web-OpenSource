import React from 'react';
import useOneCategory from '~/mock/useOneCategory';
import CategoryCommunitiesList from '.';

export default {
  title: 'Sdk connected/Social/Community',
};

export const SdkCategoryCommunitiesList = ({ showEmpty, ...props }) => {
  const category = useOneCategory();
  if (!category.categoryId) return <p>Loading...</p>;
  return (
    <CategoryCommunitiesList {...props} categoryId={showEmpty ? undefined : category.categoryId} />
  );
};

SdkCategoryCommunitiesList.storyName = 'Category communities list';

SdkCategoryCommunitiesList.args = {
  showEmpty: false,
};

SdkCategoryCommunitiesList.argTypes = {
  showEmpty: { control: { type: 'boolean' } },
  onBack: { action: 'onBack()' },
};
