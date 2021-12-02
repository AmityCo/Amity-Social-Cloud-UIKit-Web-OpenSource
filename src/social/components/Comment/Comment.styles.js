/* eslint-disable import/no-cycle */
import React from 'react';
import Truncate from 'react-truncate-markup';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { POSITION_LEFT } from '~/helpers/getCssPosition';
import Button, { PrimaryButton } from '~/core/components/Button';
import CommentLikeButton from '~/social/components/CommentLikeButton';
import ConditionalRender from '~/core/components/ConditionalRender';
import CommentText from './CommentText';

import { backgroundImage as UserImage } from '~/icons/User';
import BanIcon from '~/icons/Ban';

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
  editedAt,
  text,
  onClickReply,
  handleReportComment,
  handleEdit,
  startEditing,
  cancelEditing,
  handleDelete,
  isEditing,
  setText,
  isReported,
  isReplyComment,
  isBanned,
}) => {
  const options = [
    canEdit && { name: isReplyComment ? 'reply.edit' : 'comment.edit', action: startEditing },
    canReport && {
      name: isReported ? 'report.undoReport' : 'report.doReport',
      action: handleReportComment,
    },
    canDelete && { name: isReplyComment ? 'reply.delete' : 'comment.delete', action: handleDelete },
  ].filter(Boolean);

  return (
    <>
      <Avatar avatar={authorAvatar} backgroundImage={UserImage} />
      <Content>
        <Truncate
          ellipsis={
            <span>
              ...
              <CommentDate date={createdAt} />
              {editedAt - createdAt > 0 && (
                <EditedMark>
                  <FormattedMessage id="comment.edited" />
                </EditedMark>
              )}
            </span>
          }
          lines={2}
        >
          <CommentHeader>
            <AuthorName>{authorName}</AuthorName>
            {isBanned && <BanIcon css="margin-left: 0.265rem; margin-top: 1px;" />}
            <Truncate.Atom>
              <CommentDate date={createdAt} />
              {editedAt - createdAt > 0 && (
                <EditedMark>
                  <FormattedMessage id="comment.edited" />
                </EditedMark>
              )}
            </Truncate.Atom>
          </CommentHeader>
        </Truncate>

        <ConditionalRender condition={isEditing}>
          <CommentEditContainer>
            <CommentEditTextarea value={text} onChange={e => setText(e.target.value)} />
            <ButtonContainer>
              <Button onClick={cancelEditing}>
                <FormattedMessage id="cancel" />
              </Button>
              <PrimaryButton onClick={() => handleEdit(text)}>
                <FormattedMessage id="save" />
              </PrimaryButton>
            </ButtonContainer>
          </CommentEditContainer>
          <CommentText>{text}</CommentText>
        </ConditionalRender>

        <ConditionalRender condition={!isEditing && (canLike || canReply || options.length > 0)}>
          <InteractionBar>
            <ConditionalRender condition={canLike}>
              <CommentLikeButton commentId={commentId} />
            </ConditionalRender>

            <ConditionalRender condition={canReply}>
              <ReplyButton onClick={onClickReply}>
                <ReplyIcon /> <FormattedMessage id="reply" />
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
  editedAt: PropTypes.instanceOf(Date),
  text: PropTypes.string,
  onClickReply: PropTypes.func,
  handleReportComment: PropTypes.func,
  handleEdit: PropTypes.func.isRequired,
  startEditing: PropTypes.func.isRequired,
  cancelEditing: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  isEditing: PropTypes.bool,
  setText: PropTypes.func.isRequired,
  isReported: PropTypes.bool,
  isReplyComment: PropTypes.bool,
  isBanned: PropTypes.bool,
};

export default StyledComment;
