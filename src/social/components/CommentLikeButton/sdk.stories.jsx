import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOneComment from '~/mock/useOneComment';

import UiKitCommentLikeButton from '.';

export default {
  title: 'SDK Connected/Social/Comment',
};

// This is the SDK-integrated Comment Like Button.
export const SDKCommentLikeButton = ({ onLikeSuccess, onUnlikeSuccess }) => {
  const [comment, isLoading] = useOneComment();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return (
    <UiKitCommentLikeButton
      commentId={comment.commentId}
      onLikeSuccess={onLikeSuccess}
      onUnlikeSuccess={onUnlikeSuccess}
    />
  );
};

SDKCommentLikeButton.storyName = 'Like button';
