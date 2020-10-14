import React from 'react';
import styled from 'styled-components';
import { EkoPostTargetType } from 'eko-sdk';
import useOneUser from '~/mock/useOneUser';
import useOneCommunity from '~/mock/useOneCommunity';
import Feed from '.';

export default {
  title: 'Feed',
  parameters: { layout: 'centered' },
};

const FeedContainer = styled.div`
  width: 560px;
`;

// You can show and hide the compose bar using the controls tab.
export const MyFeed = ({ showPostCompose }) => (
  <FeedContainer>
    <Feed showPostCompose={showPostCompose} />
  </FeedContainer>
);

MyFeed.args = {
  showPostCompose: true,
};

MyFeed.argTypes = {
  showPostCompose: { control: { type: 'boolean' } },
};

// By default this uses a random user, who may have no posts on their feed.
// Try a different user with the controls tab.
export const AnotherUsersFeed = ({ customUserId, showPostCompose }) => {
  const user = useOneUser();
  if (!user) return <p>Loading...</p>;
  return (
    <FeedContainer>
      <Feed
        targetType={EkoPostTargetType.UserFeed}
        targetId={customUserId || user.userId}
        showPostCompose={showPostCompose}
      />
    </FeedContainer>
  );
};

AnotherUsersFeed.args = {
  showPostCompose: false,
  customUserId: '',
};

AnotherUsersFeed.argTypes = {
  showPostCompose: { control: { type: 'boolean' } },
  customUserId: { control: { type: 'text' } },
};

export const CommunityFeed = ({ showPostCompose }) => {
  const [community, isLoading] = useOneCommunity();
  if (isLoading) return <p>Loading...</p>;
  return (
    <FeedContainer>
      <Feed
        targetType={EkoPostTargetType.CommunityFeed}
        targetId={community.communityId}
        showPostCompose={showPostCompose}
      />
    </FeedContainer>
  );
};

CommunityFeed.args = {
  showPostCompose: true,
};

CommunityFeed.argTypes = {
  showPostCompose: { control: { type: 'boolean' } },
};
