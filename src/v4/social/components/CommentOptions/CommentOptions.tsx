import React from 'react';
import { useCommentFlaggedByMe } from '~/v4/social/hooks/useCommentFlaggedByMe';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import useCommentPermission from '~/social/hooks/useCommentPermission';
import useSDK from '~/v4/core/hooks/useSDK';
import { Typography } from '~/v4/core/components';
import { isNonNullable } from '~/v4/helpers/utils';
import { FlagIcon, PenIcon, TrashIcon } from '~/v4/social/icons';
import styles from './CommentOptions.module.css';

interface CommentOptionsProps {
  pageId?: string;
  componentId?: string;
  comment: Amity.Comment;
  handleEditComment: () => void;
  handleDeleteComment: () => void;
  onCloseBottomSheet: () => void;
}

export const CommentOptions = ({
  pageId = '*',
  componentId = '*',
  comment,
  handleEditComment,
  handleDeleteComment,
  onCloseBottomSheet,
}: CommentOptionsProps) => {
  const { userRoles } = useSDK();
  const { toggleFlagComment, isFlaggedByMe } = useCommentFlaggedByMe(comment.commentId);

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
          icon: <PenIcon className={styles.commentOptions__actionButton__icon} />,
          accessibilityId: 'edit_comment',
        }
      : null,
    canReport
      ? {
          name: isFlaggedByMe ? 'Unreport comment' : 'Report comment',
          action: handleReportComment,
          icon: <FlagIcon className={styles.commentOptions__actionButton__icon} />,
          accessibilityId: 'report_comment',
        }
      : null,
    canDelete
      ? {
          name: 'Delete comment',
          action: handleDeleteComment,
          icon: <TrashIcon className={styles.commentOptions__actionButton__icon} />,
          accessibilityId: 'delete_comment',
        }
      : null,
  ].filter(isNonNullable);

  return (
    <>
      {options.map((option, index) => (
        <div
          data-qa-anchor={`${pageId}/${componentId}/${option.accessibilityId}`}
          className={styles.commentOptions__actionButton}
          key={index}
          onClick={() => {
            onCloseBottomSheet();
            option.action();
          }}
        >
          {option.icon}
          <div className={styles.commentOptions__actionButton__text}>
            <Typography.BodyBold>{option.name}</Typography.BodyBold>
          </div>
        </div>
      ))}
    </>
  );
};
