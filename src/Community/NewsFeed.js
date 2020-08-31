import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';

import EmptyFeed from '../EmptyFeed';

import { getMyCommunities, testNewsFeed, usePostsMock } from '../mock';

import { Content, Feed, PostCompose, Post } from './styles';

const NewsFeed = ({ client, onPostAuthorClick }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock();

  const myCommunities = getMyCommunities();

  return (
    <>
      <Content>
        <Feed>
          <PostCompose communities={myCommunities} onSubmit={addPost} />
          {posts.length === 0 && <EmptyFeed />}
          {posts.map(post => (
            <Post
              onPostAuthorClick={onPostAuthorClick}
              key={post.postId}
              post={post}
              onEdit={updatedPost => editPost(updatedPost)}
              onDelete={() => removePost(post.postId)}
            />
          ))}
        </Feed>
      </Content>
    </>
  );
};

export default withSDK(customizableComponent('NewsFeed')(NewsFeed));
