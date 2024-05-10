import React from 'react';

import { FormattedMessage } from 'react-intl';

import CommentText from './CommentText';

import { backgroundImage as UserImage } from '~/icons/User';

import { Mentioned, Metadata } from '~/v4/helpers/utils';
import { QueryMentioneesFnType } from '~/v4/chat/hooks/useMention';
import { formatTimeAgo } from '~/utils';
import { EllipsisH, FireIcon, HeartIcon, LikedIcon } from '~/icons';

import millify from 'millify';
import { FIRE_REACTION_KEY, LIKE_REACTION_KEY, LOVE_REACTION_KEY } from '~/constants';
import styles from './UIComment.module.css';
import InputText from '~/v4/core/components/InputText';
import { Avatar, Typography } from '~/v4/core/components';
import Button from '~/v4/core/components/Button/Button';
import clsx from 'clsx';

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
  reactionsCount: number;
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
  onClickReactionList: () => void;
}

const UIComment = ({
  authorName,
  authorAvatar,
  canLike = true,
  canReply = false,
  reactions = {},
  reactionsCount,
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
  onClickReactionList,
}: StyledCommentProps) => {
  return (
    <div className={styles.container}>
      <Avatar size="small" avatar={authorAvatar || UserImage} />
      <div className={styles.content}>
        <div className={styles.commentHeader}>
          <Typography.CaptionBold>{authorName}</Typography.CaptionBold>
        </div>

        {isEditing ? (
          <div className={styles.commentEditContainer}>
            <InputText
              className={clsx(styles.commentEditTextarea)}
              data-qa-anchor="edit_comment_component/text_field"
              multiline
              mentionAllowed
              value={markup}
              queryMentionees={queryMentionees}
              onChange={(data) => onChange?.(data)}
            />
            <div className={clsx(styles.buttonContainer)}>
              <Button
                variant="secondary"
                data-qa-anchor="edit_comment_component/cancel_button"
                onClick={cancelEditing}
              >
                <FormattedMessage id="cancel" />
              </Button>
              <Button
                variant="primary"
                data-qa-anchor="edit_comment_component/save_button"
                onClick={() => handleEdit?.(text)}
              >
                <FormattedMessage id="save" />
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <CommentText text={text} mentionees={mentionees} />
          </div>
        )}

        {!isEditing && (canLike || canReply || options.length > 0) && (
          <div className={styles.interactionBar}>
            <div className={styles.interactionWrapper}>
              <div className={styles.commentDate}>
                {formatTimeAgo(createdAt)}
                {(editedAt?.getTime() || 0) - (createdAt?.getTime() || 0) > 0 && (
                  <span className={clsx(styles.editedMark)}>
                    <FormattedMessage id="comment.edited" />
                  </span>
                )}
              </div>
              {canLike && (
                <Button
                  variant="ghost"
                  className={clsx(styles.likeButton, isLiked && styles.liked)}
                  onClick={handleLike}
                >
                  {!isLiked ? (
                    <FormattedMessage id="post.like" />
                  ) : (
                    <FormattedMessage id="post.liked" />
                  )}
                </Button>
              )}
              {canReply && (
                <Button
                  variant="ghost"
                  className={clsx(styles.commentInteractionButton)}
                  data-qa-anchor="comment-reply-button"
                  onClick={() => onClickReply?.(authorName, referenceType, referenceId, commentId)}
                >
                  <FormattedMessage id="reply" />
                </Button>
              )}

              <Button
                variant="ghost"
                className={clsx(styles.commentInteractionButton)}
                onClick={onClickOverflowMenu}
              >
                <EllipsisH width={20} height={20} />
              </Button>
            </div>
            {reactionsCount > 0 && (
              <Button
                className={clsx(styles.reactionListButton)}
                variant="ghost"
                onClick={onClickReactionList}
              >
                <div className={styles.reactionListButtonContainer}>
                  {millify(reactionsCount)}
                  <div className={styles.reactionsListButtonWrapper}>
                    {reactions[LIKE_REACTION_KEY] > 0 && (
                      <div className={clsx(styles.reactionIcon)}>
                        <LikedIcon />
                      </div>
                    )}
                    {reactions[LOVE_REACTION_KEY] > 0 && (
                      <div className={clsx(styles.reactionIcon)}>
                        <HeartIcon />
                      </div>
                    )}
                    {reactions[FIRE_REACTION_KEY] > 0 && (
                      <div className={clsx(styles.reactionIcon)}>
                        <FireIcon />
                      </div>
                    )}
                  </div>
                </div>
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UIComment;
