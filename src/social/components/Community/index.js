import React, { useState } from 'react';

import { CommunityProfileBar } from '~/social/components/Profile';
import EmptyFeed from '~/social/components/EmptyFeed';
import { ConditionalRender } from '~/core/components/ConditionalRender';
import { customizableComponent } from '~/core/hocs/customization';
import withSDK from '~/core/hocs/withSDK';

import { getCommunities, usePostsMock } from '~/mock';

import CommunityMembers from './CommunityMembers';

import { Content, Feed, PostCompose, Post, FeedHeaderTabs } from './styles';

// TODO replace with translations keys
// TODO: react-intl
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
      <ConditionalRender condition={posts.length}>
        {posts.map(post => (
          <Post
            onPostAuthorClick={onPostAuthorClick}
            key={post.postId}
            post={post}
            onEdit={updatedPost => editPost(updatedPost)}
            onDelete={() => removePost(post.postId)}
          />
        ))}
        <EmptyFeed />
      </ConditionalRender>
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
        <ConditionalRender condition={activeTab === tabs.TIMELINE}>
          <CommunityPosts
            communityId={communityId}
            community={currentCommunity}
            onPostAuthorClick={onPostAuthorClick}
            blockRouteChange={blockRouteChange}
          />
        </ConditionalRender>
        <ConditionalRender condition={activeTab === tabs.MEMBERS}>
          <CommunityMembers
            communityId={communityId}
            community={currentCommunity}
            onMemberClick={onMemberClick}
          />
        </ConditionalRender>
      </Feed>
      <CommunityProfileBar
        onEditCommunityClick={onEditCommunityClick}
        community={currentCommunity}
      />
    </Content>
  );
};

export default withSDK(customizableComponent('CommunityFeed', CommunityFeed));
