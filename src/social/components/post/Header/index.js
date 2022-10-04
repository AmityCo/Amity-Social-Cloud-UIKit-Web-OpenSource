import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { PostTargetType } from '@amityco/js-sdk';
import { FormattedMessage } from 'react-intl';
import { isAdmin, isModerator } from '~/helpers/permissions';
import usePost from '~/social/hooks/usePost';
import useCommunity from '~/social/hooks/useCommunity';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UIPostHeader from './UIPostHeader';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';

const PostHeader = ({ postId, hidePostTarget, loading }) => {
  const { onClickCommunity, onClickUser } = useNavigation();
  const { post, file, user } = usePost(postId);

  const { targetId, targetType, postedUserId, createdAt, editedAt } = post;

  // If the post is targetting a community feed, get the name of that community.
  const isCommunityPost = targetType === PostTargetType.CommunityFeed;
  const { community } = useCommunity(targetId, () => !isCommunityPost);
  const postTargetName = isCommunityPost ? community?.displayName : null;
  const handleClickCommunity = isCommunityPost ? () => onClickCommunity(targetId) : null;

  const { isCommunityModerator } = useCommunityOneMember(
    community?.communityId,
    user.userId,
    community?.userId,
  );
  const handleClickUser = () => onClickUser(postedUserId);

  const userTag = user?.metadata?.userType;

  return (
    <UIPostHeader
      userTag={userTag && userTag !== 'user' ? userTag : undefined}
      avatarFileUrl={file.fileUrl}
      postAuthorName={user.displayName || <FormattedMessage id="anonymous" />}
      postTargetName={postTargetName}
      timeAgo={createdAt}
      isModerator={isCommunityModerator || isModerator(user.roles) || isAdmin(user.roles)}
      isEdited={createdAt < editedAt}
      isBanned={user.isGlobalBan}
      hidePostTarget={hidePostTarget}
      loading={loading}
      onClickCommunity={handleClickCommunity}
      onClickUser={handleClickUser}
    />
  );
};

PostHeader.propTypes = {
  postId: PropTypes.string,
  hidePostTarget: PropTypes.bool,
  loading: PropTypes.bool,
};

PostHeader.defaultProps = {
  hidePostTarget: false,
  loading: false,
};

export { UIPostHeader };
export default memo(PostHeader);
