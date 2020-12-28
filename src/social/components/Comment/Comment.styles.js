/* eslint-disable import/no-cycle */
import React from 'react';
import PropTypes from 'prop-types';

import { POSITION_LEFT } from '~/helpers/getCssPosition';
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
  OptionMenu,
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
  canDelete = false,
  canEdit = false,
  canLike = true,
  canReply = false,
  canReport = true,
  createdAt,
  updatedAt,
  text,
  onClickReply,
  handleReportComment,
  handleEdit,
  startEditing,
  cancelEditing,
  handleDelete,
  isEditing,
  setText,
}) => {
  const options = [
    canEdit && { name: 'Edit comment', action: startEditing },
    canReport && { name: 'Report comment', action: handleReportComment },
    canDelete && { name: 'Delete comment', action: handleDelete },
  ].filter(Boolean);

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

        <ConditionalRender
          condition={!isEditing && (canLike || (canReply && ENABLE_REPLIES) || options.length > 0)}
        >
          <InteractionBar>
            <ConditionalRender condition={canLike}>
              <CommentLikeButton commentId={commentId} />
            </ConditionalRender>

            <ConditionalRender condition={canReply}>
              <ReplyButton onClick={onClickReply}>
                <ReplyIcon /> Reply
              </ReplyButton>
            </ConditionalRender>
            <OptionMenu options={options} pullRight={false} align={POSITION_LEFT} />
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
  canDelete: PropTypes.bool,
  canEdit: PropTypes.bool,
  canLike: PropTypes.bool,
  canReply: PropTypes.bool,
  canReport: PropTypes.bool,
  createdAt: PropTypes.instanceOf(Date),
  updatedAt: PropTypes.instanceOf(Date),
  text: PropTypes.string,
  onClickReply: PropTypes.func,
  handleReportComment: PropTypes.func,
  handleEdit: PropTypes.func.isRequired,
  startEditing: PropTypes.func.isRequired,
  cancelEditing: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  setText: PropTypes.func.isRequired,
};

export default StyledComment;
