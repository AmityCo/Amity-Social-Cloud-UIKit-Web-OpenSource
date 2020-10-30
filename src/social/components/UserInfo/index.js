import React from 'react';
import PropTypes from 'prop-types';

import useUser from '~/core/hooks/useUser';
import withSDK from '~/core/hocs/withSDK';
import UIUserInfo from './UIUserInfo';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const UserInfo = ({ userId, currentUserId, editProfile, goToChat }) => {
  const { user } = useUser(userId);
  const { avatarFileId, displayName, description } = user;

  /* TODO: need method for getting posts amount for current user */
  const postsCount = 0;

  const isMyProfile = userId === currentUserId;

  return (
    <UIUserInfo
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

UserInfo.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  editProfile: PropTypes.func,
  goToChat: PropTypes.func,
};

UserInfo.defaultProps = {
  editProfile: () => {},
  goToChat: () => {},
};

export { UIUserInfo };
export default withSDK(UserInfo);
