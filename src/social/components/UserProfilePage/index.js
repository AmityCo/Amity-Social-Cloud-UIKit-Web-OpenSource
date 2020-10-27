import React from 'react';
import { EkoPostTargetType } from 'eko-sdk';

import UserProfileBar from '~/social/components/Profile';
import Feed from '~/social/components/Feed';

const UserProfilePage = ({ goToUserFeed, userId, editProfile, blockRouteChange }) => {
  return (
    <>
      <Feed
        targetType={EkoPostTargetType.MyFeed}
        onPostAuthorClick={goToUserFeed}
        userId={userId}
        editProfile={editProfile}
        blockRouteChange={blockRouteChange}
      />
      <UserProfileBar userId={userId} editProfile={editProfile} />
    </>
  );
};

export default UserProfilePage;
