import React from 'react';
import { HashRouter as Router, Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';

import UserFeedPage from '~/social/pages/UserFeed';
import CommunitySettings from '~/social/components/CommunitySettings';
import UiKitApp from '.';

export default {
  title: 'SDK Connected/Social',
};

const SDKApp = props => {
  const history = useHistory();

  const { params = {} } =
    useRouteMatch('/user/:currentUserId') || useRouteMatch('/profile/:communityId') || {};
  const { currentUserId, communityId } = params;

  //  const onClickCommunity = communityId => history.push(`/community/${communityId}`);
  const onClickUser = userId => history.push(`/user/${userId}`);
  const onEditCommunity = id => history.push(`/profile/${id}/edit`);
  const goToFeed = () => history.push('/');

  return (
    <Switch>
      <Route path="/" exact>
        <UiKitApp onClickUser={onClickUser} onEditCommunity={onEditCommunity} {...props} />
      </Route>
      <Route path="/user/:userId">
        <UserFeedPage userId={currentUserId} />
      </Route>
      <Route path="/profile/:communityId/edit">
        <CommunitySettings communityId={communityId} onCommunityClosed={goToFeed} />
      </Route>
    </Switch>
  );
};

export const SDKCommunityApp = () => (
  <Router>
    <SDKApp />
  </Router>
);

SDKCommunityApp.storyName = 'Application';

SDKCommunityApp.args = {
  shouldHideExplore: false,
  showCreateCommunityButton: true,
};

SDKCommunityApp.argTypes = {
  shouldHideExplore: { control: { type: 'boolean' } },
  showCreateCommunityButton: { control: { type: 'boolean' } },
  onMemberClick: { action: 'onMemberClick()' },
};
