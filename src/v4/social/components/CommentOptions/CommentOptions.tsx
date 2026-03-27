import React, { useState } from 'react';
import { useCommentFlaggedByMe } from '~/v4/social/hooks/useCommentFlaggedByMe';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import useCommentPermission from '~/social/hooks/useCommentPermission';
import useSDK from '~/v4/core/hooks/useSDK';
import { Typography } from '~/v4/core/components';
import { isNonNullable } from '~/v4/helpers/utils';
import { FlagIcon, TrashIcon } from '~/v4/social/icons';
import { CreatePost } from '~/v4/icons/CreatePost';
import { ContentReportReason } from '~/v4/core/internal-components/ContentReportReason';
import { ContentFlagReasonEnum } from '@amityco/ts-sdk';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import UnFlag from '~/v4/icons/UnFlag';
import styles from './CommentOptions.module.css';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';

interface CommentOptionsProps {
  pageId?: string;
  componentId?: string;
  community?: Amity.Community | null;
  comment: Amity.Comment;
  handleEditComment: () => void;
  handleDeleteComment: () => void;
  onCloseMenu: () => void;
}

export const CommentOptions = ({
  pageId = '*',
  componentId = '*',
  community,
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
  const { page } = useNavigation();
  const { isDesktop } = useResponsive();
  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();

  const [isShowReportReason, setIsShowReportReason] = useState(false);

  const { isFlaggedByMe, mutateUnreportComment } = useCommentFlaggedByMe({
    commentId: comment.commentId,
    reasonReport,
    isReplyComment,
  });

  // TODO: change to useCommentPermission v4 - remove readonly
  const { canDelete, canEdit, canReport } = useCommentPermission(comment, false, userRoles);
  useNotifications();

  const onClickReportComment = () => {
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

  const handleClickReportComment = () => {
    if (community)
      return handleCommunityProfileBehavior({
        defaultBehavior: () => onClickReportComment(),
        defaultCallback: onCloseMenu,
        allowNonMember: false,
        alignment: page.type === PageTypes.ViewStoryPage ? 'fullscreen' : 'withSidebar',
        isJoined: community?.isJoined,
      });

    handleUserProfileBehavior({
      alignment: page.type === PageTypes.ViewStoryPage ? 'fullscreen' : 'withSidebar',
      defaultCallback: onCloseMenu,
      defaultBehavior: () => onClickReportComment(),
      allowNonFollower: true,
    });
  };

  const handleClickUnReportComment = () => {
    onCloseMenu();
    mutateUnreportComment();
  };

  const options = [
    canEdit
      ? {
          name: isReplyComment ? 'Edit reply' : 'Edit comment',
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
          icon: isFlaggedByMe ? (
            <UnFlag className={styles.commentOptions__actionButton__icon} />
          ) : (
            <FlagIcon className={styles.commentOptions__actionButton__icon} />
          ),
          accessibilityId: 'report_comment',
          textStyle: styles.commentOptions__actionButton__text,
        }
      : null,
    canDelete
      ? {
          name: isReplyComment ? 'Delete reply' : 'Delete comment',
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
            onClick={(e) => {
              e.stopPropagation();
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
