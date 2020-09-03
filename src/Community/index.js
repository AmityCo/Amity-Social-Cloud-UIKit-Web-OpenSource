import React, { useState } from 'react';

import { customizableComponent } from '../hoks/customization';
import withSDK from '../hoks/withSDK';

import CommunityInformation from '../CommunityInformation';
import EmptyFeed from '../EmptyFeed';

import CommunityMembers from './CommunityMembers';

import { getCommunities, usePostsMock } from '../mock';

import { Content, Feed, PostCompose, Post, FeedHeaderTabs } from './styles';

// TODO replace with translations keys
const tabs = {
  TIMELINE: 'Timeline',
  MEMBERS: 'Members',
};

const CommunityPosts = ({ communityId, community, onPostAuthorClick }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock(communityId);

  return (
    <>
      <PostCompose targetId={communityId} community={community} onSubmit={addPost} />
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
    </>
  );
};

const CommunityFeed = ({ communityId, onPostAuthorClick, onMemberClick, onEditCommunityClick }) => {
  const communities = getCommunities();

  const currentCommunity = communities.find(community => community.communityId === communityId);

  const [activeTab, setActiveTab] = useState(tabs.TIMELINE);

  return (
    <Content>
      <Feed>
        <FeedHeaderTabs
          tabs={[tabs.TIMELINE, tabs.MEMBERS]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        {activeTab === tabs.TIMELINE && (
          <CommunityPosts
            communityId={communityId}
            community={currentCommunity}
            onPostAuthorClick={onPostAuthorClick}
          />
        )}

        {activeTab === tabs.MEMBERS && (
          <CommunityMembers
            communityId={communityId}
            community={currentCommunity}
            onMemberClick={onMemberClick}
          />
        )}
      </Feed>
      <CommunityInformation
        onEditCommunityClick={onEditCommunityClick}
        community={currentCommunity}
      />
    </Content>
  );
};

export default withSDK(customizableComponent('CommunityFeed')(CommunityFeed));
