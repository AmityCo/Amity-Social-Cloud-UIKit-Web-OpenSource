import React from 'react';

import Post from '.';

export default {
  title: 'Post',
};

const post = {
  author: { name: 'John' },
  text: 'text text text',
};

export const JustPost = () => <Post post={post} />;
