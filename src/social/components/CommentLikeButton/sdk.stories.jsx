import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneComment from '~/mock/useOneComment';

import UiKitCommentLikeButton from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Comment',
};

export const SDKCommentLikeButton = {
  render: () => {
    const [{ onLikeSuccess, onUnlikeSuccess }] = useArgs();
    const [comment, isLoading] = useOneComment();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );

    if (!comment && isLoading === false) return <>No comment found</>;

    return (
      <UiKitCommentLikeButton
        commentId={comment.commentId}
        onLikeSuccess={onLikeSuccess}
        onUnlikeSuccess={onUnlikeSuccess}
      />
    );
  },

  name: 'Like button',
};
