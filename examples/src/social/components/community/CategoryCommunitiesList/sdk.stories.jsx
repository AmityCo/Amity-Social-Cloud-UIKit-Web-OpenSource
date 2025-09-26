import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneCategory from '~/mock/useOneCategory';
import CategoryCommunitiesList from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'Sdk connected/Social/Community',
};

export const SdkCategoryCommunitiesList = {
  render: () => {
    const [{ showEmpty, ...props }] = useArgs();
    const category = useOneCategory();
    if (!category) {
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    }

    return (
      <CategoryCommunitiesList
        {...props}
        categoryId={showEmpty ? undefined : category.categoryId}
      />
    );
  },

  name: 'Category communities list',

  args: {
    showEmpty: false,
  },

  argTypes: {
    showEmpty: { control: { type: 'boolean' } },
    onBack: { action: 'onBack()' },
  },
};
