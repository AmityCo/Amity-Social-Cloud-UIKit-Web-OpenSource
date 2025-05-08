import React, { useState } from 'react';
import { useCommentFlaggedByMe } from '~/v4/social/hooks/useCommentFlaggedByMe';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import useCommentPermission from '~/social/hooks/useCommentPermission';
import useSDK from '~/v4/core/hooks/useSDK';
import { Typography } from '~/v4/core/components';
import { isNonNullable } from '~/v4/helpers/utils';
import { FlagIcon, TrashIcon } from '~/v4/social/icons';
import { CreatePost } from '~/v4/icons/CreatePost';
import { ContentReportReason } from '~/v4/social/internal-components/ContentReportReason';
import { ContentFlagReasonEnum } from '@amityco/ts-sdk';
import styles from './CommentOptions.module.css';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

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
  const [reasonReport, setReasonReport] = useState<Amity.ContentFlagReason>(
    ContentFlagReasonEnum.Others,
  );

  const isReplyComment = comment.parentId != null;

  const { openPopup } = usePopupContext();
  const { isDesktop } = useResponsive();

  const [isShowReportReason, setIsShowReportReason] = useState(false);

  const { isFlaggedByMe, mutateUnreportComment } = useCommentFlaggedByMe({
    commentId: comment.commentId,
    reasonReport,
    isReplyComment,
  });

  // TODO: change to useCommentPermission v4 - remove readonly
  const { canDelete, canEdit, canReport } = useCommentPermission(comment, false, userRoles);
  useNotifications();

  const handleClickReportComment = () => {
    if (isDesktop) {
      onCloseMenu();
      openPopup({
        pageId,
        view: 'desktop',
        isDismissable: false,
        children: (
          <ContentReportReason
            pageId={pageId}
            componentId={componentId}
            comment={comment}
            showReportPostButton={false}
            onCloseMenu={onCloseMenu}
          />
        ),
      });
    } else {
      setIsShowReportReason(true);
    }
  };

  const handleClickUnReportComment = () => {
    onCloseMenu();
    mutateUnreportComment();
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
          action: isFlaggedByMe ? handleClickUnReportComment : handleClickReportComment,
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
      {!isShowReportReason &&
        options.map((option, index) => (
          <div
            data-testid={`${pageId}/${componentId}/${option.accessibilityId}`}
            className={styles.commentOptions__actionButton}
            key={index}
            onClick={() => {
              option.action();
            }}
          >
            {option.icon}
            <div className={option.textStyle}>
              <Typography.BodyBold>{option.name}</Typography.BodyBold>
            </div>
          </div>
        ))}

      {isShowReportReason && (
        <ContentReportReason
          pageId={pageId}
          componentId={componentId}
          className={styles.commentOptions__reportReason}
          comment={comment}
          showReportPostButton={false}
          onCloseMenu={onCloseMenu}
        />
      )}
    </>
  );
};
