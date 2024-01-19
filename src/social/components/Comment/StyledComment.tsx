/* eslint-disable import/no-cycle */
import React from 'react';
import Truncate from 'react-truncate-markup';
import { FormattedMessage, useIntl } from 'react-intl';

import { POSITION_LEFT } from '~/helpers/getCssPosition';
import Button, { PrimaryButton } from '~/core/components/Button';
import CommentLikeButton from '~/social/components/CommentLikeButton';
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
import { Mentioned, Metadata, isNonNullable } from '~/helpers/utils';
import { QueryMentioneesFnType } from '~/social/hooks/useSocialMention';

interface StyledCommentProps {
  commentId?: string;
  authorName?: string;
  authorAvatar?: string;
  canDelete?: boolean;
  canEdit?: boolean;
  canLike?: boolean;
  canReply?: boolean;
  canReport?: boolean;
  createdAt?: Date;
  editedAt?: Date;
  text?: string;
  markup?: string;
  onClickReply?: () => void;
  handleReportComment?: () => void;
  handleEdit?: (text?: string) => void;
  startEditing: () => void;
  cancelEditing: () => void;
  handleDelete: () => void;
  isEditing?: boolean;
  onChange: (data: {
    text: string;
    plainText: string;
    lastMentionText?: string | undefined;
    mentions: {
      plainTextIndex: number;
      id: string;
      display: string;
    }[];
  }) => void;
  queryMentionees: QueryMentioneesFnType;
  isReported?: boolean;
  isReplyComment?: boolean;
  isBanned?: boolean;
  mentionees?: Mentioned[];
  metadata?: Metadata;
}

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
}: StyledCommentProps) => {
  const { formatMessage } = useIntl();
  const options = [
    canEdit
      ? {
          name: isReplyComment
            ? formatMessage({ id: 'reply.edit' })
            : formatMessage({ id: 'comment.edit' }),
          action: startEditing,
        }
      : null,
    canReport
      ? {
          name: isReported
            ? formatMessage({ id: 'report.undoReport' })
            : formatMessage({ id: 'report.doReport' }),
          action: handleReportComment,
        }
      : null,
    canDelete
      ? {
          name: isReplyComment
            ? formatMessage({ id: 'reply.delete' })
            : formatMessage({ id: 'comment.delete' }),
          action: handleDelete,
        }
      : null,
  ].filter(isNonNullable);

  return (
    <>
      <Avatar avatar={authorAvatar} backgroundImage={UserImage} />
      <Content>
        <Truncate
          ellipsis={
            <span>
              ...
              <CommentDate date={createdAt?.getTime()} />
              {(editedAt?.getTime() || 0) - (createdAt?.getTime() || 0) > 0 && (
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
              <>
                {isBanned && (
                  <BanIcon
                    style={{
                      marginLeft: '0.265rem',
                      marginTop: '1px',
                    }}
                  />
                )}
                <CommentDate date={createdAt?.getTime()} />
                {(editedAt?.getTime() || 0) - (createdAt?.getTime() || 0) > 0 && (
                  <EditedMark>
                    <FormattedMessage id="comment.edited" />
                  </EditedMark>
                )}
              </>
            </Truncate.Atom>
          </CommentHeader>
        </Truncate>

        {isEditing ? (
          <CommentEditContainer>
            <CommentEditTextarea
              multiline
              mentionAllowed
              value={markup}
              queryMentionees={queryMentionees}
              onChange={(data) => onChange?.(data)}
            />
            <ButtonContainer>
              <Button data-qa-anchor="comment-cancel-edit-button" onClick={cancelEditing}>
                <FormattedMessage id="cancel" />
              </Button>
              <PrimaryButton
                data-qa-anchor="comment-save-edit-button"
                onClick={() => handleEdit?.(text)}
              >
                <FormattedMessage id="save" />
              </PrimaryButton>
            </ButtonContainer>
          </CommentEditContainer>
        ) : (
          <CommentText text={text} mentionees={mentionees} />
        )}

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

export default StyledComment;
