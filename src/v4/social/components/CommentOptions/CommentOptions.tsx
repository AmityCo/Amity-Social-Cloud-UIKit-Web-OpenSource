import React from 'react';
import { useCommentFlaggedByMe } from '~/v4/social/hooks/useCommentFlaggedByMe';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import useCommentPermission from '~/social/hooks/useCommentPermission';
import useSDK from '~/v4/core/hooks/useSDK';
import { Typography } from '~/v4/core/components';
import { isNonNullable } from '~/v4/helpers/utils';
import { FlagIcon, TrashIcon } from '~/v4/social/icons';
import styles from './CommentOptions.module.css';
import { CreatePost } from '~/v4/icons/CreatePost';

interface CommentOptionsProps {
  pageId?: string;
  componentId?: string;
  comment: Amity.Comment;
  handleEditComment: () => void;
  handleDeleteComment: () => void;
  onCloseMenu: () => void;
}

export const CommentOptions = ({
  pageId = '*',
  componentId = '*',
  comment,
  handleEditComment,
  handleDeleteComment,
  onCloseMenu,
}: CommentOptionsProps) => {
  const { userRoles } = useSDK();
  const { toggleFlagComment, isFlaggedByMe } = useCommentFlaggedByMe(comment.commentId);
  const isReplyComment = comment.parentId != null;

  // TODO: change to useCommentPermission v4 - remove readonly
  const { canDelete, canEdit, canReport } = useCommentPermission(comment, false, userRoles);
  const notification = useNotifications();

  const handleReportComment = async () => {
    try {
      await toggleFlagComment({
        onFlagSuccess: () =>
          notification.success({
            content: 'Report sent',
          }),
        onUnFlagSuccss: () =>
          notification.success({
            content: 'Unreport sent',
          }),
      });
    } catch (err) {
      if (err instanceof Error) {
        notification.error({
          content: err.message,
        });
      }
    }
  };

  const options = [
    canEdit
      ? {
          name: 'Edit comment',
          action: handleEditComment,
          icon: <CreatePost className={styles.commentOptions__actionButton__icon} />,
          accessibilityId: 'edit_comment',
          textStyle: styles.commentOptions__actionButton__text,
        }
      : null,
    canReport
      ? {
          name: isFlaggedByMe
            ? isReplyComment
              ? 'Unreport reply'
              : 'Unreport comment'
            : isReplyComment
              ? 'Report reply'
              : 'Report comment',
          action: handleReportComment,
          icon: <FlagIcon className={styles.commentOptions__actionButton__icon} />,
          accessibilityId: 'report_comment',
          textStyle: styles.commentOptions__actionButton__text,
        }
      : null,
    canDelete
      ? {
          name: 'Delete comment',
          action: handleDeleteComment,
          icon: <TrashIcon className={styles.commentOptions__deleteButton__icon} />,
          accessibilityId: 'delete_comment',
          textStyle: styles.commentOptions__deleteButton__text,
        }
      : null,
  ].filter(isNonNullable);

  return (
    <>
      {options.map((option, index) => (
        <div
          data-testid={`${pageId}/${componentId}/${option.accessibilityId}`}
          className={styles.commentOptions__actionButton}
          key={index}
          onClick={() => {
            onCloseMenu();
            option.action();
          }}
        >
          {option.icon}
          <div className={option.textStyle}>
            <Typography.BodyBold>{option.name}</Typography.BodyBold>
          </div>
        </div>
      ))}
    </>
  );
};
