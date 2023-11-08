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
  markup,
  onClickReply,
  handleReportComment,
  handleEdit,
  startEditing,
  cancelEditing,
  handleDelete,
  isEditing,
  onChange,
  queryMentionees,
  isReported,
  isReplyComment,
  isBanned,
  mentionees,
  metadata,
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
            <Truncate.Atom>
              {isBanned && <BanIcon css="margin-left: 0.265rem; margin-top: 1px;" />}
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
            <CommentEditTextarea
              multiline
              mentionAllowed
              value={markup}
              queryMentionees={queryMentionees}
              onChange={onChange}
            />
            <ButtonContainer>
              <Button data-qa-anchor="comment-cancel-edit-button" onClick={cancelEditing}>
                <FormattedMessage id="cancel" />
              </Button>
              <PrimaryButton
                data-qa-anchor="comment-save-edit-button"
                onClick={() => handleEdit(text)}
              >
                <FormattedMessage id="save" />
              </PrimaryButton>
            </ButtonContainer>
          </CommentEditContainer>
          <CommentText
            text={text}
            mentionees={mentionees}
            metadata={metadata}
            className={isReplyComment ? 'reply' : 'comment'}
          />
        </ConditionalRender>

        {!isEditing && (canLike || canReply || options.length > 0) && (
          <InteractionBar>
            {canLike && <CommentLikeButton commentId={commentId} />}

            {canReply && (
              <ReplyButton data-qa-anchor="comment-reply-button" onClick={onClickReply}>
                <ReplyIcon /> <FormattedMessage id="reply" />
              </ReplyButton>
            )}

            <OptionMenu
              data-qa-anchor="comment-options-button"
              options={options}
              pullRight={false}
              align={POSITION_LEFT}
            />
          </InteractionBar>
        )}
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
  markup: PropTypes.string,
  handleReportComment: PropTypes.func,
  handleEdit: PropTypes.func.isRequired,
  startEditing: PropTypes.func.isRequired,
  cancelEditing: PropTypes.func.isRequired,
  handleDelete: PropTypes.func.isRequired,
  mentionees: PropTypes.array,
  metadata: PropTypes.object,
  isEditing: PropTypes.bool,
  queryMentionees: PropTypes.func.isRequired,
  isReported: PropTypes.bool,
  isReplyComment: PropTypes.bool,
  isBanned: PropTypes.bool,
  onClickReply: PropTypes.func,
  onChange: PropTypes.func.isRequired,
};

export default StyledComment;
