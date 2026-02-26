import React, { useCallback, useState } from 'react';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton/ClearButton';
import styles from './SingleVideoViewer.module.css';
import { Popover } from '~/v4/core/components/AriaPopover';
import { MediaMenu } from '~/v4/social/internal-components/MediaMenu';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { MenuButton } from '~/v4/social/elements';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { UserProfileTabs } from '~/v4/social/pages/UserProfilePage/UserProfilePage';
import { FeedSourceEnum } from '@amityco/ts-sdk';
import { MediaTabType } from '~/v4/social/constants/mediaTabs';
import { VideoPlayer } from '~/v4/social/internal-components/VideoPlayer/VideoPlayer';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { DisplayModeEnum } from '~/v4/social/types';

interface SingleVideoViewerProps {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  fileId: string;
  thumbnailFileId: string;
  onClose(): void;
  isMuted?: boolean;
  isFromGallery?: boolean;
  post: Amity.Post;
  selectedImageIndex: number;
  feedSources?: FeedSourceEnum[];
}

export function SingleVideoViewer({
  pageId = '*',
  componentId = '*',
  elementId = '*',
  fileId,
  thumbnailFileId,
  isMuted = false,
  onClose,
  isFromGallery,
  post,
  selectedImageIndex,
  feedSources,
}: SingleVideoViewerProps) {
  const { isDesktop } = useResponsive();
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { goToPostDetailPage, page } = useNavigation();
  const { setLinkToPost } = useLayoutContext();

  const [isDragging, setIsDragging] = useState(false);

  const productTags = post?.productTags || [];

  const redirectToPostDetailPage = () => {
    const postId = post.children.length > 0 ? post.postId : post.parentPostId;
    if (page.type === PageTypes.CommunityProfilePage) {
      setLinkToPost({
        tab: 'community_media_feed',
        mediaTab: MediaTabType.VIDEOS,
        index: selectedImageIndex,
        target: 'community',
        parentPostId: post.parentPostId,
        postId: post.postId,
        feedSources,
      });
      goToPostDetailPage?.({
        postId,
        hideTarget: false,
      });
    }
    if (page.type === PageTypes.UserProfilePage) {
      setLinkToPost({
        tab: UserProfileTabs.MEDIA,
        index: selectedImageIndex,
        target: 'user',
        mediaTab: MediaTabType.VIDEOS,
        parentPostId: post.parentPostId,
        postId: post.postId,
        feedSources,
      });
      goToPostDetailPage?.({
        postId,
        hideTarget: false,
      });
    }
  };

  const { showProductTagList } = useShowProductTagList({
    pageId,
    mode: 'post',
    sourceId: post.postId || '',
  });

  const handleProductTagClick = useCallback(() => {
    showProductTagList(productTags);
  }, [productTags, showProductTagList]);

  return (
    <div style={themeStyles}>
      <div className={styles.modal} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <VideoPlayer
            fileId={fileId}
            thumbnailFileId={thumbnailFileId}
            isMuted={isMuted}
            pageId={pageId}
            productTags={productTags}
            postId={post?.postId}
            onClickProductTagBadge={handleProductTagClick}
            displayMode={isDesktop ? DisplayModeEnum.DESKTOP : DisplayModeEnum.MOBILE}
            isDragging={isDragging}
            onDragging={(isDragging) => setIsDragging(isDragging)}
            autoPlay={true}
            onClickMenu={
              isFromGallery
                ? () =>
                    setDrawerData({
                      content: (
                        <MediaMenu
                          pageId={pageId}
                          onViewPostPress={() => {
                            onClose();
                            removeDrawerData();
                            redirectToPostDetailPage();
                          }}
                        />
                      ),
                    })
                : undefined
            }
            onClose={() => {
              removeDrawerData();
              onClose();
            }}
          />
          {isDesktop && (
            <div className={styles.modal__actions}>
              <ClearButton
                pageId={pageId}
                componentId={componentId}
                defaultClassName={styles.videoViewer__clearButton}
                imgClassName={styles.videoViewer__clearButton__img}
                onPress={onClose}
              />
              {isFromGallery && (
                <Popover
                  trigger={({ openPopover, isDesktop }) => (
                    <MenuButton
                      variant="filled"
                      pageId={pageId}
                      className={styles.videoViewer__menuButton}
                      iconClassName={styles.videoViewer__menuButton__icon}
                      onClick={openPopover}
                    />
                  )}
                >
                  {({ closePopover }) => {
                    return (
                      <MediaMenu
                        pageId={pageId}
                        onViewPostPress={() => {
                          onClose();
                          closePopover();
                          redirectToPostDetailPage();
                        }}
                      />
                    );
                  }}
                </Popover>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
