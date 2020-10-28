import React, { useState, useEffect } from 'react';
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

  // this is workaround for updating comments in real-time.
  // I believe this should be fixed
  const [postComments, setPostComments] = useState(comments);

  useEffect(() => {
    if (comments.length > postComments.length) {
      setPostComments(comments);
    }
  }, [comments]);

  const handleAddComment = async commentText => {
    const newCommentLiveObject = await CommentRepository.createTextComment({
      referenceType: EkoCommentReferenceType.Post,
      referenceId: postId,
      text: commentText,
    });

    newCommentLiveObject.on('dataStatusChanged', () => {
      const { commentId } = newCommentLiveObject.model;
      setPostComments([...postComments, commentId]);
    });
  };

  return (
    <UIEngagementBar
      postId={postId}
      totalLikes={reactions[LIKE_REACTION_KEY]}
      totalComments={commentsCount}
      noInteractionMessage={noInteractionMessage}
      onClickComment={toggleCommentCompose}
      commentIds={postComments}
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
