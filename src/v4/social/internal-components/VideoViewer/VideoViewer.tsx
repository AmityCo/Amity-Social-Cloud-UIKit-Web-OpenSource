import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import type SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { useKeyPressEvent } from 'react-use';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
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
import {
  useFeedVideoAutoplay,
  useFeedVideoAutoplayOverlay,
  useFeedVideoSoundState,
} from '~/v4/social/features/feed-video-autoplay';
import styles from './VideoViewer.module.css';

export type VideoViewerItem = {
  playbackKey?: string;
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

function isPlayRefused(error: unknown) {
  return error instanceof DOMException && error.name === 'NotAllowedError';
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
  const [isMuted, setIsMuted] = useFeedVideoSoundState(false);

  useFeedVideoAutoplayOverlay();

  // Feed passes a `post`; derive its video/clip children into the shared item shape.
  const childPosts = usePostByIds(post?.children || []);
  const videos = useMemo<VideoViewerItem[]>(() => {
    if (videosProp) return videosProp;
    return childPosts
      .filter((child) => child.dataType === 'video' || child.dataType === 'clip')
      .map((child) => ({
        playbackKey: child.postId,
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
    setIsMuted(!isMuted);
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
                  onSoundRefused={() => setIsMuted(true)}
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
            {total > 1 && (
              <Typography.Title as="span" className={styles.videoViewer__counter}>
                {counter}
              </Typography.Title>
            )}
            <div className={styles.videoViewer__navSideEnd}>
              <Button
                onPress={toggleMute}
                className={styles.videoViewer__iconButton}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
                data-testid="video_player/sound_button"
                data-state={isMuted ? 'muted' : 'sound_on'}
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
            {total > 1 && (
              <Typography.Title as="span" className={styles.videoViewer__counter}>
                {counter}
              </Typography.Title>
            )}
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
  onSoundRefused: () => void;
  onProductTag: (productTags: Amity.ProductTag[]) => void;
};

function VideoSlide({
  item,
  isActive,
  isMuted,
  isDesktop,
  pageId,
  onToggleMute,
  onSoundRefused,
  onProductTag,
}: VideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const onSoundRefusedRef = useRef(onSoundRefused);
  onSoundRefusedRef.current = onSoundRefused;
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const { getPlayback, savePlayback } = useFeedVideoAutoplay();
  const [initialTime] = useState(() => {
    const playback = item.playbackKey ? getPlayback(item.playbackKey) : undefined;
    return playback && !playback.isEnded ? playback.position : 0;
  });

  useEffect(() => {
    const video = videoElement;
    const { playbackKey } = item;
    if (!isActive || !video || !playbackKey) return;

    // Keep what the events last saw: on close the player is torn down and no longer reports `ended`.
    let playback =
      video.readyState === HTMLMediaElement.HAVE_NOTHING
        ? getPlayback(playbackKey)
        : { position: video.currentTime, isEnded: video.ended };
    const savePosition = () => {
      if (video.readyState === HTMLMediaElement.HAVE_NOTHING) return;
      playback = { position: video.currentTime, isEnded: video.ended };
      savePlayback(playbackKey, playback);
    };

    video.addEventListener('timeupdate', savePosition);
    video.addEventListener('ended', savePosition);
    return () => {
      video.removeEventListener('timeupdate', savePosition);
      video.removeEventListener('ended', savePosition);
      if (playback) savePlayback(playbackKey, playback);
    };
  }, [isActive, item, videoElement, getPlayback, savePlayback]);

  // Swiper keeps every slide mounted and `autoPlay` only fires on mount, so we drive play/pause
  // of the shared player from `isActive`.
  useEffect(() => {
    const video = videoElement;
    if (!video) return;
    if (!isActive) {
      video.pause();
      return;
    }
    video.play().catch((error: unknown) => {
      if (!isPlayRefused(error) || video.muted) return;
      video.muted = true;
      video
        .play()
        .then(() => onSoundRefusedRef.current())
        .catch(() => {
          video.muted = false;
        });
    });
  }, [isActive, videoElement]);

  return (
    <CustomVideoPlayer
      displayMode={isDesktop ? DisplayModeEnum.DESKTOP : DisplayModeEnum.MOBILE}
      autoPlay={isActive}
      isMuted={isActive ? isMuted : true}
      initialTime={initialTime}
      onClickMute={onToggleMute}
      externalVideoRef={videoRef}
      onVideoElementChange={setVideoElement}
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
