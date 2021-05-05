import React from 'react';
import PropTypes from 'prop-types';
import { PostTargetType } from '@amityco/js-sdk';
import usePost from '~/social/hooks/usePost';
import useCommunity from '~/social/hooks/useCommunity';
import { useNavigation } from '~/social/providers/NavigationProvider';
import UIPostHeader from './UIPostHeader';
import useCommunityOneMember from '~/social/hooks/useCommunityOneMember';

const DEFAULT_DISPLAY_NAME = 'Anonymous';

const PostHeader = ({ postId, hidePostTarget }) => {
  const { onClickCommunity, onClickUser } = useNavigation();
  const { post, file, user } = usePost(postId);
  const { targetId, targetType, postedUserId, createdAt, editedAt } = post;

  // If the post is targetting a community feed, get the name of that community.
  const { community } = useCommunity(targetId);
  const isCommunityPost = targetType === PostTargetType.CommunityFeed;
  const postTargetName = isCommunityPost ? community?.displayName : null;
  const handleClickCommunity = isCommunityPost ? () => onClickCommunity(targetId) : null;

  const { isCommunityModerator } = useCommunityOneMember(
    community?.communityId,
    user.userId,
    community?.userId,
  );
  const handleClickUser = () => onClickUser(postedUserId);

  return (
    <UIPostHeader
      avatarFileUrl={file.fileUrl}
      postAuthorName={user.displayName || DEFAULT_DISPLAY_NAME}
      postTargetName={postTargetName}
      timeAgo={createdAt}
      isCommunityModerator={isCommunityModerator}
      isEdited={createdAt < editedAt}
      onClickCommunity={handleClickCommunity}
      onClickUser={handleClickUser}
      hidePostTarget={hidePostTarget}
    />
  );
};

PostHeader.propTypes = {
  postId: PropTypes.string.isRequired,
  hidePostTarget: PropTypes.bool,
};

PostHeader.defaultProps = {
  hidePostTarget: false,
};

export { UIPostHeader };
export default PostHeader;
