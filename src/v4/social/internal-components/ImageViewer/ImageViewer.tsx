import React, { useMemo, useState } from 'react';
import { formatAltText } from '~/v4/social/utils';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import ChevronRight from '~/v4/icons/ChevronRight';
import useSwiper from '~/v4/social/hooks/useSwiper';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Popover } from '~/v4/core/components/AriaPopover';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import { MenuButton } from '~/v4/social/elements';
import { MediaMenu } from '~/v4/social/internal-components/MediaMenu';
import { AltTextBottomSheet } from '~/v4/social/internal-components/ImageThumbnail/ImageThumbnail';
import styles from './ImageViewer.module.css';
import { usePostPermissions } from '~/v4/core/hooks/usePostPermissions';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { UserProfileTabs } from '~/v4/social/pages/UserProfilePage/UserProfilePage';
import { FeedSourceEnum } from '@amityco/ts-sdk';
import { MediaTabType } from '~/v4/social/constants/mediaTabs';

type ImageViewerProps = {
  pageId?: string;
  onClose(): void;
  post: Amity.Post;
  elementId?: string;
  componentId?: string;
  initialImageIndex: number;
  isFromGallery?: boolean;
  target?: 'community' | 'user';
  feedSources?: FeedSourceEnum[];
};

export function ImageViewer({
  post,
  onClose,
  target,
  pageId = '*',
  elementId = '*',
  componentId = '*',
  initialImageIndex,
  isFromGallery,
  feedSources,
}: ImageViewerProps) {
  const { isOwner } = usePostPermissions({ post });
  const [isOpen, setIsOpen] = useState(false);
  const [isBrokenImg, setIsBrokenImg] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(initialImageIndex);
  const { goToPostDetailPage } = useNavigation();
  const { setLinkToPost } = useLayoutContext();

  const imageFile =
    post.children.length > 0
      ? post.childrenPosts[selectedImageIndex]?.getImageInfo()
      : post?.getImageInfo();

  const { setDrawerData, removeDrawerData } = useDrawer();
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });

  const next = () => {
    if (hasNext) setSelectedImageIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (hasPrev) setSelectedImageIndex((prev) => prev - 1);
  };

  const hasNext = selectedImageIndex < post?.children.length - 1;
  const hasPrev = selectedImageIndex > 0;

  const { handleTouchEnd, handleTouchMove, handleTouchStart } = useSwiper({ next, prev });

  const redirectToPostDetailPage = () => {
    const postId = post.children.length > 0 ? post.postId : post.parentPostId;
    if (target === 'community') {
      if (post) {
        setLinkToPost({
          tab: 'community_media_feed',
          mediaTab: MediaTabType.IMAGES,
          index: selectedImageIndex,
          target: 'community',
          parentPostId: post.parentPostId,
          postId: post.postId,
          feedSources,
        });
      }
      goToPostDetailPage?.({
        postId,
        hideTarget: false,
      });
    }
    if (target === 'user') {
      if (post) {
        setLinkToPost({
          tab: UserProfileTabs.MEDIA,
          mediaTab: MediaTabType.IMAGES,
          index: selectedImageIndex,
          target: 'user',
          parentPostId: post.parentPostId,
          postId: post.postId,
          feedSources,
        });
      }
      goToPostDetailPage?.({
        postId,
        hideTarget: false,
      });
    }
  };

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.imageViewer__modal}>
      <span className={styles.imageViewer__close}>
        <ClearButton
          pageId={pageId}
          onPress={() => {
            onClose();
            removeDrawerData();
          }}
          componentId={componentId}
          defaultClassName={styles.imageViewer__closeButton}
          imgClassName={styles.imageViewer__closeButton__img}
        />
        {(isFromGallery || isOwner) && (
          <Popover
            trigger={({ openPopover, isDesktop }) => (
              <MenuButton
                pageId={pageId}
                className={styles.imageViewer__menuButton}
                variant="filled"
                iconClassName={styles.imageViewer__menuButton__icon}
                onClick={() => {
                  isDesktop
                    ? openPopover()
                    : setDrawerData({
                        content: (
                          <MediaMenu
                            pageId={pageId}
                            file={imageFile}
                            onViewPostPress={
                              isFromGallery
                                ? () => {
                                    onClose();
                                    removeDrawerData();
                                    redirectToPostDetailPage();
                                  }
                                : undefined
                            }
                            onEditAltTextPress={
                              isOwner
                                ? () => {
                                    setIsOpen(true);
                                    removeDrawerData();
                                  }
                                : undefined
                            }
                          />
                        ),
                      });
                }}
              />
            )}
          >
            {({ closePopover }) => {
              return (
                <MediaMenu
                  pageId={pageId}
                  file={imageFile}
                  onEditAltTextPress={
                    isOwner
                      ? () => {
                          setIsOpen(true);
                          closePopover();
                        }
                      : undefined
                  }
                  onViewPostPress={
                    isFromGallery
                      ? () => {
                          onClose();
                          closePopover();
                          redirectToPostDetailPage();
                        }
                      : undefined
                  }
                />
              );
            }}
          </Popover>
        )}
      </span>

      {post?.children.length > 1 && (
        <Typography.TitleBold className={styles.imageViewer__count} as="p">
          {selectedImageIndex + 1} / {post?.children.length}
        </Typography.TitleBold>
      )}

      {hasPrev && (
        <Button
          onPress={prev}
          className={styles.imageViewer__prev}
          aria-label="Click to go to previous image"
        >
          <ChevronRight className={styles.imageViewer__prev__icon} />
        </Button>
      )}

      <div aria-live="assertive">
        {imageFile && !isBrokenImg ? (
          <img
            onTouchEnd={handleTouchEnd}
            onTouchMove={handleTouchMove}
            onTouchStart={handleTouchStart}
            onError={() => setIsBrokenImg(true)}
            className={styles.imageViewer__fullImage}
            src={getFileUrlWithSize(imageFile.fileUrl)}
            alt={formatAltText({
              current: selectedImageIndex + 1,
              total: post?.children.length,
              altText: imageFile?.altText,
            })}
          />
        ) : (
          <div
            role="status"
            aria-label="loading image"
            className={styles.imageViewer__itemContainer}
          />
        )}
      </div>

      {hasNext && (
        <Button
          onPress={next}
          className={styles.imageViewer__next}
          aria-label="Click to go to next image"
        >
          <ChevronRight className={styles.imageViewer__next__icon} />
        </Button>
      )}

      {imageFile && isOwner && (
        <AltTextBottomSheet file={imageFile} mode="edit" isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}
