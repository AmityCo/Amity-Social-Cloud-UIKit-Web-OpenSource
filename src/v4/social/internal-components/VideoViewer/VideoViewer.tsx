import { useKeyPressEvent } from 'react-use';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import ChevronRight from '~/v4/icons/ChevronRight';
import useSwiper from '~/v4/social/hooks/useSwiper';
import usePostByIds from '~/v4/core/hooks/usePostByIds';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { ClearButton } from '~/v4/social/elements/ClearButton/ClearButton';
import { memo, useCallback, useMemo, useState } from 'react';
import styles from './VideoViewer.module.css';
import { isClipPost, isVideoPost } from '~/v4/social/utils/postTypeChecker';
import { VideoPlayer as CustomVideoPlayer } from '~/v4/social/internal-components/VideoPlayer/VideoPlayer';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { DisplayModeEnum } from '~/v4/social/types';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';

type VideoViewerProps = {
  onClose(): void;
  pageId?: string;
  post: Amity.Post;
  elementId?: string;
  componentId?: string;
  initialVideoIndex: number;
};

export function VideoViewer({
  post,
  onClose,
  pageId = '*',
  elementId = '*',
  componentId = '*',
  initialVideoIndex,
}: VideoViewerProps) {
  useKeyPressEvent('Escape', onClose);
  const { isDesktop } = useResponsive();
  const { removeDrawerData } = useDrawer();

  const posts = usePostByIds(post?.children || []);
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(initialVideoIndex);

  const next = () => {
    if (hasNext) setSelectedVideoIndex((prev) => prev + 1);
  };

  const prev = () => {
    if (hasPrev) setSelectedVideoIndex((prev) => prev - 1);
  };

  const videoPosts = posts.filter((post) => post.dataType === 'video' || post.dataType === 'clip');
  const videoPost = videoPosts[selectedVideoIndex];
  const hasNext = selectedVideoIndex < videoPosts.length - 1;
  const hasPrev = selectedVideoIndex > 0;

  const handleClose = useCallback(() => {
    removeDrawerData();
    onClose();
  }, [onClose, removeDrawerData]);

  return (
    <div style={themeStyles} data-testid={accessibilityId} className={styles.videoViewer__modal}>
      {isDesktop && (
        <span className={styles.videoViewer__close}>
          <ClearButton
            pageId={pageId}
            onPress={onClose}
            componentId={componentId}
            defaultClassName={styles.videoViewer__closeButton}
            imgClassName={styles.videoViewer__closeButton__img}
          />
        </span>
      )}
      {videoPosts.length > 1 && (
        <Typography.TitleBold className={styles.videoViewer__count}>
          {selectedVideoIndex + 1} / {videoPosts.length}
        </Typography.TitleBold>
      )}
      {hasPrev && (
        <Button className={styles.videoViewer__prev} onPress={prev}>
          <ChevronRight className={styles.videoViewer__prevButton} />
        </Button>
      )}
      <VideoPlayer
        pageId={pageId}
        videoPost={videoPost as Amity.Post<'video' | 'clip'>}
        next={next}
        prev={prev}
        onClose={handleClose}
      />
      {hasNext && (
        <Button className={styles.videoViewer__next} onPress={next}>
          <ChevronRight className={styles.videoViewer__nextButton} />
        </Button>
      )}
    </div>
  );
}

const VideoPlayer = memo(
  ({
    pageId,
    videoPost,
    prev,
    next,
    onClose,
  }: {
    pageId?: string;
    videoPost?: Amity.Post<'video' | 'clip'>;
    prev: () => void;
    next: () => void;
    onClose: () => void;
  }) => {
    const { isDesktop } = useResponsive();
    const [isDragging, setIsDragging] = useState(false);
    const videoFileId = useMemo(() => {
      if (isClipPost(videoPost)) return videoPost?.data?.fileId;
      if (isVideoPost(videoPost))
        return (
          videoPost?.data?.videoFileId?.high ||
          videoPost?.data?.videoFileId?.medium ||
          videoPost?.data?.videoFileId?.low ||
          videoPost?.data?.videoFileId?.original
        );
      return undefined;
    }, [videoPost]);

    const { handleTouchEnd, handleTouchMove, handleTouchStart } = useSwiper({
      next,
      prev,
      threshold: 100,
    });

    const { showProductTagList } = useShowProductTagList({
      pageId,
      mode: 'post',
      sourceId: videoPost?.parentPostId || '',
    });

    const handleProductTagClick = useCallback(() => {
      showProductTagList(videoPost?.productTags ?? []);
    }, [videoPost?.productTags, showProductTagList]);

    return (
      <CustomVideoPlayer
        displayMode={isDesktop ? DisplayModeEnum.DESKTOP : DisplayModeEnum.MOBILE}
        autoPlay={true}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        fileId={videoFileId}
        thumbnailFileId={videoPost?.data?.thumbnailFileId ?? ''}
        productTags={videoPost?.productTags}
        onTouchStart={handleTouchStart}
        onVolumeChange={(e) => {
          if (
            videoPost?.dataType === 'clip' &&
            (videoPost?.data as Amity.ContentDataClip)?.isMuted
          ) {
            e.currentTarget.muted = true;
          }
        }}
        className={styles.videoViewer__fullImage}
        onClickProductTagBadge={handleProductTagClick}
        isDragging={isDragging}
        onDragging={(isDragging) => setIsDragging(isDragging)}
        onClose={onClose}
      />
    );
  },
);
