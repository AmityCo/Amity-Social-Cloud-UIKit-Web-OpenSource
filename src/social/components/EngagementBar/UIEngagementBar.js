import React from 'react';
import PropTypes from 'prop-types';
import { toHumanString } from 'human-readable-numbers';

import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import PostLikeButton from '~/social/components/PostLikeButton';
import CommentComposeBar from '~/social/components/CommentComposeBar';
import Comment from '~/social/components/Comment';
import { SecondaryButton } from '~/core/components/Button';
import {
  EngagementBarContainer,
  Counters,
  InteractionBar,
  CommentIcon,
  NoInteractionMessage,
} from './styles';

const UIEngagementBar = ({
  postId,
  totalLikes,
  totalComments,
  noInteractionMessage,
  onClickComment,
  isCommentComposeOpen,
  handleAddComment,
  commentIds,
}) => (
  <EngagementBarContainer>
    <Counters>
      <ConditionalRender condition={totalLikes > 0}>
        <span>{toHumanString(totalLikes)} likes</span>
      </ConditionalRender>
      <ConditionalRender condition={totalComments > 0}>
        <span>{toHumanString(totalComments)} comments</span>
      </ConditionalRender>
    </Counters>
    <ConditionalRender condition={!noInteractionMessage}>
      <>
        <InteractionBar>
          <PostLikeButton postId={postId} />
          <SecondaryButton onClick={onClickComment}>
            <CommentIcon /> Comment
          </SecondaryButton>
        </InteractionBar>
        {commentIds.map(commentId => (
          <Comment key={commentId} commentId={commentId} />
        ))}
        <ConditionalRender condition={isCommentComposeOpen}>
          <CommentComposeBar onSubmit={handleAddComment} />
        </ConditionalRender>
      </>
    </ConditionalRender>
    <NoInteractionMessage>{noInteractionMessage}</NoInteractionMessage>
  </EngagementBarContainer>
);

UIEngagementBar.propTypes = {
  postId: PropTypes.string,
  totalLikes: PropTypes.number,
  totalComments: PropTypes.number,
  noInteractionMessage: PropTypes.string,
  onClickComment: PropTypes.func,
  isCommentComposeOpen: PropTypes.bool,
  handleAddComment: PropTypes.func,
  commentIds: PropTypes.arrayOf(PropTypes.string),
};

UIEngagementBar.defaultProps = {
  postId: '',
  totalLikes: 0,
  totalComments: 0,
  noInteractionMessage: null,
  onClickComment: () => {},
  isCommentComposeOpen: false,
  handleAddComment: () => {},
  commentIds: [],
};

export default customizableComponent('UIEngagementBar', UIEngagementBar);
