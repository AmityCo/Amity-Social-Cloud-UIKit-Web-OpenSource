import React from 'react';
import { FormattedMessage } from 'react-intl';

import useOnePost from '~/mock/useOnePost';
import UiKitCommentList from '.';

export default {
  title: 'SDK Connected/Social/Comment List',
};

export const SDKCommentList = ({ lastAmount }) => {
  const [post, isLoading] = useOnePost();
  if (isLoading)
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );

  return <UiKitCommentList referenceId={post.postId} last={lastAmount} />;
};

SDKCommentList.storyName = 'Comment List';

SDKCommentList.args = {
  lastAmount: 5,
};

SDKCommentList.argTypes = {
  lastAmount: { control: { type: 'number', min: 0 } },
};
