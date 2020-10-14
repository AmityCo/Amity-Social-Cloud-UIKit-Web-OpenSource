/* eslint-disable import/no-cycle */
import React from 'react';
import PropTypes from 'prop-types';
import CommentLikeButton from '~/social/components/CommentLikeButton';
import CommentText from './CommentText';
import {
  Avatar,
  Content,
  CommentHeader,
  AuthorName,
  CommentDate,
  InteractionBar,
  ReplyIcon,
  ReplyButton,
  Options,
} from './styles';

const StyledComment = ({
  commentId,
  authorName,
  authorAvatar,
  createdAt,
  text,
  onClickReply,
  handleReportComment,
  isReplyComment = false,
}) => (
  <>
    <Avatar avatar={authorAvatar} />
    <Content>
      <CommentHeader>
        <AuthorName>{authorName}</AuthorName>
        <CommentDate date={createdAt} />
      </CommentHeader>
      <CommentText>{text}</CommentText>
      <InteractionBar>
        <CommentLikeButton commentId={commentId} />
        {!isReplyComment && (
          <ReplyButton onClick={onClickReply}>
            <ReplyIcon /> Reply
          </ReplyButton>
        )}
        <Options options={[{ name: 'Report comment', action: handleReportComment }]} />
      </InteractionBar>
    </Content>
  </>
);

StyledComment.propTypes = {
  commentId: PropTypes.string,
  authorName: PropTypes.string,
  authorAvatar: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date),
  text: PropTypes.string,
  onClickReply: PropTypes.func,
  handleReportComment: PropTypes.func,
  isReplyComment: PropTypes.bool,
};

export default StyledComment;
