import React, { useMemo, useState } from 'react';
import { useString, resolveString } from '~/v4/core/localization';
import { ContentFlagReasonEnum, PollRepository, PostRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { usePostPermissions } from '~/v4/core/hooks/usePostPermissions';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { Button } from '~/v4/core/natives/Button';
import { usePostFlaggedByMe } from '~/v4/core/hooks/usePostFlaggedByMe';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { Mode, PostComposerPage } from '~/v4/social/pages/PostComposerPage';
import { Typography } from '~/v4/core/components';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { EditPostTitle } from '~/v4/social/elements/EditPostTitle';
import FlagIcon from '~/v4/icons/Flag';
import { TrashIcon } from '~/v4/icons/Trash';
import styles from './PostMenu.module.css';
import { ClosePollIcon } from '~/v4/icons/ClosePoll';
import UnFlag from '~/v4/icons/UnFlag';
import { ContentReportReason } from '~/v4/core/internal-components/ContentReportReason/ContentReportReason';
import useSDK from '~/v4/core/hooks/useSDK';
import { checkDeleteCommunityPostPermission } from '~/v4/social/utils';
import { CopyLinkButton } from '~/v4/social/elements/CopyLinkButton';
import { SharableModel } from '~/v4/utils/sharableLink';
import useCommunityProfileGlobalBehavior from '~/v4/core/hooks/useCommunityProfileGlobalBehavior';
import useUserProfileGlobalBehavior from '~/v4/core/hooks/useUserProfileGlobalBehavior';
import { Pencil } from '~/v4/icons/Pencil';

interface PostMenuProps {
  post: Amity.Post;
  community?: Amity.Community | null;
  pageId?: string;
  componentId?: string;
  elementId?: string;
  onCloseMenu: () => void;
  onConfirmEditPost?: ({ onConfirm }: { onConfirm: () => void }) => void;
  onPostDeleted?: (post: Amity.Post) => void;
  onPollClosed?: () => void;
  isSearchPost?: boolean;
  sharableLink?: string;
}

export const PostMenu = ({
  post,
  community,
  pageId = '*',
  componentId = '*',
  onConfirmEditPost,
  onCloseMenu,
  onPostDeleted,
  onPollClosed,
  isSearchPost = false,
  sharableLink,
}: PostMenuProps) => {
  const { success, info } = useNotifications();
  const { isDesktop } = useResponsive();
  const { openPopup } = usePopupContext();
  const { client } = useSDK();

  const { handleCommunityProfileBehavior } = useCommunityProfileGlobalBehavior();
  const { handleUserProfileBehavior } = useUserProfileGlobalBehavior();

  const poll = post?.childrenPosts?.[0]?.getPollInfo();
  const isLiveStreamPost = post?.childrenPosts?.[0]?.dataType === 'room';

  const [isShowReportReason, setIsShowReportReason] = useState(false);

  const { isCommunityModerator, isOwner } = usePostPermissions({ post, community });
  const { AmityPostContentComponentBehavior } = usePageBehavior();

  const { showEditPostButton, showDeletePostButton, showReportPostButton } = useMemo(() => {
    if (isCommunityModerator) {
      if (isOwner) {
        return {
          showEditPostButton: true,
          showDeletePostButton: true,
          showReportPostButton: false,
        };
      } else {
        return {
          showEditPostButton: false,
          showDeletePostButton: true,
          showReportPostButton: true,
        };
      }
    } else {
      if (isOwner && !isSearchPost) {
        return {
          showEditPostButton: true,
          showDeletePostButton: true,
          showReportPostButton: false,
        };
      } else if (isOwner && isSearchPost) {
        return {
          showEditPostButton: false,
          showDeletePostButton: true,
          showReportPostButton: false,
        };
      } else if (checkDeleteCommunityPostPermission(client, post?.targetType)) {
        return {
          showEditPostButton: false,
          showDeletePostButton: true,
          showReportPostButton: true,
        };
      } else {
        return {
          showEditPostButton: false,
          showDeletePostButton: false,
          showReportPostButton: true,
        };
      }
    }
  }, [isCommunityModerator, isOwner, client, post, isSearchPost, community?.isJoined]);

  const closePollTitle = useString('amity_social_button_close_poll');
  const postUnreportedText = useString('amity_social_button_post_unreported');
  const postUnreportFailedText = useString('amity_social_toast_post_unreport_failed');
  const postDeletedText = useString('amity_social_button_post_deleted');
  const deletePostFailedText = useString('amity_social_toast_delete_post_failed');
  const pollClosedText = useString('amity_social_poll_closed');
  const failedGenericText = useString('amity_social_toast_failed_generic');
  const deletePostTitleText = useString('amity_social_button_delete_post_title');
  const deletePostWarningText = useString('amity_social_button_delete_post_warning_message');
  const cancelText = useString('amity_social_button_cancel');
  const deleteText = useString('amity_common_button_delete');
  const closePollDialogTitleText = useString('amity_social_modal_dialog_title_close_poll');
  const unreportPostText = useString('amity_social_button_unreport_post');
  const reportPostText = useString('amity_social_button_report_post');
  const editPostTitleText = useString('amity_social_label_post_composer_edit_title');
  const deletePostText = useString('amity_social_button_delete_post');

  const showClosePollButton = useMemo(() => {
    if (poll && poll.status === 'open' && isOwner) return true;
    return false;
  }, [isOwner, poll]);

  const showCopyLinkButton = useMemo(() => {
    if (!sharableLink) return false;
    if (post.targetType === 'user') return false;
    if (community?.isPublic && !community?.isJoined) return true;
    if (community?.isPublic && community?.isJoined) return false;
  }, [post.targetType, community?.isJoined, community?.isPublic]);

  const isPollPost = useMemo(() => {
    return !!poll;
  }, [poll]);

  const { isFlaggedByMe, isLoading, mutateUnReportPost } = usePostFlaggedByMe({
    post,
    reasonReport: ContentFlagReasonEnum.Others,
    isFlaggable: showReportPostButton,

    onUnreportSuccess: () => {
      success({ content: postUnreportedText });
      onCloseMenu();
    },
    onUnreportError: () => {
      info({
        content: postUnreportFailedText,
        alignment: isDesktop ? 'fullscreen' : 'withSidebar',
      });
      onCloseMenu();
    },
  });

  const { confirm } = useConfirmContext();

  const { mutateAsync: mutateDeletePost } = useMutation({
    networkMode: 'always',
    mutationFn: async () => {
      onCloseMenu();
      return PostRepository.softDeletePost(post.postId);
    },
    onSuccess: () => {
      success({ content: postDeletedText });
      onPostDeleted?.(post);
    },
    onError: () => {
      info({
        content: deletePostFailedText,
        alignment: isDesktop ? 'fullscreen' : 'withSidebar',
      });
    },
  });

  const { mutateAsync: mutateClosePoll } = useMutation({
    networkMode: 'always',
    mutationFn: async () => {
      if (!poll) return;
      return PollRepository.closePoll(poll.pollId);
    },
    onSuccess: () => {
      success({
        content: pollClosedText,
      });
      onPollClosed?.();
    },
    onError: () => {
      info({ content: failedGenericText });
    },
  });

  const onDeleteClick = () => {
    onCloseMenu();
    confirm({
      title: deletePostTitleText,
      content: deletePostWarningText,
      cancelText: cancelText,
      okText: deleteText,
      onOk: () => {
        const isCurrentlyOnline = navigator.onLine;
        if (!isCurrentlyOnline) {
          info({ content: deletePostFailedText });
          return;
        }
        mutateDeletePost();
      },
      pageId,
      componentId,
    });
  };

  const onEdit = () => {
    if (isDesktop) {
      onCloseMenu();
      return openPopup({
        pageId,
        view: 'desktop',
        isDismissable: false,
        header: <EditPostTitle pageId="post_composer_page" />,
        children: <PostComposerPage mode={Mode.EDIT} post={post} />,
        onClose: ({ close }) => {
          confirm({
            onOk: close,
            type: 'confirm',
            okText: resolveString('amity_social_button_discard'),
            cancelText: resolveString('amity_social_button_keep_editing'),
            title: resolveString('amity_social_modal_dialog_title_discard_post'),
            pageId: 'post_composer_page',
            content: resolveString('amity_social_modal_dialog_discard_post'),
          });
        },
      });
    }
    onCloseMenu();
    AmityPostContentComponentBehavior?.goToPostComposerPage?.({
      mode: Mode.EDIT,
      post,
    });
  };

  const onEditClick = () => {
    if (onConfirmEditPost) {
      onConfirmEditPost({ onConfirm: onEdit });
    } else {
      onEdit();
    }
  };

  const onClosePollClick = () => {
    onCloseMenu();
    confirm({
      title: closePollDialogTitleText,
      content: resolveString('amity_social_modal_dialog_poll_duration_warning'),
      cancelText: cancelText,
      okText: closePollTitle,
      onOk: () => {
        const isCurrentlyOnline = navigator.onLine;
        if (!isCurrentlyOnline) {
          info({ content: failedGenericText });
          return;
        }
        mutateClosePoll();
      },
      pageId,
      componentId,
    });
  };

  const handleUnreportPost = () => {
    onCloseMenu();
    mutateUnReportPost();
  };

  const onClickReportPost = () => {
    if (isDesktop) {
      onCloseMenu();
      openPopup({
        id: 'report_post_reason',
        pageId,
        view: 'desktop',
        isDismissable: false,
        children: (
          <ContentReportReason
            pageId={pageId}
            componentId={componentId}
            onCloseMenu={onCloseMenu}
            post={post}
            showReportPostButton={showReportPostButton}
          />
        ),
      });
    } else {
      setIsShowReportReason(true);
    }
  };

  const handleReportPost = () => {
    if (community)
      return handleCommunityProfileBehavior({
        defaultBehavior: () => onClickReportPost(),
        defaultCallback: onCloseMenu,
        allowNonMember: false,
        isJoined: community?.isJoined,
      });

    handleUserProfileBehavior({
      defaultBehavior: () => onClickReportPost(),
      defaultCallback: onCloseMenu,
      allowNonFollower: true,
    });
  };

  return (
    <div className={styles.postMenu}>
      {!isShowReportReason && showClosePollButton && (
        <Button
          data-testid={`${pageId}/${componentId}/close_poll_button`}
          className={styles.postMenu__item}
          onPress={onClosePollClick}
        >
          <ClosePollIcon className={styles.postMenu__closePoll__icon} />
          <Typography.BodyBold className={styles.postMenu__reportPost__text}>
            {closePollTitle}
          </Typography.BodyBold>
        </Button>
      )}
      {!isShowReportReason && showReportPostButton && !isLoading ? (
        <Button
          data-testid={`${pageId}/${componentId}/report_post_button`}
          className={styles.postMenu__item}
          onPress={() => (isFlaggedByMe ? handleUnreportPost() : handleReportPost())}
        >
          {isFlaggedByMe ? (
            <UnFlag className={styles.postMenu__reportPost__icon} />
          ) : (
            <FlagIcon className={styles.postMenu__reportPost__icon} />
          )}
          <Typography.BodyBold className={styles.postMenu__reportPost__text}>
            {isFlaggedByMe ? unreportPostText : reportPostText}
          </Typography.BodyBold>
        </Button>
      ) : null}

      {!isShowReportReason && showEditPostButton && !isPollPost && !isLiveStreamPost ? (
        <Button
          data-testid={`${pageId}/${componentId}/edit_post`}
          className={styles.postMenu__item}
          onPress={onEditClick}
        >
          <Pencil className={styles.postMenu__editPost__icon} />
          <Typography.BodyBold className={styles.postMenu__editPost__text}>
            {editPostTitleText}
          </Typography.BodyBold>
        </Button>
      ) : null}
      {showCopyLinkButton && (
        <CopyLinkButton
          pageId={pageId}
          componentId={componentId}
          model={SharableModel.POST}
          referenceId={post.postId}
          onDone={onCloseMenu}
        />
      )}
      {!isShowReportReason && showDeletePostButton ? (
        <Button
          data-testid={`${pageId}/${componentId}/delete_post`}
          className={styles.postMenu__item}
          onPress={onDeleteClick}
        >
          <TrashIcon className={styles.postMenu__deletePost__icon} />
          <Typography.BodyBold className={styles.postMenu__deletePost__text}>
            {deletePostText}
          </Typography.BodyBold>
        </Button>
      ) : null}
      {isShowReportReason && !isDesktop && (
        <ContentReportReason
          pageId={pageId}
          componentId={componentId}
          onCloseMenu={onCloseMenu}
          post={post}
          showReportPostButton={showReportPostButton}
        />
      )}
    </div>
  );
};
