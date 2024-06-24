import React, { useMemo } from 'react';
import { PostRepository } from '@amityco/ts-sdk';
import { useMutation } from '@tanstack/react-query';
import { usePostPermissions } from '~/v4/core/hooks/usePostPermissions';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';

import styles from './PostMenu.module.css';
import { usePostFlaggedByMe } from '~/v4/core/hooks/usePostFlaggedByMe';
import useCommunity from '~/v4/core/hooks/collections/useCommunity';

const PenSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="20"
    height="19"
    viewBox="0 0 20 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M18.3804 2.25391C19.2593 3.13281 19.2593 4.53906 18.3804 5.41797L15.7437 8.05469L14.5483 9.25L5.97021 17.8281L1.9624 18.25C1.92725 18.25 1.89209 18.25 1.85693 18.25C1.36475 18.25 0.978027 17.8281 1.04834 17.3359L1.47021 13.3281L10.0483 4.75L11.2437 3.55469L13.8804 0.917969C14.3022 0.496094 14.8999 0.25 15.4624 0.25C16.0249 0.25 16.6226 0.496094 17.0444 0.917969L18.3804 2.25391ZM5.19678 16.2109L13.353 8.08984L14.4429 7L12.2983 4.85547L11.2085 5.94531L3.0874 14.1016L2.84131 16.457L5.19678 16.2109ZM17.1851 4.22266C17.396 4.01172 17.396 3.66016 17.1851 3.44922L15.8491 2.11328C15.7085 1.97266 15.5327 1.9375 15.4624 1.9375C15.3921 1.9375 15.2163 1.97266 15.0757 2.11328L13.4937 3.66016L15.6382 5.80469L17.1851 4.22266Z" />
  </svg>
);

const TrashSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="16"
    height="19"
    viewBox="0 0 16 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M15.3608 3.0625C15.6421 3.0625 15.9233 3.34375 15.9233 3.625V4.1875C15.9233 4.50391 15.6421 4.75 15.3608 4.75H14.7983L14.0249 16.668C13.9897 17.5469 13.2163 18.25 12.3374 18.25H3.72412C2.84521 18.25 2.07178 17.5469 2.03662 16.668L1.29834 4.75H0.73584C0.419434 4.75 0.17334 4.50391 0.17334 4.1875V3.625C0.17334 3.34375 0.419434 3.0625 0.73584 3.0625H3.61865L4.81396 1.09375C5.09521 0.636719 5.72803 0.25 6.25537 0.25H9.80615C10.3335 0.25 10.9663 0.636719 11.2476 1.09375L12.4429 3.0625H15.3608ZM6.25537 1.9375L5.5874 3.0625H10.4741L9.80615 1.9375H6.25537ZM12.3374 16.5625L13.0757 4.75H2.98584L3.72412 16.5625H12.3374Z" />
  </svg>
);

const FlagSvg = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    width="19"
    height="19"
    viewBox="0 0 19 19"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M12.3125 3.0625C13.543 3.0625 14.8789 2.64062 16.1445 2.07812C17.2344 1.62109 18.5 2.42969 18.5 3.625V12.0625C18.5 12.6602 18.1836 13.1875 17.7266 13.5039C16.7773 14.1016 15.2656 14.875 13.1914 14.875C10.8008 14.875 9.21875 13.75 7.49609 13.75C5.52734 13.75 4.33203 14.1719 3.03125 14.7695V17.6875C3.03125 18.0039 2.75 18.25 2.46875 18.25H1.90625C1.58984 18.25 1.34375 18.0039 1.34375 17.6875V3.41406C0.816406 3.13281 0.5 2.57031 0.5 1.9375C0.5 0.988281 1.30859 0.214844 2.29297 0.285156C3.10156 0.320312 3.76953 0.953125 3.83984 1.76172C3.83984 1.79688 3.875 1.90234 3.875 1.9375C3.875 2.11328 3.80469 2.35938 3.76953 2.5C4.54297 2.18359 5.49219 1.9375 6.61719 1.9375C9.00781 1.9375 10.5898 3.0625 12.3125 3.0625ZM16.8125 12.0625V3.625C15.6875 4.15234 13.8242 4.75 12.3125 4.75C10.2031 4.75 8.72656 3.625 6.61719 3.625C5.14062 3.625 3.76953 4.22266 3.03125 4.75V12.9062C4.12109 12.4141 5.98438 12.0625 7.49609 12.0625C9.60547 12.0625 11.082 13.1875 13.1914 13.1875C14.668 13.1875 16.0391 12.625 16.8125 12.0625Z" />
  </svg>
);

interface PostMenuProps {
  post: Amity.Post;
  pageId?: string;
  componentId?: string;
  elementId?: string;
  onCloseMenu: () => void;
}

export const PostMenu = ({
  post,
  pageId = '*',
  componentId = '*',
  elementId = '*',
  onCloseMenu,
}: PostMenuProps) => {
  const { success, error } = useNotifications();

  const { community } = useCommunity({
    communityId: post?.targetId,
    shouldCall: () => post?.targetType === 'community',
  });

  const { isCommunityModerator, isOwner } = usePostPermissions({ post, community });

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
      if (isOwner) {
        return {
          showEditPostButton: true,
          showDeletePostButton: true,
          showReportPostButton: false,
        };
      } else {
        return {
          showEditPostButton: false,
          showDeletePostButton: false,
          showReportPostButton: true,
        };
      }
    }
  }, [isCommunityModerator, isOwner]);

  const { isFlaggedByMe, isLoading, mutateReportPost, mutateUnReportPost } = usePostFlaggedByMe({
    post,
    isFlaggable: showReportPostButton,
    onReportSuccess: () => {
      success({ content: 'Post reported' });
    },
    onReportError: () => {
      error({ content: 'Failed to report post' });
    },
    onUnreportSuccess: () => {
      success({ content: 'Post unreported' });
    },
    onUnreportError: () => {
      error({ content: 'Failed to unreport post' });
    },
  });

  const { confirm } = useConfirmContext();

  const { mutateAsync: mutateDeletePost } = useMutation({
    mutationFn: async () => {
      onCloseMenu();
      return PostRepository.hardDeletePost(post.postId);
    },
    onSuccess: () => {
      success({ content: 'Post deleted' });
    },
    onError: () => {
      error({ content: 'Failed to delete post' });
    },
  });

  const onDeleteClick = () => {
    onCloseMenu();
    confirm({
      title: 'Delete post',
      content: 'This post will be permanently deleted.',
      cancelText: 'Cancel',
      okText: 'Delete',
      onOk: () => mutateDeletePost(),
      pageId,
      componentId,
    });
  };

  return (
    <div className={styles.postMenu}>
      {/* <button className={styles.postMenu__item} onClick={onEdit}>
        <PenSvg className={styles.postMenu__editPost__icon} />
        <span>Edit post</span>
      </button> */}
      {showReportPostButton ? (
        <button
          className={styles.postMenu__item}
          disabled={isLoading}
          onClick={() => {
            if (isFlaggedByMe) {
              mutateUnReportPost();
            } else {
              mutateReportPost();
            }
          }}
        >
          <FlagSvg className={styles.postMenu__reportPost__icon} />
          <span className={styles.postMenu__reportPost__text}>
            {isFlaggedByMe ? 'Unreport post' : 'Report post'}
          </span>
        </button>
      ) : null}
      {showDeletePostButton ? (
        <button className={styles.postMenu__item} onClick={() => onDeleteClick()}>
          <TrashSvg className={styles.postMenu__deletePost__icon} />
          <span className={styles.postMenu__deletePost__text}>Delete post</span>
        </button>
      ) : null}
    </div>
  );
};
