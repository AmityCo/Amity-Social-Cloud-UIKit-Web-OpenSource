import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';
import usePost from '~/social/hooks/usePost';
import useCommunity from '~/social/hooks/useCommunity';
import withSDK from '~/core/hocs/withSDK';
import { isModerator } from '~/helpers/permissions';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UIPostHeader from './UIPostHeader';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const PostHeader = ({ postId, userRoles, hidePostTarget }) => {
  const { onClickCommunity, onClickUser } = useNavigation();
  const { post, file, user } = usePost(postId);
  const { targetId, targetType, postedUserId, createdAt, editedAt } = post;

  // If the post is targetting a community feed, get the name of that community.
  const { community } = useCommunity(targetId, [targetId]);
  const isCommunityPost = targetType === EkoPostTargetType.CommunityFeed;
  const postTargetName = isCommunityPost ? community?.displayName : null;
  const handleClickCommunity = isCommunityPost ? () => onClickCommunity(targetId) : null;

  const currentUserIsModerator = isModerator(userRoles);
  const handleClickUser = () => onClickUser(postedUserId);

  return (
    <UIPostHeader
      avatarFileUrl={file.fileUrl}
      postAuthorName={user.displayName || DEFAULT_DISPLAY_NAME}
      postTargetName={postTargetName}
      timeAgo={createdAt}
      isModerator={currentUserIsModerator}
      isEdited={createdAt < editedAt}
      onClickCommunity={handleClickCommunity}
      onClickUser={handleClickUser}
      hidePostTarget={hidePostTarget}
    />
  );
};

PostHeader.propTypes = {
  postId: PropTypes.string.isRequired,
  userRoles: PropTypes.array,
  hidePostTarget: PropTypes.bool,
};

PostHeader.defaultProps = {
  userRoles: [],
  hidePostTarget: false,
};

export { UIPostHeader };
export default withSDK(PostHeader);
