import React, { useState, useMemo } from 'react';
import { PostRepository, CommentRepository, EkoCommentReferenceType } from 'eko-sdk';
import { toHumanString } from 'human-readable-numbers';
import { LIKE_REACTION_KEY } from 'constants';

import { ConditionalRender } from '~/core/components/ConditionalRender';
import PostLikeButton from '~/social/components/PostLikeButton';
import CommentComposeBar from '~/social/components/CommentComposeBar';
import Comment from '~/social/components/Comment';
import { SecondaryButton } from '~/core/components/Button';
import useLiveObject from '~/core/hooks/useLiveObject';
import { customizableComponent } from '~/core/hocs/customization';
import { EngagementBarContainer, Counters, InteractionBar, CommentIcon } from './styles';

const EngagementBar = ({ postId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  const post = useLiveObject(() => PostRepository.postForId(postId), [postId]);
  const isPostReady = !!post.postId;
  const { comments = [] } = post;

  const handleAddComment = commentText => {
    CommentRepository.createTextComment({
      referenceType: EkoCommentReferenceType.Post,
      referenceId: post.postId,
      text: commentText,
    });
  };

  const totalLikes = useMemo(() => {
    if (!isPostReady) return 0;
    return post.reactions[LIKE_REACTION_KEY] || 0;
  }, [isPostReady, post]);

  const totalComments = useMemo(() => {
    if (!isPostReady) return 0;
    return post.commentsCount;
  }, [isPostReady, post.commentsCount]);

  // const totalCommentsAmount =
  //   comments.length +
  //   comments.reduce((prevValue, comment) => prevValue + comment.replies.length, 0);

  return (
    <EngagementBarContainer>
      <Counters>
        <ConditionalRender condition={totalLikes > 0}>
          <span>{toHumanString(totalLikes)} likes</span>
        </ConditionalRender>
        <ConditionalRender condition={totalComments > 0}>
          <span>{toHumanString(totalComments)} comments</span>
        </ConditionalRender>
      </Counters>
      <InteractionBar>
        <ConditionalRender condition={isPostReady}>
          <PostLikeButton postId={post.postId} />
        </ConditionalRender>
        <SecondaryButton onClick={open}>
          <CommentIcon /> Comment
        </SecondaryButton>
      </InteractionBar>
      {comments.map(commentId => (
        <Comment key={commentId} commentId={commentId} />
      ))}
      <ConditionalRender condition={isOpen}>
        <CommentComposeBar onSubmit={handleAddComment} />
      </ConditionalRender>
    </EngagementBarContainer>
  );
};

export default customizableComponent('EngagementBar', EngagementBar);
