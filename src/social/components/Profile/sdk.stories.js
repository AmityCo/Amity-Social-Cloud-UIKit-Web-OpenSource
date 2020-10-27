import React from 'react';
import { HashRouter as Router, Switch, Route, useHistory, useRouteMatch } from 'react-router-dom';

import useOneUser from '~/mock/useOneUser';
import ProfileSettings from '~/social/components/ProfileSettings';
import UserProfileBar from '.';

export default {
  title: 'SDK Connected/Social/User/Profile',
  parameters: { layout: 'centered' },
};

const MyProfile = () => {
  const user = useOneUser();
  if (!user) {
    return <p>Loading...</p>;
  }

  const history = useHistory();
  const { params = {} } = useRouteMatch('/profile/:userId') || {};
  const { userId } = params;

  const editProfile = id => history.push(`/profile/${id}/edit`);

  return (
    <Switch>
      <Route path="/" exact>
        <UserProfileBar
          userId={user.userId}
          currentUserId={user.userId}
          editProfile={editProfile}
        />
      </Route>
      <Route path="/profile/:userId/edit">
        <ProfileSettings userId={userId} />
      </Route>
    </Switch>
  );
};

export const SDKApplication = () => {
  return (
    <Router>
      <MyProfile />
    </Router>
  );
};

SDKApplication.storyName = 'My Profile';

export const AnotherUserProfile = () => {
  const user = useOneUser();
  if (!user) return <p>Loading...</p>;
  return <UserProfileBar userId={user.userId} />;
};
