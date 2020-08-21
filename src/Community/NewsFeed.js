import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';

import EmptyFeed from '../EmptyFeed';

import usePostsMock from '../hooks/usePostsMock';

import { myCommunities, testNewsFeed } from '../mock';

import { Content, Feed, PostCompose, Post } from './styles';

const NewsFeed = ({ client }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock(testNewsFeed);

  return (
    <>
      <Content>
        <Feed>
          <PostCompose inGlobalFeed communities={myCommunities.slice(0, 3)} onSubmit={addPost} />
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
