import React from 'react';

import { customizableComponent } from 'hocs/customization';
import withSDK from 'hocs/withSDK';

// import CommunityInformation from 'components/CommunityInformation';
import { testUser, usePostsMock } from 'mock';
import EmptyFeed from 'components/EmptyFeed';

import { Content, Feed, PostCompose, Post, UserFeedHeader } from './styles';

const UserFeed = () => {
  const { posts, addPost, removePost, editPost } = usePostsMock(testUser.id);

  return (
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
  );
};

export default withSDK(customizableComponent('UserFeed')(UserFeed));
