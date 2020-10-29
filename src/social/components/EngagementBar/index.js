import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CommentRepository, EkoCommentReferenceType } from 'eko-sdk';
import { LIKE_REACTION_KEY } from 'constants';

import customizableComponent from '~/core/hocs/customization';
import usePost from '~/social/hooks/usePost';
import UIEngagementBar from './UIEngagementBar';

const EngagementBar = ({ postId, noInteractionMessage }) => {
  const [isCommentComposeOpen, setCommentComposeOpen] = useState(false);
  const toggleCommentCompose = () => setCommentComposeOpen(prevValue => !prevValue);

  const { post } = usePost(postId);
  const { commentsCount, reactions = {}, comments = [] } = post;

  const handleAddComment = commentText => {
    CommentRepository.createTextComment({
      referenceType: EkoCommentReferenceType.Post,
      referenceId: postId,
      text: commentText,
    });
  };

  return (
    <UIEngagementBar
      postId={postId}
      totalLikes={reactions[LIKE_REACTION_KEY]}
      totalComments={commentsCount}
      noInteractionMessage={noInteractionMessage}
      onClickComment={toggleCommentCompose}
      commentIds={comments}
      isCommentComposeOpen={isCommentComposeOpen}
      handleAddComment={handleAddComment}
    />
  );
};

EngagementBar.propTypes = {
  postId: PropTypes.string.isRequired,
  noInteractionMessage: PropTypes.string,
};

EngagementBar.defaultProps = {
  noInteractionMessage: null,
};

export { UIEngagementBar };
export default customizableComponent('EngagementBar', EngagementBar);
