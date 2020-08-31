import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';

import CommunityInformation from '../CommunityInformation';
import EmptyFeed from '../EmptyFeed';

import { testUser, userFeed, usePostsMock } from '../mock';

import { Content, Feed, PostCompose, Post, UserFeedHeader } from './styles';

const UserFeed = ({ client }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock(testUser.id);

  return (
    <>
      <Content>
        <Feed>
          <UserFeedHeader />
          <PostCompose onSubmit={addPost} />
          {posts.length === 0 && <EmptyFeed />}
          {posts.map(post => (
            <Post
              key={post.postId}
              post={post}
              onEdit={updatedPost => editPost(updatedPost)}
              onDelete={() => removePost(post.postId)}
            />
          ))}
        </Feed>
        {/* <CommunityInformation /> */}
      </Content>
    </>
  );
};

export default withSDK(customizableComponent('UserFeed')(UserFeed));
