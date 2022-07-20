import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOnePost from '~/mock/useOnePost';
import useOneComment from '~/mock/useOneComment';

import UserPostPage from '.';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKUserPostPage = (props) => {
  const [post, postIsLoading] = useOnePost();
  const [comment, commentIsLoading] = useOneComment();

  if (postIsLoading || commentIsLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );

  return (
    <UserPostPage
      userId={post.postedUserId}
      postId={post.postId}
      commentId={comment.commentId}
      {...props}
    />
  );
};

SDKUserPostPage.argTypes = {
  handleCopyPostPath: { action: 'handleCopyPostPath()' },
  handleCopyCommentPath: { action: 'handleCopyCommentPath()' },
};

SDKUserPostPage.storyName = 'User Post Page';
