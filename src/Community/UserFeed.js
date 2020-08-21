import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';

import CommunityInformation from '../CommunityInformation';
import EmptyFeed from '../EmptyFeed';

import usePostsMock from '../hooks/usePostsMock';
import { userFeed } from '../mock';

import { Content, Feed, PostCompose, Post, UserFeedHeader } from './styles';

const UserFeed = ({ client }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock(userFeed);

  return (
    <>
      <Content>
        <Feed>
          <UserFeedHeader />
          <PostCompose onSubmit={addPost} />
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
        {/* <CommunityInformation /> */}
      </Content>
    </>
  );
};

export default withSDK(customizableComponent('UserFeed')(UserFeed));
