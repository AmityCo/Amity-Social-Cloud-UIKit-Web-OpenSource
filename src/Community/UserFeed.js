import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';

import CommunityInformation from '../CommunityInformation';
import EmptyFeed from '../EmptyFeed';

import usePostsMock from '../hooks/usePostsMock';

import { Content, Feed, PostCompose, Post, UserFeedHeader } from './styles';

const USER_TEST_POSTS = [
  {
    id: 1,
    author: { name: 'John' },
    text:
      'text\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\n',
    images: [
      {
        id: 1,
        url:
          'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      },
      {
        id: 2,
        url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
      },
      {
        id: 3,
        url:
          'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      },
      {
        id: 4,
        url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
      },
      {
        id: 5,
        url:
          'https://images.pexels.com/photos/461428/pexels-photo-461428.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260',
      },
      {
        id: 6,
        url: 'https://theievoice.com/wp-content/uploads/2020/02/1040.jpg',
      },
    ],
  },
  {
    id: 2,
    author: { name: 'John' },
    text: 'text text text',
  },
];

const UserFeed = ({ client }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock(USER_TEST_POSTS);

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
