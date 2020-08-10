import React, { useState, useEffect } from 'react';
import { ChannelRepository, FeedRepository, PostRepository, EkoPostDataType } from 'eko-sdk';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';
import useLiveObject from '../hooks/useLiveObject';
import SideMenu from '../SideMenu';
import CommunityInformation from '../CommunityInformation';
import EmptyFeed from '../EmptyFeed';

import {
  CommunityContainer,
  CommunityContent,
  CommunityFeed,
  PostCompose,
  Post,
  CommunityWrapper,
  CommunityHeader,
} from './styles';

const feedRepo = new FeedRepository();
const postRepo = new PostRepository();

const Community = ({ client }) => {
  // const feed = useLiveObject(() => feedRepo.getUserFeed(client.currentUserId), []);

  // const textPostCreator = postRepo.createPost(EkoPostDataType.TextPost);
  // textPostCreator.targetUser(client.currentUserId);
  // textPostCreator.text('foobar');

  // textPostCreator.post().then(res => console.log(res));

  const [posts, setPosts] = useState([
    {
      id: 1,
      author: { name: 'John' },
      text:
        'text\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\ntext\n',
    },
    {
      id: 2,
      author: { name: 'John' },
      text: 'text text text',
    },
  ]);

  const addPost = newPost => setPosts([newPost, ...posts]);
  const removePost = postId => setPosts(posts.filter(({ id }) => id !== postId));

  const editPost = updatedPost =>
    setPosts(posts.map(post => (post.id === updatedPost.id ? updatedPost : post)));

  return (
    <CommunityContainer>
      <SideMenu />
      <CommunityWrapper>
        <CommunityHeader />
        <CommunityContent>
          <CommunityFeed>
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
          </CommunityFeed>
          <CommunityInformation />
        </CommunityContent>
      </CommunityWrapper>
    </CommunityContainer>
  );
};

export default withSDK(customizableComponent('Community')(Community));
