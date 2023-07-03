import PropTypes from 'prop-types';
import { memo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import withSDK from '~/core/hocs/withSDK';

import { notification } from '~/core/components/Notification';
import { useAsyncCallback } from '~/core/hooks/useAsyncCallback';
import useFollow from '~/core/hooks/useFollow';
import useFollowCount from '~/core/hooks/useFollowCount';
import useImage from '~/core/hooks/useImage';
import useUser from '~/core/hooks/useUser';
import { UserFeedTabs } from '~/social/pages/UserFeed/constants';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UIUserInfo from './UIUserInfo';

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

  const { fileId } = file;
  const fileUrl = useImage({ fileId });

  const [onFollowDecline] = useAsyncCallback(async () => {
    await followDecline();
    setActiveTab(UserFeedTabs.TIMELINE);
    notification.success({ content: <FormattedMessage id="notification.done" /> });
  }, [followDecline]);
  console.log('Roles', user);
  return (
    <UIUserInfo
      userId={userId}
      currentUserId={currentUserId}
      userAriseTier={user?.metadata?.ariseTier}
      userRoles={user.roles}
      fileUrl={user.avatarCustomUrl || fileUrl}
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
      // add other badge data here e.g. Cym Legend
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
