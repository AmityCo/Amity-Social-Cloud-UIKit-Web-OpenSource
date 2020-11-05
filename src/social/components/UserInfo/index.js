import React from 'react';
import PropTypes from 'prop-types';

import withSDK from '~/core/hocs/withSDK';

import useUser from '~/core/hooks/useUser';
import UIUserInfo from './UIUserInfo';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const UserInfo = ({ userId, currentUserId, onEditUser, onMessageUser }) => {
  const { user, file } = useUser(userId);
  const { displayName, description } = user;
  const { fileUrl } = file;

  /* TODO: need method for getting posts amount for current user */
  const postsCount = 0;

  return (
    <UIUserInfo
      userId={userId}
      fileUrl={fileUrl}
      displayName={displayName || DEFAULT_DISPLAY_NAME}
      description={description}
      postsCount={postsCount}
      isMe={userId === currentUserId}
      onEditUser={onEditUser}
      onMessageUser={onMessageUser}
    />
  );
};

UserInfo.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  onEditUser: PropTypes.func,
  onMessageUser: PropTypes.func,
};

UserInfo.defaultProps = {
  onEditUser: () => {},
  onMessageUser: () => {},
};

export { UIUserInfo };
export default withSDK(UserInfo);
