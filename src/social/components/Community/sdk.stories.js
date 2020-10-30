import React from 'react';
import styled from 'styled-components';
import { HashRouter as Router, Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';

import UserProfilePage from '~/social/components/UserProfilePage';
import UiKitCommunity from '.';

export default {
  title: 'SDK Connected/Social/App',
};

const SDKCommunity = props => {
  const history = useHistory();
  const { params = {} } = useRouteMatch('/user/:userId') || {};
  const { userId } = params;

  const handlePostAuthorClick = postAuthor => {
    const { userId: postUserId, communityId } = postAuthor;
    if (postUserId) {
      history.push(`/user/${postUserId}`);
    } else {
      history.push(`/community/${communityId}`);
    }
  };

  const handleMemberClick = memberId => history.push(`/user/${memberId}`);

  return (
    <Switch>
      <Route path="/" exact>
        <UiKitCommunity
          onPostAuthorClick={handlePostAuthorClick}
          onMemberClick={handleMemberClick}
          {...props}
        />
      </Route>
      <Route path="/user/:userId">
        <UserProfilePage userId={userId} />
      </Route>
    </Switch>
  );
};

export const SDKCommunityApp = () => (
  <Router>
    <SDKCommunity />
  </Router>
);

SDKCommunityApp.storyName = 'v2 (new)';

SDKCommunityApp.args = {
  shouldHideExplore: false,
  showCreateCommunityButton: true,
};

SDKCommunityApp.argTypes = {
  shouldHideExplore: { control: { type: 'boolean' } },
  showCreateCommunityButton: { control: { type: 'boolean' } },
  onMemberClick: { action: 'onMemberClick()' },
};

const Viewport = styled.div`
  width: 75vw;
  height: 75vh;
  overflow: hidden;
`;

export const WithinDiv = () => (
  <Viewport>
    <Router>
      <SDKCommunity />
    </Router>
  </Viewport>
);

WithinDiv.storyName = 'within a div (layout)';
