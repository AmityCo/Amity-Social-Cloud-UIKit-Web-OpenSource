import React from 'react';
import PropTypes from 'prop-types';
import { EkoPostTargetType } from 'eko-sdk';
import usePost from '~/social/hooks/usePost';
import useCommunity from '~/social/hooks/useCommunity';
import withSDK from '~/core/hocs/withSDK';
import { isModerator } from '~/helpers/permissions';
import UIPostHeader from './UIPostHeader';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const PostHeader = ({ postId, userRoles, onClickUser }) => {
  const { post, file, user } = usePost(postId);
  const { targetId, targetType, postedUserId, createdAt, editedAt } = post;

  // If the post is targetting a community feed, get the name of that community.
  const { community } = useCommunity(targetId, [targetId]);
  const isCommunityPost = targetType === EkoPostTargetType.CommunityFeed;
  const postTargetName = isCommunityPost ? community?.displayName : null;

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
      onClickUser={handleClickUser}
    />
  );
};

PostHeader.propTypes = {
  postId: PropTypes.string.isRequired,
  userRoles: PropTypes.array,
  onClickUser: PropTypes.func,
};

PostHeader.defaultProps = {
  userRoles: [],
  onClickUser: () => {},
};

export { UIPostHeader };
export default withSDK(PostHeader);
