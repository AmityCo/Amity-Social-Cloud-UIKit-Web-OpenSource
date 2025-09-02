import React, { useEffect, useRef, useState } from 'react';
import styles from './ImageGallery.module.css';
import { FeedSourceEnum } from '@amityco/ts-sdk';
import { useImage } from '~/v4/core/hooks/useImage';
import { Button } from '~/v4/core/natives/Button';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { ImageViewer } from '~/v4/social/internal-components/ImageViewer/ImageViewer';
import { UnavailableMediaViewer } from '~/v4/social/internal-components/UnavailableMediaViewer';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';

const ImageItem = ({
  fileId,
  postIndex,
  onClickImageItem,
}: {
  fileId: string;
  postIndex: number;
  onClickImageItem: (postIndex: number) => void;
}) => {
  const image = useImage({ fileId, imageSize: 'medium' });

  const [isBrokenImg, setIsBrokenImg] = useState(false);

  return image && !isBrokenImg ? (
    <Button
      className={styles.imageGallery__itemContainer}
      onPress={() => onClickImageItem(postIndex)}
    >
      <img
        className={styles.imageGallery__item}
        src={image}
        alt={`${fileId}`}
        onError={() => setIsBrokenImg(true)}
      />
    </Button>
  ) : (
    <Button
      className={styles.imageGallery__itemContainer}
      onPress={() => onClickImageItem(postIndex)}
    >
      <div className={styles.imageGallery__brokenImg} />
    </Button>
  );
};

interface ImageGalleryProps {
  posts?: Amity.Post<'image'>[] | null;
  pageId?: string;
  componentId?: string;
  target?: 'community' | 'user';
  isLoading?: boolean;
  feedSources?: FeedSourceEnum[];
}

export const ImageGallery = ({
  posts,
  pageId,
  target,
  isLoading,
  feedSources,
  componentId,
}: ImageGalleryProps) => {
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const { linkToPost, setLinkToPost } = useLayoutContext();
  const galleryRef = useRef<HTMLDivElement>(null);

  const onClickImageItem = (postIndex: number) => {
    const isParentPostDeleted =
      linkToPost && !posts?.find((post) => post.parentPostId === linkToPost?.parentPostId);

    const post = posts?.[postIndex];

    openPopup({
      id: 'image-viewer',
      pageId,
      componentId,
      media: true,
      disabledAnimation: true,
      isDismissable: isDesktop,
      children:
        !post || isParentPostDeleted ? (
          <UnavailableMediaViewer
            type="image"
            onClose={() => {
              setLinkToPost(null);
              closePopup('image-viewer');
            }}
          />
        ) : (
          <ImageViewer
            post={post}
            isFromGallery
            target={target}
            feedSources={feedSources}
            initialImageIndex={postIndex}
            onClose={() => {
              setLinkToPost(null);
              closePopup('image-viewer');
            }}
          />
        ),
    });
  };

  const scrollToImage = (index: number) => {
    const targetElement = galleryRef?.current?.children[index];
    if (targetElement) {
      requestAnimationFrame(() => {
        targetElement.scrollIntoView({ behavior: 'auto', block: 'center' });
      });
    }
  };

  useEffect(() => {
    if (linkToPost && galleryRef.current && posts && !isLoading) {
      const imageIndex = posts?.findIndex((post) => post.postId === linkToPost?.postId);
      onClickImageItem(imageIndex);
      scrollToImage(
        imageIndex > -1
          ? imageIndex
          : linkToPost.index > posts.length - 1
            ? posts.length - 1
            : linkToPost.index,
      );
      setLinkToPost(null);
    }
  }, [linkToPost, posts, isLoading]);

  return (
    <div className={styles.imageGallery} ref={galleryRef}>
      {posts?.map((post, index) => (
        <ImageItem
          key={post?.data?.fileId}
          fileId={post?.data?.fileId as string}
          postIndex={index}
          onClickImageItem={onClickImageItem}
        />
      ))}
    </div>
  );
};
