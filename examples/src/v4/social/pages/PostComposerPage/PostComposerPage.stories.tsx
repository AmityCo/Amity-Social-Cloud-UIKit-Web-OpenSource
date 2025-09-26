import React from 'react';
import { Mode, PostComposerPage } from './PostComposerPage';

export default {
  title: 'v4-social/pages/PostComposerPage',
};

export const PostComposerPageStories = {
  render: () => {
    return (
      <PostComposerPage
        targetId={null}
        targetType="user"
        mode={Mode.CREATE}
        community={undefined}
      />
    );
  },
};
