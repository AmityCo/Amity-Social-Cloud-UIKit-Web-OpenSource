import React from 'react';
import Truncate from 'react-truncate-markup';
import { FormattedMessage } from 'react-intl';

import Button, { PrimaryButton } from '~/core/components/Button';

import CommentText from './CommentText';

import { backgroundImage as UserImage } from '~/icons/User';
import BanIcon from '~/icons/Ban';

import {
  Avatar,
  Content,
  CommentHeader,
  AuthorName,
  InteractionBar,
  CommentEditContainer,
  CommentEditTextarea,
  ButtonContainer,
  EditedMark,
  CommentInteractionButton,
  InteractionWrapper,
  ReactionsWrapper,
  LikeButton,
  CommentDate,
} from './styles';

import { Mentioned, Metadata } from '~/helpers/utils';
import { QueryMentioneesFnType } from '~/social/hooks/useSocialMention';
import { OverflowMenu } from '../../pages/story/ViewStoriesPage';
import { formatTimeAgo } from '~/utils';
import { LikedIcon } from '~/icons';
import { LIKE_REACTION_KEY } from '~/constants';

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
  reactions: Record<string, number>;
  onClickReply?: () => void;
  onClickOverflowMenu: () => void;
  handleReportComment?: () => void;
  handleEdit?: (text?: string) => void;
  handleLike?: () => void;
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
  isLiked?: boolean;
  isReported?: boolean;
  isReplyComment?: boolean;
  isBanned?: boolean;
  mentionees?: Mentioned[];
  metadata?: Metadata;
  options: {
    name: string;
    action: () => void;
    icon: React.ReactNode;
  }[];
}

const UIComment = ({
  authorName,
  authorAvatar,
  canDelete = false,
  canEdit = false,
  canLike = true,
  canReply = false,
  canReport = true,
  reactions = {},
  createdAt,
  editedAt,
  text,
  markup,
  onClickReply,
  onClickOverflowMenu,
  handleReportComment,
  handleEdit,
  startEditing,
  cancelEditing,
  handleDelete,
  handleLike,
  isEditing,
  onChange,
  queryMentionees,
  isReported,
  isReplyComment,
  isBanned,
  isLiked,
  mentionees,
  options,
}: StyledCommentProps) => {
  return (
    <>
      <Avatar avatar={authorAvatar} backgroundImage={UserImage} />
      <Content>
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
            </>
          </Truncate.Atom>
        </CommentHeader>

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
            <InteractionWrapper>
              <CommentDate>
                {formatTimeAgo(createdAt)}
                {(editedAt?.getTime() || 0) - (createdAt?.getTime() || 0) > 0 && (
                  <EditedMark>
                    <FormattedMessage id="comment.edited" />
                  </EditedMark>
                )}
              </CommentDate>
              {canLike && (
                <LikeButton isLiked={isLiked} onClick={handleLike}>
                  {!isLiked ? (
                    <FormattedMessage id="post.like" />
                  ) : (
                    <FormattedMessage id="post.liked" />
                  )}
                </LikeButton>
              )}
              {canReply && (
                <CommentInteractionButton
                  data-qa-anchor="comment-reply-button"
                  onClick={onClickReply}
                >
                  <FormattedMessage id="reply" />
                </CommentInteractionButton>
              )}

              <OverflowMenu onClick={onClickOverflowMenu} />
            </InteractionWrapper>
            <ReactionsWrapper>
              {Number(reactions[LIKE_REACTION_KEY as keyof typeof reactions]) > 0 && (
                <>
                  {reactions[LIKE_REACTION_KEY as keyof typeof reactions] || 0}
                  <LikedIcon />
                </>
              )}
            </ReactionsWrapper>
          </InteractionBar>
        )}
      </Content>
    </>
  );
};

export default UIComment;
