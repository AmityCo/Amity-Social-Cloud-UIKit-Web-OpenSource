import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import withSDK from '~/core/hocs/withSDK';

import useUser from '~/core/hooks/useUser';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UIUserInfo from './UIUserInfo';
import useFollow from '~/core/hooks/useFollow';
import useFollowCount from '~/core/hooks/useFollowCount';

const UserInfo = ({ userId, currentUserId, setFollowActiveTab, setActiveTab }) => {
  const { formatMessage } = useIntl();
  const { onEditUser, onMessageUser } = useNavigation();
  const { user, file } = useUser(userId);
  const { follow, followDecline, isFollowPending, isFollowNone, isFollowAccepted } = useFollow(
    currentUserId,
    userId,
  );
  const { followerCount, followingCount } = useFollowCount(userId);

  const { displayName, description } = user;
  const { fileUrl } = file;

  /* TODO: need method for getting posts amount for current user */
  const postsCount = 0;

  return (
    <UIUserInfo
      userId={userId}
      fileUrl={fileUrl}
      displayName={displayName || formatMessage({ id: 'anonymous' })}
      description={description}
      postsCount={postsCount}
      onFollowRequest={follow}
      onFollowDecline={followDecline}
      setActiveTab={setActiveTab}
      setFollowActiveTab={setFollowActiveTab}
      isMyProfile={userId === currentUserId}
      onEditUser={onEditUser}
      onMessageUser={onMessageUser}
      isFollowPending={isFollowPending}
      isFollowNone={isFollowNone}
      isFollowAccepted={isFollowAccepted}
      followerCount={followerCount}
      followingCount={followingCount}
    />
  );
};

UserInfo.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setFollowActiveTab: PropTypes.func.isRequired,
};

export { UIUserInfo };
export default memo(withSDK(UserInfo));
