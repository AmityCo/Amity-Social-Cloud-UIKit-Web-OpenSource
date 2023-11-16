import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { CommentRepository, CommentReferenceType } from '@amityco/js-sdk';

import { LIKE_REACTION_KEY } from '~/constants';
import customizableComponent from '~/core/hocs/customization';
import usePost from '~/social/hooks/usePost';
import UIEngagementBar from './UIEngagementBar';

const EngagementBar = ({ postId, readonly }) => {
  const [isComposeBarDisplayed, setComposeBarDisplayed] = useState(false);
  const toggleComposeBar = () => setComposeBarDisplayed((prevValue) => !prevValue);

  const hideComposeBar = () => setComposeBarDisplayed(false);

  const { post } = usePost(postId);
  const { commentsCount, reactions = {}, targetId, targetType } = post;

  const handleAddComment = async (commentText, mentionees, metadata) => {
    await CommentRepository.createTextComment({
      referenceType: CommentReferenceType.Post,
      referenceId: postId,
      text: commentText,
      mentionees,
      metadata,
    });

    hideComposeBar();
  };

  return (
    <UIEngagementBar
      postId={post.postId}
      targetId={targetId}
      targetType={targetType}
      totalLikes={reactions[LIKE_REACTION_KEY]}
      totalComments={commentsCount}
      readonly={readonly}
      isComposeBarDisplayed={isComposeBarDisplayed}
      handleAddComment={handleAddComment}
      onClickComment={toggleComposeBar}
    />
  );
};

EngagementBar.propTypes = {
  postId: PropTypes.string.isRequired,
  readonly: PropTypes.bool,
};

EngagementBar.defaultProps = {
  readonly: false,
};

export { UIEngagementBar };
export default memo(customizableComponent('EngagementBar', EngagementBar));
