import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';

import CommunityInformation from '../CommunityInformation';
import EmptyFeed from '../EmptyFeed';

import usePostsMock from '../hooks/usePostsMock';

import { communities } from '../mock';

import { Content, Feed, PostCompose, Post, CommunityHeader } from './styles';

const COMMUNITY_TEST_POSTS = [];

const CommunityFeed = ({ client, communityId }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock(COMMUNITY_TEST_POSTS);

  const community = communities.find(community => community.communityId === communityId);

  return (
    <>
      <Content>
        <Feed>
          <CommunityHeader />
          <PostCompose community={community} onSubmit={addPost} />
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
        <CommunityInformation community={community} />
      </Content>
    </>
  );
};

export default withSDK(customizableComponent('CommunityFeed')(CommunityFeed));
