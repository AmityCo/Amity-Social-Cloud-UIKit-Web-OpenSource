import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCategory from '~/mock/useOneCategory';
import CategoryCommunitiesPage from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Sdk connected/Social/Community',
};

export const SdkCategoryCommunitiesPage = {
  render: () => {
    const [props] = useArgs();
    const category = useOneCategory();
    if (!category?.categoryId)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    return <CategoryCommunitiesPage categoryId={category.categoryId} {...props} />;
  },

  name: 'Category communities page',

  argTypes: {
    onBack: { action: 'onBack()' },
  },
};
