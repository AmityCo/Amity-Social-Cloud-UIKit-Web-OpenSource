import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';

import CommunityInformation from '../CommunityInformation';
import EmptyFeed from '../EmptyFeed';

import usePostsMock from '../hooks/usePostsMock';

import { myCommunities } from '../mock';

import { Content, Feed, PostCompose, Post, FeedHeaderTabs } from './styles';

// TODO replace with translations keys
const tabs = {
  TIMELINE: 'Timeline',
  MEMBERS: 'Members',
};

const COMMUNITY_TEST_POSTS = [];

const CommunityFeed = ({ client, communityId }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock(COMMUNITY_TEST_POSTS);

  const community = myCommunities.find(community => community.communityId === communityId);

  const [activeTab, setActiveTab] = useState(tabs.TIMELINE);

  return (
    <>
      <Content>
        <Feed>
          <FeedHeaderTabs
            tabs={[tabs.TIMELINE, tabs.MEMBERS]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

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
