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
import { AltTextMenu } from '~/v4/social/internal-components/AltTextMenu';
import { AltTextBottomSheet } from '~/v4/social/internal-components/ImageThumbnail/ImageThumbnail';
import styles from './ImageViewer.module.css';
import { usePostPermissions } from '~/v4/core/hooks/usePostPermissions';

type ImageViewerProps = {
  pageId?: string;
  onClose(): void;
  post: Amity.Post;
  elementId?: string;
  componentId?: string;
  initialImageIndex: number;
};

export function ImageViewer({
  post,
  onClose,
  pageId = '*',
  elementId = '*',
  componentId = '*',
  initialImageIndex,
}: ImageViewerProps) {
  const { isOwner } = usePostPermissions({ post });
  const [selectedImageIndex, setSelectedImageIndex] = useState(initialImageIndex);
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  const imageFile = post.childrenPosts[selectedImageIndex]?.getImageInfo();

  const { setDrawerData, removeDrawerData } = useDrawer();
  const [isOpen, setIsOpen] = React.useState(false);

  const next = () => {
    if (hasNext) setSelectedImageIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (hasPrev) setSelectedImageIndex((prev) => prev - 1);
  };

  const hasNext = selectedImageIndex < post?.children.length - 1;
  const hasPrev = selectedImageIndex > 0;

  const { handleTouchEnd, handleTouchMove, handleTouchStart } = useSwiper({ next, prev });

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.imageViewer__modal}>
      <span className={styles.imageViewer__close}>
        <ClearButton
          pageId={pageId}
          onPress={onClose}
          componentId={componentId}
          defaultClassName={styles.imageViewer__closeButton}
          imgClassName={styles.imageViewer__closeButton__img}
        />
        {isOwner && (
          <Popover
            trigger={{
              pageId,
              className: styles.imageViewer__menuButton,
              iconClassName: styles.imageViewer__menuButton__icon,
              onClick: () => {
                setDrawerData({
                  content: (
                    <AltTextMenu
                      file={imageFile}
                      pageId={pageId}
                      onPress={() => {
                        setIsOpen(true);
                        removeDrawerData();
                      }}
                    />
                  ),
                });
              },
            }}
          >
            {({ closePopover }) => {
              return <AltTextMenu file={imageFile} pageId={pageId} onPress={closePopover} />;
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

      {imageFile && (
        <AltTextBottomSheet file={imageFile} mode="edit" isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}
