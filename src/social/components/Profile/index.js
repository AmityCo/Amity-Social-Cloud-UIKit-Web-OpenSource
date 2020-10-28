import React from 'react';
import PropTypes from 'prop-types';

import useUser from '~/core/hooks/useUser';
import withSDK from '~/core/hocs/withSDK';
import UIUserProfileBar from './UIUserProfileBar';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const UserProfileBar = ({ userId, currentUserId, editProfile, goToChat }) => {
  const { user } = useUser(userId);
  const { avatarFileId, displayName, description } = user;

  /* TODO: need method for getting posts amount for current user */
  const postsCount = 0;

  const isMyProfile = userId === currentUserId;

  return (
    <UIUserProfileBar
      userId={userId}
      avatarFileId={avatarFileId}
      displayName={displayName || DEFAULT_DISPLAY_NAME}
      description={description}
      postsCount={postsCount}
      isMyProfile={isMyProfile}
      editProfile={editProfile}
      goToChat={goToChat}
    />
  );
};

UserProfileBar.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  editProfile: PropTypes.func,
  goToChat: PropTypes.func,
};

UserProfileBar.defaultProps = {
  editProfile: () => {},
  goToChat: () => {},
};

export { UIUserProfileBar };
export default withSDK(UserProfileBar);
