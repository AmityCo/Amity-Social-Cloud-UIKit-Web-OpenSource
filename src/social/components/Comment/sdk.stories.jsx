import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneComment from '~/mock/useOneComment';

import UiKitComment from '.';
import { useArgs } from '@storybook/client-api';

export default {
  title: 'SDK Connected/Social/Comment',
};

export const SDKComment = {
  render: () => {
    const [{ readonly, isReplyComment }] = useArgs();
    const [comment, isLoading] = useOneComment();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );

    if (!comment && isLoading === false) return <>No comment found</>;

    return (
      <UiKitComment
        commentId={comment.commentId}
        readonly={readonly}
        isReplyComment={isReplyComment}
      />
    );
  },

  name: 'Single Comment',

  args: {
    readonly: false,
    isReplyComment: false,
  },

  argTypes: {
    readonly: { control: { type: 'boolean' } },
    isReplyComment: { control: { type: 'boolean' } },
  },
};

export const SDKCommentWithReplies = {
  render: () => {
    const [comment, isLoading] = useOneComment();
    if (isLoading)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    if (!comment && isLoading === false) return <>No comment found</>;
    return <UiKitComment commentId={comment.commentId} />;
  },

  name: 'Comment with replies',
};
