import React, { useState } from 'react';
import Truncate from 'react-truncate-markup';

import { customizableComponent } from 'hocs/customization';

import Linkify from 'components/Linkify';
import { notification } from 'components/Notification';

import {
  Avatar,
  CommentComposeBar,
  Content,
  CommentBlock,
  CommentContainer,
  ReplyContainer,
  CommentHeader,
  CommentContent,
  AuthorName,
  CommentDate,
  ReadMoreButton,
  InteractionBar,
  LikeIcon,
  LikeButton,
  SolidLikeIcon,
  ReplyIcon,
  ReplyButton,
  Options,
} from './styles';

const COMMENT_MAX_LINES = 8;

const onReportClick = () =>
  notification.success({
    content: 'Report Sent',
  });

const CommentText = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  return (
    <Linkify>
      {isExpanded ? (
        <CommentContent>{children}</CommentContent>
      ) : (
        <Truncate
          lines={COMMENT_MAX_LINES}
          ellipsis={<ReadMoreButton onClick={expand}>...Read more</ReadMoreButton>}
        >
          <CommentContent>{children}</CommentContent>
        </Truncate>
      )}
    </Linkify>
  );
};

const ReplyComment = ({
  className,
  comment,
  comment: { author, createdAt, text, isLiked, likes = 0 },
  onEdit,
}) => {
  const toggleLike = () => {
    onEdit({
      ...comment,
      isLiked: !isLiked,
    });
  };

  const totalLikes = likes + (isLiked ? 1 : 0);

  return (
    <ReplyContainer className={className}>
      <Avatar avatar={author.avatar} />
      <Content>
        <CommentHeader>
          <AuthorName>{author.name}</AuthorName>
          <CommentDate date={createdAt} />
        </CommentHeader>
        <CommentText>{text}</CommentText>
        <InteractionBar>
          <LikeButton onClick={toggleLike} active={isLiked}>
            {isLiked ? <SolidLikeIcon /> : <LikeIcon />} {!!totalLikes && totalLikes}
          </LikeButton>
          <Options options={[{ name: 'Report comment', action: onReportClick }]} />
        </InteractionBar>
      </Content>
    </ReplyContainer>
  );
};

const Comment = ({
  className,
  comment,
  comment: { author, createdAt, replies, text, isLiked, likes = 0 },
  onEdit,
}) => {
  const [userToReply, setUserToReply] = useState(null);
  const handleReply = user => setUserToReply(user);

  const toggleLike = () => {
    onEdit({
      ...comment,
      isLiked: !isLiked,
    });
  };

  const addReply = replyComment => {
    onEdit({
      ...comment,
      replies: [
        ...comment.replies,
        {
          id: Date.now(),
          ...replyComment,
        },
      ],
    });
  };

  const editReply = updatedReply => {
    onEdit({
      ...comment,
      replies: replies.map(reply => (reply.id === updatedReply.id ? updatedReply : reply)),
    });
  };

  const totalLikes = likes + (isLiked ? 1 : 0);

  return (
    <CommentBlock>
      <CommentContainer className={className}>
        <Avatar avatar={author.avatar} />
        <Content>
          <CommentHeader>
            <AuthorName>{author.name}</AuthorName>
            <CommentDate date={createdAt} />
          </CommentHeader>
          <CommentText>{text}</CommentText>
          <InteractionBar>
            <LikeButton onClick={toggleLike} active={isLiked}>
              {isLiked ? <SolidLikeIcon /> : <LikeIcon />} {!!totalLikes && totalLikes}
            </LikeButton>
            <ReplyButton onClick={() => handleReply(author)}>
              <ReplyIcon /> Reply
            </ReplyButton>
            <Options options={[{ name: 'Report comment', action: onReportClick }]} />
          </InteractionBar>
        </Content>
      </CommentContainer>
      {replies.map(reply => (
        <ReplyComment key={reply.id} comment={reply} onEdit={editReply} />
      ))}
      {userToReply && <CommentComposeBar userToReply={userToReply} onSubmit={addReply} />}
    </CommentBlock>
  );
};

export default customizableComponent('Comment')(Comment);
