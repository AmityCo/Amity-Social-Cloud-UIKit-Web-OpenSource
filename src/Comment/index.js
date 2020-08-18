import React, { useState, useEffect } from 'react';
import Truncate from 'react-truncate-markup';

import { customizableComponent } from '../hoks/customization';

import Linkify from '../commonComponents/Linkify';
import { SecondaryButton } from '../commonComponents/Button';

import Files from '../Files';
import Images from '../Images';

import {
  Avatar,
  Content,
  CommentContainer,
  CommentHeader,
  CommentContent,
  AuthorName,
  CommentDate,
  CommentInfo,
  ReadMoreButton,
  InteractionBar,
  LikeIcon,
  SolidLikeIcon,
} from './styles';

const COMMENT_MAX_LINES = 8;

const Comment = ({ className, comment, comment: { author, text, isLiked, likes = 0 }, onEdit }) => {
  const toggleLike = () => {
    onEdit({
      ...comment,
      isLiked: !isLiked,
    });
  };

  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  const totalLikes = likes + (isLiked ? 1 : 0);

  return (
    <CommentContainer className={className}>
      <Avatar />
      <Content>
        <CommentHeader>
          <AuthorName>{author.name}</AuthorName>
          <CommentDate>• Just now</CommentDate>
        </CommentHeader>
        <Linkify>
          {isExpanded ? (
            <CommentContent>{text}</CommentContent>
          ) : (
            <Truncate
              lines={COMMENT_MAX_LINES}
              ellipsis={<ReadMoreButton onClick={expand}>...Read more</ReadMoreButton>}
            >
              <CommentContent>{text}</CommentContent>
            </Truncate>
          )}
        </Linkify>
        <InteractionBar>
          <SecondaryButton onClick={toggleLike} active={isLiked}>
            {isLiked ? <SolidLikeIcon /> : <LikeIcon />} {!!totalLikes && totalLikes}
          </SecondaryButton>
        </InteractionBar>
      </Content>
    </CommentContainer>
  );
};

export default customizableComponent('Comment')(Comment);
