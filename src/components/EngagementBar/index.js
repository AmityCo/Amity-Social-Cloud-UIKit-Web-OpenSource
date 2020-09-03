import React, { useState } from 'react';
import { toHumanString } from 'human-readable-numbers';
import { customizableComponent } from '../../hocs/customization';
import { SecondaryButton } from '../Button';

import CommentComposeBar from '../CommentComposeBar';
import Comment from '../Comment';

import { EngagementBarContainer, Counters, InteractionBar, LikeIcon, CommentIcon } from './styles';

const EngagementBar = ({ post, onPostEdit }) => {
  const { isLiked, likes = 0, comments = [] } = post;

  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  const toggleLike = () => {
    onPostEdit({
      ...post,
      isLiked: !isLiked,
    });
  };

  const addComment = comment => {
    onPostEdit({
      ...post,
      comments: [
        ...comments,
        {
          id: Date.now(),
          replies: [],
          ...comment,
        },
      ],
    });
  };

  const editComment = updatedComment => {
    onPostEdit({
      ...post,
      comments: comments.map(comment =>
        comment.id === updatedComment.id ? updatedComment : comment,
      ),
    });
  };

  const totalLikes = likes + (isLiked ? 1 : 0);

  return (
    <EngagementBarContainer>
      <Counters>
        {!!totalLikes && <span>{toHumanString(totalLikes)} likes</span>}
        {!!comments.length && <span>{toHumanString(comments.length)} comments</span>}
      </Counters>
      <InteractionBar>
        <SecondaryButton onClick={toggleLike} active={isLiked}>
          <LikeIcon /> Like
        </SecondaryButton>
        <SecondaryButton onClick={open}>
          <CommentIcon /> Comment
        </SecondaryButton>
      </InteractionBar>
      {comments.map(comment => (
        <Comment key={comment.id} comment={comment} onEdit={editComment} />
      ))}
      {isOpen && <CommentComposeBar onSubmit={addComment} />}
    </EngagementBarContainer>
  );
};

export default customizableComponent('EngagementBar')(EngagementBar);
