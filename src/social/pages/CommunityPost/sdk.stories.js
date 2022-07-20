import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { FeedType, PostTargetType } from '@amityco/js-sdk';

import useOnePost from '~/mock/useOnePost';

import CommunityPostPage from '.';

export default {
  title: 'SDK Connected/Social/Pages',
};

export const SDKCommunityPostPage = (props) => {
  const [post, isLoading] = useOnePost('community');

  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );

  return <CommunityPostPage communityId={post.targetId} postId={post.postId} {...props} />;
};

SDKCommunityPostPage.argTypes = {
  handleCopyPostPath: { action: 'handleCopyPostPath()' },
  handleCopyCommentPath: { action: 'handleCopyCommentPath()' },
};

SDKCommunityPostPage.storyName = 'Community Post Page';
