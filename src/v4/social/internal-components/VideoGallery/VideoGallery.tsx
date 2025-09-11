import React, { useEffect, useRef, useState } from 'react';
import styles from './VideoGallery.module.css';
import { useImage } from '~/v4/core/hooks/useImage';
import useFile from '~/v4/core/hooks/useFile';
import { SingleVideoViewer } from '~/v4/social/internal-components/SingleVideoViewer';
import { formatDuration } from '~/v4/social/utils/formatDuration';
import VideoControl from '~/v4/icons/VideoControl';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { UnavailableMediaViewer } from '~/v4/social/internal-components/UnavailableMediaViewer';
import { FeedSourceEnum } from '@amityco/ts-sdk';

const VideoItem = ({
  videoFileId,
  thumbnailFileId,
  postIndex,
  onClickVideoItem,
}: {
  videoFileId: string;
  thumbnailFileId: string;
  postIndex: number;
  onClickVideoItem: (postIndex: number) => void;
}) => {
  const [isBrokenImg, setIsBrokenImg] = useState(false);

  const image = useImage({ fileId: thumbnailFileId, imageSize: 'medium' });

  const file = useFile<'video'>(videoFileId);

  if (!image || !file)
    return (
      <div
        data-testid={`/*/video-thumbnail-failed-${postIndex}`}
        className={styles.videoGallery__skeleton__itemContainer}
      >
        <VideoControl className={styles.videoGallery__skeleton__item} />
      </div>
    );

  return isBrokenImg ? (
    <Button
      data-testid={`/*/video-skeleton-${postIndex}`}
      className={styles.videoGallery__itemContainer}
      onPress={() => onClickVideoItem(postIndex)}
    >
      <div className={styles.videoGallery__brokenImg} />
    </Button>
  ) : (
    <Button
      data-testid={`/*/video-item-${postIndex}`}
      className={styles.videoGallery__itemContainer}
      onPress={() => onClickVideoItem(postIndex)}
    >
      <img
        className={styles.videoGallery__item}
        src={image}
        alt={`${thumbnailFileId}`}
        onError={() => setIsBrokenImg(true)}
      />
      <Typography.Caption className={styles.videoGallery__duration}>
        {formatDuration((file?.attributes.metadata?.video as any).duration)}
      </Typography.Caption>
    </Button>
  );
};

interface VideoGalleryProps {
  posts?: Amity.Post<'video'>[] | null;
  pageId?: string;
  componentId?: string;
  elementId?: string;
  isLoading?: boolean;
  feedSources?: FeedSourceEnum[];
}

export const VideoGallery: React.FC<VideoGalleryProps> = ({
  posts,
  pageId,
  componentId,
  elementId,
  isLoading,
  feedSources,
}) => {
  const [isImageViewerOpen, setIsImageViewerOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const { isDesktop } = useResponsive();
  const { linkToPost, setLinkToPost } = useLayoutContext();
  const galleryRef = useRef<HTMLDivElement>(null);
  const { openPopup, closePopup } = usePopupContext();

  const onClickVideoItem = (postIndex: number) => {
    setSelectedIndex(postIndex);
    setIsImageViewerOpen(true);
  };

  const showVideoViewer = (postIndex: number) => {
    const isParentPostDeleted =
      linkToPost && !posts?.find((post) => post.parentPostId === linkToPost?.parentPostId);

    const post = posts?.[postIndex];

    if (isParentPostDeleted || !post) {
      openPopup({
        id: 'video-viewer',
        pageId,
        componentId,
        media: true,
        disabledAnimation: true,
        isDismissable: isDesktop,
        children: (
          <UnavailableMediaViewer
            type="video"
            onClose={() => {
              setLinkToPost(null);
              closePopup('video-viewer');
            }}
          />
        ),
      });
    } else {
      onClickVideoItem(postIndex);
    }
  };

  const scrollToVideo = (index: number) => {
    const targetElement = galleryRef?.current?.children[index];
    if (targetElement) {
      requestAnimationFrame(() => {
        targetElement.scrollIntoView({ behavior: 'auto', block: 'center' });
      });
    }
  };

  useEffect(() => {
    if (linkToPost && galleryRef.current && posts && !isLoading) {
      const videoIndex = posts?.findIndex((post) => post.postId === linkToPost?.postId);
      showVideoViewer(videoIndex);
      scrollToVideo(
        videoIndex > -1
          ? videoIndex
          : linkToPost.index > posts.length - 1
            ? posts.length - 1
            : linkToPost.index,
      );
      setLinkToPost(null);
    }
  }, [linkToPost, posts, isLoading]);

  return (
    <div className={styles.videoGallery} ref={galleryRef}>
      {posts?.map((post, index) => (
        <VideoItem
          key={post?.data?.videoFileId?.original}
          videoFileId={post?.data?.videoFileId?.original ?? ''}
          thumbnailFileId={post?.data?.thumbnailFileId ?? ''}
          postIndex={index}
          onClickVideoItem={onClickVideoItem}
        />
      ))}
      {posts && isImageViewerOpen && selectedIndex !== null && (
        <SingleVideoViewer
          isFromGallery
          feedSources={feedSources}
          selectedImageIndex={selectedIndex}
          post={posts[selectedIndex]}
          pageId={pageId}
          componentId={componentId}
          elementId={elementId}
          fileId={posts[selectedIndex]?.data?.videoFileId?.original ?? ''}
          thumbnailFileId={posts[selectedIndex]?.data?.thumbnailFileId ?? ''}
          onClose={() => {
            setLinkToPost(null);
            setIsImageViewerOpen(false);
          }}
        />
      )}
    </div>
  );
};
