import { Typography } from '~/v4/core/components';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { PostsTabDescription } from '~/v4/social/elements';
import React, { useState } from 'react';
import { UserAvatar } from '~/v4/social/elements/UserAvatar';
import { Button } from '~/v4/core/natives/Button/Button';
import { Timestamp } from '~/v4/social/elements/Timestamp';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { TrashIcon } from '~/v4/icons/Trash';
import { PostAcceptButton } from '~/v4/social/elements/PostAcceptButton';
import { PostDeclineButton } from '~/v4/social/elements/PostDeclineButton/PostDeclineButton';
import { PostRepository } from '@amityco/ts-sdk';
import { useNotifications } from '~/v4/core/providers/NotificationProvider';
import { useSDK } from '~/v4/core/hooks/useSDK';
import { TextContent } from '~/v4/social/components/PostContent/TextContent';
import { ChildrenPostContent } from '~/v4/social/components/PostContent';
import { ImageViewer } from '~/v4/social/internal-components/ImageViewer/ImageViewer';
import { VideoViewer } from '~/v4/social/internal-components/VideoViewer/VideoViewer';
import { Popover } from '~/v4/core/components/AriaPopover';
import { useNetworkState } from 'react-use';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import styles from './PendingPostList.module.css';
import FireworkPaper from '~/v4/icons/FireworkPaper';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';

type PendingPostListProps = {
  pageId?: string;
  reviewingPosts: Amity.Post[];
  canReviewCommunityPosts?: boolean;
  refresh?: () => void;
};

export const PendingPostList = ({
  pageId = '*',
  reviewingPosts,
  canReviewCommunityPosts = false,
  refresh,
}: PendingPostListProps) => {
  const componentId = 'pending_post_list';

  const { accessibilityId, themeStyles } = useAmityComponent({
    pageId,
    componentId,
  });
  const { currentUserId } = useSDK();

  const { setDrawerData, removeDrawerData } = useDrawer();
  const notification = useNotifications();
  const { online } = useNetworkState();
  const { openPopup, closePopup } = usePopupContext();
  const { isDesktop } = useResponsive();
  const { goToUserProfilePage } = useNavigation();

  const [isVideoViewerOpen, setIsVideoViewerOpen] = useState(false);
  const [clickedVideoIndex, setClickedVideoIndex] = useState<number | null>(null);
  const [selectedPost, setSelectedPost] = useState<Amity.Post | null>(null);

  const handleApprovePost = async (postId: string) => {
    if (postId == null) return;

    try {
      await PostRepository.approvePost(postId);
      notification.success({
        content: 'Post accepted.',
      });
    } catch (error) {
      notification.info({
        content: 'Failed to accept post. This post has been reviewed by another moderator.',
      });
      refresh?.();
    }
  };

  const handleDeclinePost = async (postId: string) => {
    if (postId == null) return;

    try {
      await PostRepository.declinePost(postId);
      notification.success({
        content: 'Post declined.',
      });
    } catch (error) {
      notification.info({
        content: 'Failed to decline post. This post has been reviewed by another moderator.',
      });
      refresh?.();
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (postId == null) return;

    try {
      await PostRepository.deletePost(postId);
      removeDrawerData();
      notification.success({
        content: 'Post deleted.',
      });
    } catch (error) {
      notification.info({
        content: 'Failed to delete post. Post has been deleted.',
      });
      refresh?.();
    }
  };

  const isMyPost = (postedUserId: string) => {
    return postedUserId === currentUserId;
  };

  const openImageViewer = (imageIndex: number, post: Amity.Post) => {
    openPopup({
      id: 'image-viewer',
      disabledAnimation: true,
      isDismissable: isDesktop,
      className: styles.pendingPostList__imageViewer,
      overlayClassName: styles.pendingPostList__imageViewerOverlay,
      children: (
        <ImageViewer post={post} onClose={closeImageViewer} initialImageIndex={imageIndex} />
      ),
    });
  };

  const closeImageViewer = () => {
    closePopup('image-viewer');
  };

  const openVideoViewer = (videoIndex: number, post: Amity.Post) => {
    setIsVideoViewerOpen(true);
    setClickedVideoIndex(videoIndex);
    setSelectedPost(post);
  };

  const closeVideoViewer = () => {
    setIsVideoViewerOpen(false);
    setClickedVideoIndex(null);
    setSelectedPost(null);
  };

  const renderPendingPost = (post: Amity.Post) => {
    return (
      <div className={styles.pendingPostList__wrapper} key={post.postId}>
        <div className={styles.pendingPostList__bar}>
          <div className={styles.pendingPostList__userDetail}>
            <UserAvatar
              pageId={pageId}
              componentId={componentId}
              userId={post?.postedUserId}
              onPressAvatar={() => {
                goToUserProfilePage(post?.postedUserId);
              }}
            />
            <div>
              <Typography.BodyBold
                className={styles.pendingPostList__username}
                data-testid={`${pageId}/${componentId}/username`}
                onClick={() => goToUserProfilePage(post?.postedUserId)}
              >
                {post?.creator?.displayName}
              </Typography.BodyBold>
              <div className={styles.pendingPostList__information__subtitle}>
                <Timestamp timestamp={post.createdAt} />
                {post.createdAt !== post.editedAt && (
                  <Typography.Caption
                    data-testid={`${pageId}/${componentId}/post_edited_text`}
                    className={styles.pendingPostList__editedTag}
                  >
                    (edited)
                  </Typography.Caption>
                )}
              </div>
            </div>
          </div>
          {isMyPost(post.postedUserId) && (
            <div className={styles.pendingPostList__wrapRightMenu}>
              <Popover
                containerClassName={styles.pendingPostList__actionButton}
                trigger={{
                  pageId,
                  componentId,
                  onClick: ({ closePopover }) =>
                    setDrawerData({
                      content: (
                        <Button
                          className={styles.pendingPostList__item}
                          data-testid={`${pageId}/${componentId}/delete_post`}
                          onPress={() => {
                            closePopover();
                            handleDeletePost(post.postId);
                            removeDrawerData();
                          }}
                        >
                          <TrashIcon className={styles.pendingPostList__deletePost__icon} />
                          <Typography.TitleBold
                            className={styles.pendingPostList__deletePost__text}
                          >
                            Delete post
                          </Typography.TitleBold>
                        </Button>
                      ),
                    }),
                }}
              >
                {({ closePopover }) => (
                  <Button
                    className={styles.pendingPostList__item}
                    data-testid={`${pageId}/${componentId}/delete_post`}
                    onPress={() => {
                      closePopover();
                      handleDeletePost(post.postId);
                    }}
                  >
                    <TrashIcon className={styles.pendingPostList__deletePost__icon} />
                    <Typography.TitleBold className={styles.pendingPostList__deletePost__text}>
                      Delete post
                    </Typography.TitleBold>
                  </Button>
                )}
              </Popover>
            </div>
          )}
        </div>
        <div className={styles.pendingPostList__textPost}>
          <TextContent
            pageId={pageId}
            componentId={componentId}
            text={post?.data?.text}
            mentioned={post?.metadata?.mentioned}
            mentionees={post?.mentionees}
            post={post}
          />
          {post.children.length > 0 && (
            <ChildrenPostContent
              pageId={pageId}
              componentId={componentId}
              post={post}
              onImageClick={(imageIndex) => openImageViewer(imageIndex, post)}
              onVideoClick={(videoIndex) => openVideoViewer(videoIndex, post)}
            />
          )}
        </div>
        {canReviewCommunityPosts && (
          <div className={styles.pendingPostList__buttonWrapper}>
            <PostAcceptButton
              pageId={pageId}
              componentId={componentId}
              onClick={() => {
                if (!online) {
                  notification.info({
                    content: 'Failed to accept post. Please try again.',
                  });
                  return;
                }
                handleApprovePost(post.postId);
              }}
            />
            <PostDeclineButton
              pageId={pageId}
              componentId={componentId}
              onClick={() => {
                {
                  if (!online) {
                    notification.info({
                      content: 'Failed to decline post. Please try again.',
                    });
                    return;
                  }
                  handleDeclinePost(post.postId);
                }
              }}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={themeStyles} data-testid={accessibilityId}>
      <PostsTabDescription pageId={pageId} componentId={componentId} />
      {reviewingPosts.length > 0 && reviewingPosts.map((post) => renderPendingPost(post))}
      {reviewingPosts.length === 0 && (
        <div className={styles.pendingPostList__noJoinRequest}>
          <FireworkPaper className={styles.pendingPostList__fireworkIcon} />
          <Typography.TitleBold className={styles.pendingPostList__noJoinRequestText}>
            No pending posts
          </Typography.TitleBold>
        </div>
      )}

      {/* Render VideoViewer at the root level of the component to ensure proper z-index stacking */}
      {isVideoViewerOpen && typeof clickedVideoIndex === 'number' && selectedPost && (
        <VideoViewer
          post={selectedPost}
          onClose={closeVideoViewer}
          initialVideoIndex={clickedVideoIndex}
        />
      )}
    </div>
  );
};
