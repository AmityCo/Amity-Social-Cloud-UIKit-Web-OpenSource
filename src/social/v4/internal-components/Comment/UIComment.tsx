import React from 'react';
import Truncate from 'react-truncate-markup';
import { FormattedMessage } from 'react-intl';

import CommentText from './CommentText';

import { backgroundImage as UserImage } from '~/icons/User';
import BanIcon from '~/icons/Ban';

import {
  Avatar,
  Content,
  CommentHeader,
  AuthorName,
  InteractionBar,
  EditedMark,
  CommentInteractionButton,
  InteractionWrapper,
  ReactionsWrapper,
  LikeButton,
  CommentDate,
  CommentEditContainer,
  CommentEditTextarea,
  ButtonContainer,
} from './styles';

import { Mentioned, Metadata } from '~/helpers/utils';
import { QueryMentioneesFnType } from '~/social/hooks/useSocialMention';
import { formatTimeAgo } from '~/utils';
import { EllipsisH, LikedIcon } from '~/icons';
import { LIKE_REACTION_KEY } from '~/constants';
import { CommentEdition } from '~/social/v4/components/CommentEdition';
import { PrimaryButton, SecondaryButton } from '~/core/components/Button';

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
  onClickReply?: (
    replyTo?: string,
    referenceType?: Amity.Comment['referenceType'],
    referenceId?: Amity.Comment['referenceId'],
    commentId?: Amity.Comment['commentId'],
  ) => void;
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
  referenceType?: Amity.Comment['referenceType'];
  referenceId?: Amity.Comment['referenceId'];
}

const UIComment = ({
  authorName,
  authorAvatar,
  canLike = true,
  canReply = false,
  reactions = {},
  createdAt,
  editedAt,
  text,
  markup,
  onClickReply,
  onClickOverflowMenu,
  handleEdit,
  cancelEditing,
  handleLike,
  isEditing,
  onChange,
  queryMentionees,
  isBanned,
  isLiked,
  mentionees,
  options,
  referenceId,
  referenceType,
  commentId,
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
              data-qa-anchor="edit_comment_component/text_field"
              multiline
              mentionAllowed
              value={markup}
              queryMentionees={queryMentionees}
              onChange={(data) => onChange?.(data)}
            />
            <ButtonContainer>
              <SecondaryButton
                data-qa-anchor="edit_comment_component/cancel_button"
                onClick={cancelEditing}
              >
                <FormattedMessage id="cancel" />
              </SecondaryButton>
              <PrimaryButton
                data-qa-anchor="edit_comment_component/save_button"
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
                  onClick={() => onClickReply?.(authorName, referenceType, referenceId, commentId)}
                >
                  <FormattedMessage id="reply" />
                </CommentInteractionButton>
              )}

              <CommentInteractionButton onClick={onClickOverflowMenu}>
                <EllipsisH width={20} height={20} />
              </CommentInteractionButton>
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
