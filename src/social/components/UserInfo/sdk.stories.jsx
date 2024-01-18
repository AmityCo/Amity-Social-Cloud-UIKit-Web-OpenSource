import React from 'react';
import { FormattedMessage } from 'react-intl';
import { HashRouter as Router, Routes, Route, useNavigate, useMatch } from 'react-router-dom';

import useOneUser from '~/mock/useOneUser';
import ProfileSettings from '~/social/components/ProfileSettings';
import UserInfo from '.';

export default {
  title: 'SDK Connected/Social/User/Profile',
  parameters: { layout: 'centered' },
};

const SdkUserInfo = () => {
  const user = useOneUser();

  const history = useNavigate();
  const { params = {} } = useMatch('/profile/:userId') || {};
  const { userId } = params;

  const editProfile = (id) => history.push(`/profile/${id}/edit`);

  if (!user) {
    return (
      <p>
        <FormattedMessage id="loading" />
      </p>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        exact
        element={
          <UserInfo userId={user.userId} currentUserId={user.userId} editProfile={editProfile} />
        }
      />
      <Route path="/profile/:userId/edit" element={<ProfileSettings userId={userId} />} />
    </Routes>
  );
};

export const SdkUserInfoApp = {
  render: () => {
    return (
      <Router>
        <SdkUserInfo />
      </Router>
    );
  },

  name: 'My User Info',
};

export const AnotherUserInfo = {
  render: () => {
    const user = useOneUser();

    if (!user) {
      return (
        <p>
          <FormattedMessage id="loading" />
        </p>
      );
    }

    return <UserInfo userId={user.userId} />;
  },

  name: 'Another User Info',
};
