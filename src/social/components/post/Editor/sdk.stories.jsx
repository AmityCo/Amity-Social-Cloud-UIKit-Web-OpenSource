import React from 'react';
import { FormattedMessage } from 'react-intl';

import getOnePost from '~/mock/useOnePost';

import UiKitPostEditor from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SDKEditPost = {
  render: () => {
    const [{ onSave }] = useArgs();
    const [post, isLoading] = getOnePost();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    return <UiKitPostEditor postId={post.postId} onSave={onSave} />;
  },

  name: 'Editor',

  argTypes: {
    onSave: { action: 'onSave()' },
  },
};
