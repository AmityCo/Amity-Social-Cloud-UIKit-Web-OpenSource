import { useCallback, useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import type SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useKeyPressEvent } from 'react-use';
import useFile from '~/v4/core/hooks/useFile';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Button } from '~/v4/core/natives/Button';
import usePostByIds from '~/v4/core/hooks/usePostByIds';
import { isClipPost, isVideoPost } from '~/v4/social/utils/postTypeChecker';
import { VideoPlayer as CustomVideoPlayer } from '~/v4/social/internal-components/VideoPlayer/VideoPlayer';
import { DisplayModeEnum } from '~/v4/social/types';
import { formatDuration } from '~/v4/social/utils/formatDuration';
import CloseIcon from '~/v4/icons/Close';
import { Play } from '~/v4/icons/Play';
import { Pause } from '~/v4/icons/Pause';
import Muted from '~/v4/icons/Muted';
import UnMutedOutlined from '~/v4/icons/UnMutedOutlined';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import ChevronRight from '~/v4/icons/ChevronRight';
import { ProductTagBadge } from '~/v4/social/features/product-tagged/internal-components/ProductTagBadge';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks';
import styles from './VideoViewer.module.css';

enum VideoFileStatus {
  Transcoded = 'transcoded',
}

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

function resolveVideoUrl(item?: VideoViewerItem, file?: Amity.File<'video'>): string | undefined {
  if (item?.url) return item.url;
  if (!file) return undefined;
  if (file.status === VideoFileStatus.Transcoded) {
    const { videoUrl } = file;
    return (
      videoUrl?.['1080p'] ||
      videoUrl?.['720p'] ||
      videoUrl?.['480p'] ||
      videoUrl?.['360p'] ||
      videoUrl?.original ||
      file.fileUrl
    );
  }
  return file.fileUrl;
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
  const videoRefs = useRef<Array<HTMLVideoElement | null>>([]);

  const [index, setIndex] = useState(initialIndex);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Feed passes a `post`; derive its video/clip children into the shared item shape.
  const childPosts = usePostByIds(post?.children || []);
  const videos = useMemo<VideoViewerItem[]>(() => {
    if (videosProp) return videosProp;
    return childPosts
      .filter((child) => child.dataType === 'video' || child.dataType === 'clip')
      .map((child) => ({
        fileId: getPostVideoFileId(child as Amity.Post<'video' | 'clip'>),
        thumbnailFileId: (child.data as Amity.ContentDataVideo | Amity.ContentDataClip)
          ?.thumbnailFileId,
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

  const activeVideo = () => videoRefs.current[index];

  // Only the active video plays; every other one is paused (Swiper keeps them all mounted).
  const handleSlideChange = (swiper: SwiperCore) => {
    const nextIndex = swiper.activeIndex;
    videoRefs.current.forEach((video, i) => {
      if (video && i !== nextIndex) video.pause();
    });
    const active = videoRefs.current[nextIndex];
    if (active) {
      active.currentTime = 0;
      active.play().catch(() => {});
    }
    setCurrentTime(0);
    setDuration(active?.duration || 0);
    setIndex(nextIndex);
  };

  const togglePlay = () => {
    const video = activeVideo();
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const seek = (seconds: number) => {
    const video = activeVideo();
    if (!video) return;
    video.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const handleProductTagClick = useCallback(() => {
    showProductTagList(item?.productTags ?? []);
  }, [item?.productTags, showProductTagList]);

  const productTags = item?.productTags ?? [];
  const counter = `${index + 1} / ${total}`;
  const progress = duration > 0 ? currentTime / duration : 0;

  const productTagBadge = productTags.length > 0 && (
    <div className={styles.videoViewer__tag}>
      <ProductTagBadge selectedProductTags={productTags} onClick={handleProductTagClick} />
    </div>
  );

  const seekBar = (
    <input
      type="range"
      className={styles.videoViewer__seek}
      min={0}
      max={duration || 0}
      step="any"
      value={currentTime}
      onChange={(e) => seek(Number(e.target.value))}
      aria-label="Seek"
      style={{ '--progress': `${progress * 100}%` } as React.CSSProperties}
    />
  );

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
                  registerRef={(el) => {
                    videoRefs.current[i] = el;
                  }}
                  onTogglePlay={togglePlay}
                  onToggleMute={toggleMute}
                  onPlay={() => i === index && setIsPlaying(true)}
                  onPause={() => i === index && setIsPlaying(false)}
                  onTime={(t) => i === index && setCurrentTime(t)}
                  onMeta={(d) => i === index && setDuration(d)}
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

          <Button
            onPress={togglePlay}
            className={styles.videoViewer__playCenter}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className={styles.videoViewer__playIcon} />
            ) : (
              <Play className={styles.videoViewer__playIcon} />
            )}
          </Button>

          <div className={styles.videoViewer__bottom}>
            {productTagBadge}
            <div className={styles.videoViewer__times}>
              <span>{formatDuration(currentTime)}</span>
              <span>{formatDuration(duration)}</span>
            </div>
            {seekBar}
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
  registerRef: (el: HTMLVideoElement | null) => void;
  onTogglePlay: () => void;
  onToggleMute: () => void;
  onPlay: () => void;
  onPause: () => void;
  onTime: (time: number) => void;
  onMeta: (duration: number) => void;
  onProductTag: (productTags: Amity.ProductTag[]) => void;
};

function VideoSlide({
  item,
  isActive,
  isMuted,
  isDesktop,
  pageId,
  registerRef,
  onTogglePlay,
  onToggleMute,
  onPlay,
  onPause,
  onTime,
  onMeta,
  onProductTag,
}: VideoSlideProps) {
  const file = useFile<'video'>(item.fileId);
  const posterFile = useFile(item.thumbnailFileId);
  const url = useMemo(() => resolveVideoUrl(item, file), [item, file]);
  const poster = item.thumbnailUrl ?? posterFile?.fileUrl;
  const desktopVideoRef = useRef<HTMLVideoElement>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);

  // Swiper keeps every slide mounted and `autoPlay` only fires on mount, so on desktop we drive
  // play/pause of the shared player from `isActive`.
  useEffect(() => {
    if (!isDesktop) return;
    const video = desktopVideoRef.current;
    if (!video) return;
    if (isActive) video.play().catch(() => {});
    else video.pause();
  }, [isActive, isDesktop]);

  useEffect(() => {
    if (isDesktop) return;
    const video = mobileVideoRef.current;
    if (video) video.muted = isActive ? isMuted : true;
  }, [isActive, isDesktop, isMuted]);

  // Desktop follows the existing feed viewer's UI: reuse the shared CustomVideoPlayer + its controls.
  if (isDesktop) {
    return (
      <CustomVideoPlayer
        displayMode={DisplayModeEnum.DESKTOP}
        autoPlay={isActive}
        isMuted={isActive ? isMuted : true}
        onClickMute={onToggleMute}
        externalVideoRef={desktopVideoRef}
        fileId={item.fileId}
        thumbnailFileId={item.thumbnailFileId ?? ''}
        thumbnailUrl={item.thumbnailUrl}
        productTags={item.productTags}
        pageId={pageId}
        onClickProductTagBadge={() => onProductTag(item.productTags ?? [])}
        className={styles.videoViewer__desktopVideo}
      />
    );
  }

  return (
    <video
      ref={(el) => {
        mobileVideoRef.current = el;
        registerRef(el);
      }}
      className={styles.videoViewer__video}
      playsInline
      autoPlay={isActive}
      preload={isActive ? 'auto' : 'none'}
      poster={poster}
      onClick={onTogglePlay}
      onPlay={onPlay}
      onPause={onPause}
      onTimeUpdate={(e) => onTime(e.currentTarget.currentTime)}
      onLoadedMetadata={(e) => onMeta(e.currentTarget.duration)}
    >
      {url && <source src={url} type="video/mp4" />}
    </video>
  );
}
