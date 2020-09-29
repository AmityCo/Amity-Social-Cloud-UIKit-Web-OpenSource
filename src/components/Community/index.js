import React, { useState } from 'react';

import { customizableComponent } from 'hocs/customization';
import withSDK from 'hocs/withSDK';

import { getCommunities, usePostsMock } from 'mock';
import { CommunityProfileBar } from 'components/Profile';
import EmptyFeed from 'components/EmptyFeed';

import CommunityMembers from './CommunityMembers';

import { Content, Feed, PostCompose, Post, FeedHeaderTabs } from './styles';

// TODO replace with translations keys
const tabs = {
  TIMELINE: 'Timeline',
  MEMBERS: 'Members',
};

const CommunityPosts = ({ communityId, community, onPostAuthorClick, blockRouteChange }) => {
  const { posts, addPost, removePost, editPost } = usePostsMock(communityId);

  return (
    <>
      <PostCompose
        targetId={communityId}
        community={community}
        onSubmit={addPost}
        blockRouteChange={blockRouteChange}
      />
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

const CommunityFeed = ({
  communityId,
  onPostAuthorClick,
  onMemberClick,
  onEditCommunityClick,
  blockRouteChange,
}) => {
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
            blockRouteChange={blockRouteChange}
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
      <CommunityProfileBar
        onEditCommunityClick={onEditCommunityClick}
        community={currentCommunity}
      />
    </Content>
  );
};

export default withSDK(customizableComponent('CommunityFeed', CommunityFeed));
