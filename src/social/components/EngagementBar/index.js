import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CommentRepository, EkoCommentReferenceType } from 'eko-sdk';

import { LIKE_REACTION_KEY } from '~/constants';
import customizableComponent from '~/core/hocs/customization';
import usePost from '~/social/hooks/usePost';
import UIEngagementBar from './UIEngagementBar';

const EngagementBar = ({ postId, noInteractionMessage }) => {
  const [isComposeBarDisplayed, setComposeBarDisplayed] = useState(false);
  const toggleComposeBar = () => setComposeBarDisplayed(prevValue => !prevValue);

  const hideComposeBar = () => setComposeBarDisplayed(false);

  const { post } = usePost(postId);
  const { commentsCount, reactions = {} } = post;

  const handleAddComment = async commentText => {
    await CommentRepository.createTextComment({
      referenceType: EkoCommentReferenceType.Post,
      referenceId: postId,
      text: commentText,
    });

    hideComposeBar();
  };

  return (
    <UIEngagementBar
      postId={post.postId}
      totalLikes={reactions[LIKE_REACTION_KEY]}
      totalComments={commentsCount}
      noInteractionMessage={noInteractionMessage}
      onClickComment={toggleComposeBar}
      isComposeBarDisplayed={isComposeBarDisplayed}
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
