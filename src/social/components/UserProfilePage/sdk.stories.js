import React from 'react';

import useOneUser from '~/mock/useOneCommunity';

import UserPagePage from '.';

export default {
  title: 'SDK Connected/Social/User',
};

export const SDKUserPagePage = props => {
  const [user, isLoading] = useOneUser();
  if (isLoading) return <p>Loading...</p>;
  return <UserPagePage userId={user.userId} {...props} />;
};

SDKUserPagePage.storyName = 'Profile Page';

SDKUserPagePage.argTypes = {
  goToUserFeed: { action: 'goToUserFeed({ userId, communityId })' },
  editProfile: { action: 'editProfile()' },
};
