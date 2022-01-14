import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import withSDK from '~/core/hocs/withSDK';

import useUser from '~/core/hooks/useUser';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UIUserInfo from './UIUserInfo';
import useFollow from '~/core/hooks/useFollow';
import useFollowCount from '~/core/hooks/useFollowCount';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import { notification } from '~/core/components/Notification';
import { UserFeedTabs } from '~/social/pages/UserFeed/constants';

const UserInfo = ({
  userId,
  currentUserId,
  setFollowActiveTab,
  setActiveTab,
  isPrivateNetwork,
}) => {
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

  const [onFollowDecline] = useAsyncCallback(async () => {
    await followDecline();
    setActiveTab(UserFeedTabs.TIMELINE);
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  }, [followDecline]);

  return (
    <UIUserInfo
      userId={userId}
      currentUserId={currentUserId}
      fileUrl={fileUrl}
      displayName={displayName || formatMessage({ id: 'anonymous' })}
      description={description}
      setActiveTab={setActiveTab}
      setFollowActiveTab={setFollowActiveTab}
      isMyProfile={userId === currentUserId}
      isFollowPending={isFollowPending}
      isPrivateNetwork={isPrivateNetwork}
      isFollowNone={isFollowNone}
      isFollowAccepted={isFollowAccepted}
      followerCount={followerCount}
      followingCount={followingCount}
      onFollowRequest={follow}
      onFollowDecline={onFollowDecline}
      onEditUser={onEditUser}
      onMessageUser={onMessageUser}
    />
  );
};

UserInfo.propTypes = {
  userId: PropTypes.string.isRequired,
  currentUserId: PropTypes.string.isRequired,
  setActiveTab: PropTypes.func.isRequired,
  setFollowActiveTab: PropTypes.func.isRequired,
  isPrivateNetwork: PropTypes.bool.isRequired,
};

export { UIUserInfo };
export default memo(withSDK(UserInfo));
