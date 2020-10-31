/* eslint-disable import/no-cycle */
import React, { useMemo } from 'react';
import PropTypes from 'prop-types';

import Button, { PrimaryButton } from '~/core/components/Button';
import CommentLikeButton from '~/social/components/CommentLikeButton';
import ConditionalRender from '~/core/components/ConditionalRender';
import CommentText from './CommentText';
import { backgroundImage as UserImage } from '~/icons/User';
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
  CommentEditContainer,
  CommentEditTextarea,
  ButtonContainer,
  EditedMark,
} from './styles';

// TODO: enable replies feature once working on all platforms.
import { ENABLE_REPLIES } from '.';

const StyledComment = ({
  commentId,
  authorName,
  authorAvatar,
  createdAt,
  updatedAt,
  text,
  onClickReply,
  handleReportComment,
  handleEdit,
  startEditing,
  cancelEditing,
  handleDelete,
  isReplyComment = false,
  isCommentOwner = false,
  isEditing,
  setText,
  isAdmin,
}) => {
  const MENU_ITEMS = useMemo(
    () => ({
      edit: { name: 'Edit comment', action: startEditing },
      report: { name: 'Report comment', action: handleReportComment },
      delete: { name: 'Delete comment', action: handleDelete },
    }),
    [],
  );

  const rules = {
    edit: isCommentOwner,
    report: !isCommentOwner,
    delete: isCommentOwner || isAdmin,
  };

  const options = Object.entries(rules)
    .filter(([, flag]) => flag)
    .map(([key]) => MENU_ITEMS[key]);

  return (
    <>
      <Avatar avatar={authorAvatar} backgroundImage={UserImage} />
      <Content>
        <CommentHeader>
          <AuthorName>{authorName}</AuthorName>
          <CommentDate date={createdAt} />
          <ConditionalRender condition={updatedAt - createdAt > 0}>
            <EditedMark>Edited</EditedMark>
          </ConditionalRender>
        </CommentHeader>
        <ConditionalRender condition={isEditing}>
          <CommentEditContainer>
            <CommentEditTextarea value={text} onChange={e => setText(e.target.value)} />
            <ButtonContainer>
              <Button onClick={cancelEditing}>Cancel</Button>
              <PrimaryButton onClick={() => handleEdit(text)}>Save</PrimaryButton>
            </ButtonContainer>
          </CommentEditContainer>
          <CommentText>{text}</CommentText>
        </ConditionalRender>
        <ConditionalRender condition={!isEditing}>
          <InteractionBar>
            <CommentLikeButton commentId={commentId} />
            <ConditionalRender condition={!isReplyComment && ENABLE_REPLIES}>
              <ReplyButton onClick={onClickReply}>
                <ReplyIcon /> Reply
              </ReplyButton>
            </ConditionalRender>
            <Options options={options} />
          </InteractionBar>
        </ConditionalRender>
      </Content>
    </>
  );
};

StyledComment.propTypes = {
  commentId: PropTypes.string,
  authorName: PropTypes.string,
  authorAvatar: PropTypes.string,
  createdAt: PropTypes.instanceOf(Date),
  updatedAt: PropTypes.instanceOf(Date),
  text: PropTypes.string,
  onClickReply: PropTypes.func,
  handleReportComment: PropTypes.func,
  handleEdit: PropTypes.func.isRequired,
  startEditing: PropTypes.func.isRequired,
  cancelEditing: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isReplyComment: PropTypes.bool,
  isCommentOwner: PropTypes.bool,
  isEditing: PropTypes.bool,
  setText: PropTypes.func.isRequired,
  isAdmin: PropTypes.bool,
};

export default StyledComment;
