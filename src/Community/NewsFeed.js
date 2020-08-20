import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';

import EmptyFeed from '../EmptyFeed';

import usePostsMock from '../hooks/usePostsMock';

import { communities } from '../mock';

import { Content, Feed, PostCompose, Post, CommunityHeader } from './styles';

const NEWS_TEST_POSTS = [
  {
    id: 2,
    author: { communityId: '5', name: 'Harry Potter Fans', isPrivate: true },
    text: 'News feed text',
  },
];

const NewsFeed = ({ client }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock(NEWS_TEST_POSTS);

  return (
    <>
      <Content>
        <Feed>
          <PostCompose inGlobalFeed communities={communities.slice(0, 3)} onSubmit={addPost} />
          {posts.length === 0 && <EmptyFeed />}
          {posts.map(post => (
            <Post
              key={post.id}
              post={post}
              onEdit={updatedPost => editPost(updatedPost)}
              onDelete={() => removePost(post.id)}
            />
          ))}
        </Feed>
      </Content>
    </>
  );
};

export default withSDK(customizableComponent('NewsFeed')(NewsFeed));
