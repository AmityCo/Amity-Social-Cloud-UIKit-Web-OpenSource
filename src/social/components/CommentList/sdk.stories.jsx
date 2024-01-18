import React from 'react';
import { FormattedMessage } from 'react-intl';

import UiKitCommentList from '.';
import useOnePostWithComment from '~/mock/useOnePostWithComments';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Comment List',
};

export const SDKCommentList = {
  render: () => {
    const [{ lastAmount }] = useArgs();
    const [post, isLoading] = useOnePostWithComment();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );

    if (post == null || post.comments.length === 0) return <></>;

    return <UiKitCommentList referenceId={post.postId} referenceType={'content'} />;
  },

  name: 'Comment List',

  args: {
    lastAmount: 5,
  },

  argTypes: {
    lastAmount: { control: { type: 'number', min: 0 } },
  },
};
