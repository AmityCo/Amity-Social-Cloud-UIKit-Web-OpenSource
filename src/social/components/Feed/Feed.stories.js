import React from 'react';
import styled from 'styled-components';
import { EkoPostTargetType } from 'eko-sdk';
import useOneUser from '~/mock/useOneUser';
import Feed from '.';

export default {
  title: 'Feed',
  parameters: { layout: 'centered' },
};

const FeedContainer = styled.div`
  width: 560px;
`;

// You can show and hide the compose bar using the controls tab.
export const MyFeedWithComposeBar = ({ showPostCompose }) => (
  <FeedContainer>
    <Feed showPostCompose={showPostCompose} style={{ width: 560 }} />
  </FeedContainer>
);

MyFeedWithComposeBar.args = {
  showPostCompose: true,
};

MyFeedWithComposeBar.argTypes = {
  showPostCompose: { control: { type: 'boolean' } },
};

// By default this uses a random user, who may have no posts on their feed.
// Try a different user with the controls tab.
export const AnotherUsersFeed = ({ customUserId, showPostCompose }) => {
  // TODO - debounce the changing of customerUserId!
  // Or allow it to be changed with button click.
  const user = useOneUser();
  if (!user) return <p>Loading...</p>;
  return (
    <FeedContainer>
      <Feed
        targetType={EkoPostTargetType.UserFeed}
        targetId={customUserId || user.userId}
        showPostCompose={showPostCompose}
        style={{ width: 560 }}
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

// TODO - this community Id should come from BE so that it definitely exists.
// Same as is currently done above with useOneUser hook.
const KNOWN_COMMUNITY_ID = '7f1bc42bff3a3a2d3af1da2de892c1f1';

export const CommunityFeedWithComposeBar = ({ showPostCompose }) => (
  <FeedContainer>
    <Feed
      targetType={EkoPostTargetType.CommunityFeed}
      targetId={KNOWN_COMMUNITY_ID}
      showPostCompose={showPostCompose}
      style={{ width: 560 }}
    />
  </FeedContainer>
);

CommunityFeedWithComposeBar.args = {
  showPostCompose: true,
};

CommunityFeedWithComposeBar.argTypes = {
  showPostCompose: { control: { type: 'boolean' } },
};
