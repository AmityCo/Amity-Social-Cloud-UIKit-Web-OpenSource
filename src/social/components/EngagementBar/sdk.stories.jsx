import React from 'react';
import { FormattedMessage } from 'react-intl';

import EngagementBar from '.';
import { useArgs } from '@storybook/client-api';
import useOnePostWithCommentsAndReactions from '~/mock/useOnePostWithCommentsAndReactions';

export default {
  title: 'SDK Connected/Social/Post',
};

export const SdkEngagementBar = {
  render: () => {
    const [props] = useArgs();
    const [post, isLoading] = useOnePostWithCommentsAndReactions();
    if (isLoading || !post)
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    return <EngagementBar postId={post.postId} {...props} />;
  },

  name: 'Engagement Bar',

  args: {
    readonly: false,
  },
};
