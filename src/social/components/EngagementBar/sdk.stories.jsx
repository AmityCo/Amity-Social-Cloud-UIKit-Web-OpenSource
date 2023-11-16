import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOnePost from '~/mock/useOnePost';
import EngagementBar from '.';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SdkEngagementBar = (props) => {
  const [post, isLoading] = useOnePost();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  return <EngagementBar postId={post.postId} {...props} />;
};

SdkEngagementBar.storyName = 'Engagement Bar';

SdkEngagementBar.args = {
  readonly: false,
};
