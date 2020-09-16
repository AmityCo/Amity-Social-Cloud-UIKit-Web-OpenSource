import React, { useState, useMemo } from 'react';
import { PostRepository, CommentRepository, EkoCommentReferenceType } from 'eko-sdk';
import { toHumanString } from 'human-readable-numbers';
import { customizableComponent } from 'hocs/customization';
import useLiveObject from 'hooks/useLiveObject';
import { SecondaryButton } from 'components/Button';
import PostLikeButton from 'components/PostLikeButton';
import CommentComposeBar from 'components/CommentComposeBar';
import Comment from 'components/Comment';
import { LIKE_REACTION_KEY } from 'constants';
import { EngagementBarContainer, Counters, InteractionBar, CommentIcon } from './styles';

const commentRepo = new CommentRepository();

const EngagementBar = ({ postId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  const post = useLiveObject(() => PostRepository.postForId(postId), {});
  const isPostReady = !!post.postId;
  const { comments = [] } = post;

  const handleAddComment = commentText => {
    commentRepo.createTextComment({
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

  const totalCommentsAmount =
    comments.length +
    comments.reduce((prevValue, comment) => prevValue + comment.replies.length, 0);

  return (
    <EngagementBarContainer>
      <Counters>
        {totalLikes > 0 && <span>{toHumanString(totalLikes)} likes</span>}
        {totalComments > 0 && <span>{toHumanString(totalComments)} comments</span>}
      </Counters>
      <InteractionBar>
        {isPostReady && <PostLikeButton postId={post.postId} />}
        <SecondaryButton onClick={open}>
          <CommentIcon /> Comment
        </SecondaryButton>
      </InteractionBar>
      {comments.map(commentId => (
        <Comment key={commentId} commentId={commentId} />
      ))}
      {isOpen && <CommentComposeBar onSubmit={handleAddComment} />}
    </EngagementBarContainer>
  );
};

export default customizableComponent('EngagementBar', EngagementBar);
