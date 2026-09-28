import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import type SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useKeyPressEvent } from 'react-use';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Button } from '~/v4/core/natives/Button';
import usePostByIds from '~/v4/core/hooks/usePostByIds';
import { isClipPost, isVideoPost } from '~/v4/social/utils/postTypeChecker';
import { VideoPlayer as CustomVideoPlayer } from '~/v4/social/internal-components/VideoPlayer/VideoPlayer';
import { DisplayModeEnum } from '~/v4/social/types';
import CloseIcon from '~/v4/icons/Close';
import Muted from '~/v4/icons/Muted';
import UnMutedOutlined from '~/v4/icons/UnMutedOutlined';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import ChevronRight from '~/v4/icons/ChevronRight';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks';
import styles from './VideoViewer.module.css';

export type VideoViewerItem = {
  fileId?: string;
  url?: string;
  thumbnailFileId?: string;
  thumbnailUrl?: string;
  productTags?: Amity.ProductTag[];
};

type VideoViewerProps = {
  videos?: VideoViewerItem[];
  post?: Amity.Post;
  initialIndex?: number;
  onClose: () => void;
  pageId?: string;
  sourceId?: string;
  indexRef?: MutableRefObject<number>;
};

function getPostVideoFileId(videoPost?: Amity.Post<'video' | 'clip'>): string | undefined {
  if (isClipPost(videoPost)) return videoPost?.data?.fileId;
  if (isVideoPost(videoPost))
    return (
      videoPost?.data?.videoFileId?.high ||
      videoPost?.data?.videoFileId?.medium ||
      videoPost?.data?.videoFileId?.low ||
      videoPost?.data?.videoFileId?.original
    );
  return undefined;
}

export function VideoViewer({
  videos: videosProp,
  post,
  initialIndex = 0,
  onClose,
  pageId,
  sourceId = '',
  indexRef,
}: VideoViewerProps) {
  const { isDesktop } = useResponsive();
  const swiperRef = useRef<SwiperCore | null>(null);

  const [index, setIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);

  // Feed passes a `post`; derive its video/clip children into the shared item shape.
  const childPosts = usePostByIds(post?.children || []);
  const videos = useMemo<VideoViewerItem[]>(() => {
    if (videosProp) return videosProp;
    return childPosts
      .filter((child) => child.dataType === 'video' || child.dataType === 'clip')
      .map((child) => ({
        fileId: getPostVideoFileId(child as Amity.Post<'video' | 'clip'>),
        thumbnailFileId:
          (child.data as Amity.ContentDataVideo | Amity.ContentDataClip)?.thumbnailFileId ??
          undefined,
        productTags: child.productTags,
      }));
  }, [videosProp, childPosts]);

  const total = videos.length;
  const item = videos[index];
  const hasPrev = index > 0;
  const hasNext = index < total - 1;

  const { showProductTagList } = useShowProductTagList({ pageId, mode: 'post', sourceId });

  useKeyPressEvent('Escape', onClose);

  useEffect(() => {
    if (indexRef) indexRef.current = index;
  }, [index, indexRef]);

  useEffect(() => {
    if (swiperRef.current) swiperRef.current.allowTouchMove = !isDesktop;
  }, [isDesktop]);

  const handleSlideChange = (swiper: SwiperCore) => {
    setIndex(swiper.activeIndex);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const counter = `${index + 1} / ${total}`;

  return (
    <div className={styles.videoViewer} data-desktop={isDesktop}>
      <div className={styles.videoViewer__stage}>
        {total > 0 && (
          <Swiper
            className={styles.videoViewer__swiper}
            slidesPerView={1}
            initialSlide={initialIndex}
            onSwiper={(swiper: SwiperCore) => {
              swiperRef.current = swiper;
              swiper.allowTouchMove = !isDesktop;
            }}
            onSlideChange={handleSlideChange}
          >
            {videos.map((video, i) => (
              <SwiperSlide key={i} className={styles.videoViewer__slide}>
                <VideoSlide
                  item={video}
                  isActive={i === index}
                  isMuted={isMuted}
                  isDesktop={isDesktop}
                  pageId={pageId}
                  onToggleMute={toggleMute}
                  onProductTag={(tags) => showProductTagList(tags)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {!isDesktop && (
        <div className={styles.videoViewer__overlay}>
          <div className={styles.videoViewer__topNav}>
            <div className={styles.videoViewer__navSide}>
              <Button
                onPress={onClose}
                className={styles.videoViewer__iconButton}
                aria-label="Close"
              >
                <CloseIcon className={styles.videoViewer__icon} />
              </Button>
            </div>
            {total > 1 && <span className={styles.videoViewer__counter}>{counter}</span>}
            <div className={styles.videoViewer__navSideEnd}>
              <Button
                onPress={toggleMute}
                className={styles.videoViewer__iconButton}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? (
                  <Muted className={styles.videoViewer__icon} />
                ) : (
                  <UnMutedOutlined className={styles.videoViewer__icon} />
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {isDesktop && (
        <>
          <div className={styles.videoViewer__desktopHeader}>
            <div className={styles.videoViewer__headerSide}>
              <Button
                onPress={onClose}
                className={styles.videoViewer__closeCircle}
                aria-label="Close"
              >
                <CloseIcon className={styles.videoViewer__closeCircleIcon} />
              </Button>
            </div>
            {total > 1 && <span className={styles.videoViewer__counter}>{counter}</span>}
            <div className={styles.videoViewer__headerSide} />
          </div>

          {hasPrev && (
            <Button
              onPress={() => swiperRef.current?.slidePrev()}
              className={styles.videoViewer__arrowLeft}
              aria-label="Previous video"
            >
              <ChevronLeft className={styles.videoViewer__arrowIcon} />
            </Button>
          )}
          {hasNext && (
            <Button
              onPress={() => swiperRef.current?.slideNext()}
              className={styles.videoViewer__arrowRight}
              aria-label="Next video"
            >
              <ChevronRight className={styles.videoViewer__arrowIcon} />
            </Button>
          )}
        </>
      )}
    </div>
  );
}

type VideoSlideProps = {
  item: VideoViewerItem;
  isActive: boolean;
  isMuted: boolean;
  isDesktop: boolean;
  pageId?: string;
  onToggleMute: () => void;
  onProductTag: (productTags: Amity.ProductTag[]) => void;
};

function VideoSlide({
  item,
  isActive,
  isMuted,
  isDesktop,
  pageId,
  onToggleMute,
  onProductTag,
}: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Swiper keeps every slide mounted and `autoPlay` only fires on mount, so we drive play/pause
  // of the shared player from `isActive`.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isActive) video.play().catch(() => {});
    else video.pause();
  }, [isActive]);

  return (
    <CustomVideoPlayer
      displayMode={isDesktop ? DisplayModeEnum.DESKTOP : DisplayModeEnum.MOBILE}
      autoPlay={isActive}
      isMuted={isActive ? isMuted : true}
      onClickMute={onToggleMute}
      externalVideoRef={videoRef}
      fileId={item.fileId}
      url={item.url}
      thumbnailFileId={item.thumbnailFileId ?? ''}
      thumbnailUrl={item.thumbnailUrl}
      productTags={item.productTags}
      pageId={pageId}
      onClickProductTagBadge={() => onProductTag(item.productTags ?? [])}
      className={isDesktop ? styles.videoViewer__desktopVideo : styles.videoViewer__video}
    />
  );
}
