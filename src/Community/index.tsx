import React, { useState, useEffect } from 'react';
import { ChannelRepository, FeedRepository, PostRepository, EkoPostDataType } from 'eko-sdk';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';
import useLiveObject from '../hooks/useLiveObject';
import SideMenu from '../SideMenu';
import CommunityAbout from '../CommunityAbout';

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
        'text\n text\n text\n text\n text\n text\n text\n text\n text\n text\n text\n text\n text\n text\n text\n text\n text\n text\n',
    },
    {
      id: 2,
      author: { name: 'John' },
      text: 'text text text',
    },
  ]);

  const addPost = newPost => setPosts([newPost, ...posts]);

  return (
    <CommunityContainer>
      <SideMenu />
      <CommunityWrapper>
        <CommunityHeader />
        <CommunityContent>
          <CommunityFeed>
            <PostCompose onSubmit={addPost} />
            {posts.map(post => (
              <Post key={post.id} post={post} />
            ))}
          </CommunityFeed>
          <CommunityAbout />
        </CommunityContent>
      </CommunityWrapper>
    </CommunityContainer>
  );
};

export default withSDK(customizableComponent('Community')(Community));
