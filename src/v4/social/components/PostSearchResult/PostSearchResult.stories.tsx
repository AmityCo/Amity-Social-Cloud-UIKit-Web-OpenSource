import React from 'react';

import { PostSearchResult } from './PostSearchResult';

export default {
  title: 'v4/social/components/PostSearchResult',
};

export const PostSearchResultStory = {
  render: () => {
    return (
      <PostSearchResult
        keyword="example"
        isLoading={false}
        onLoadMore={() => {}}
        postCollection={[]}
      />
    );
  },

  name: 'PostSearchResult',
};
