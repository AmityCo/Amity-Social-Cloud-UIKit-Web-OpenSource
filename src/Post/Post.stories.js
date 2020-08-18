import React, { useEffect } from 'react';
import EkoClient, { ChannelRepository, _changeSDKDefaultConfig } from 'eko-sdk';

import Post from './index';
import UiKitProvider from '../UiKitProvider';

export default {
  title: 'Post',
};

const post = {
  author: { name: 'John' },
  text: 'text text text',
};

export const JustPost = () => <Post post={post} />;
