import { useEffect, useMemo, useRef, useState, type MutableRefObject } from 'react';
import type SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import { useImage } from '~/v4/core/hooks/useImage';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import { formatAltText } from '~/v4/social/utils';
import { BrokenImage } from '~/v4/icons/BrokenImage';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import ChevronRight from '~/v4/icons/ChevronRight';
import VideoControl from '~/v4/icons/VideoControl';
import { ProductTagBadge } from '~/v4/social/features/product-tagged/internal-components/ProductTagBadge/ProductTagBadge';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks';
import {
  getFrameRatio,
  getVideoDisplayDims,
  FRAME_RATIO_CSS,
  DEFAULT_FRAME_RATIO,
  type FrameRatio,
} from '~/v4/social/features/posts/utils/getFrameRatio';
import { getIndicatorConfig } from '~/v4/social/features/posts/utils/getIndicatorConfig';
import { SWIPE_COMMIT_PX } from '~/v4/social/features/posts/constants';
import styles from './PostMediaElement.module.css';

type MediaPost = Amity.Post<'image'> | Amity.Post<'video'>;

function isMediaPost(post: Amity.Post): post is MediaPost {
  return post.dataType === 'image' || post.dataType === 'video';
}

function getAttachmentRatio(post?: MediaPost): FrameRatio {
  if (!post) return DEFAULT_FRAME_RATIO;

  if (post.dataType === 'image') {
    const image = post.getImageInfo();
    return getFrameRatio(image?.getWidth(), image?.getHeight());
  }

  const video = post.getVideoInfo();
  const { width, height } = getVideoDisplayDims({
    width: video?.getWidth(),
    height: video?.getHeight(),
    rotation: video?.getRotation(),
  });
  return getFrameRatio(width, height);
}

export type PostMediaControls = {
  slideTo: (index: number) => void;
};

export type PostMediaElementProps = {
  pageId?: string;
  componentId?: string;
  elementId?: string;
  posts: Amity.Post[];
  parentPostId: string;
  onImageClick: (index: number) => void;
  onVideoClick: (index: number) => void;
  controlsRef?: MutableRefObject<PostMediaControls | null>;
  ratioOverride?: FrameRatio;
};

export function PostMediaElement({
  posts,
  parentPostId,
  onImageClick,
  onVideoClick,
  controlsRef,
  ratioOverride,
  pageId = '*',
  componentId = '*',
  elementId = 'post_media',
}: PostMediaElementProps) {
  const { themeStyles } = useAmityElement({ pageId, componentId, elementId });
  const { isDesktop } = useResponsive();
  const [current, setCurrent] = useState(0);
  const swiperRef = useRef<SwiperCore | null>(null);
  const draggedRef = useRef(false);

  const mediaPosts = useMemo(() => (posts ?? []).filter(isMediaPost), [posts]);
  const computedRatio = useMemo(() => getAttachmentRatio(mediaPosts[0]), [mediaPosts]);
  const ratio = ratioOverride ?? computedRatio;

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.allowTouchMove = !isDesktop;
    }
  }, [isDesktop]);

  if (mediaPosts.length === 0) return null;

  const total = mediaPosts.length;
  const isCarousel = total > 1;

  const handleFrameClick = (index: number) => {
    if (draggedRef.current) return;
    const post = mediaPosts[index];
    if (post.dataType === 'image') onImageClick(index);
    else onVideoClick(index);
  };

  if (!isCarousel) {
    return (
      <div className={styles.postMedia} style={themeStyles}>
        <div className={styles.postMedia__track}>
          <PostMediaElement.Frame
            post={mediaPosts[0]}
            index={0}
            total={1}
            aspectRatio={FRAME_RATIO_CSS[ratio]}
            pageId={pageId}
            componentId={componentId}
            parentPostId={parentPostId}
            onPress={() => handleFrameClick(0)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.postMedia} style={themeStyles}>
      <div className={styles.postMedia__track}>
        <Swiper
          className={styles.postMedia__swiper}
          slidesPerView={1}
          threshold={SWIPE_COMMIT_PX}
          onSwiper={(swiper: SwiperCore) => {
            swiperRef.current = swiper;
            swiper.allowTouchMove = !isDesktop;
            if (controlsRef) {
              controlsRef.current = { slideTo: (index: number) => swiper.slideTo(index, 0) };
            }
          }}
          onTouchStart={() => {
            draggedRef.current = false;
          }}
          onSliderMove={() => {
            draggedRef.current = true;
          }}
          onTouchEnd={() => {
            requestAnimationFrame(() => {
              draggedRef.current = false;
            });
          }}
          onSlideChange={(swiper: SwiperCore) => setCurrent(swiper.activeIndex)}
        >
          {mediaPosts.map((post, index) => (
            <SwiperSlide key={post.postId} className={styles.postMedia__slide}>
              <PostMediaElement.Frame
                post={post}
                index={index}
                total={total}
                aspectRatio={FRAME_RATIO_CSS[ratio]}
                pageId={pageId}
                componentId={componentId}
                parentPostId={parentPostId}
                onPress={() => handleFrameClick(index)}
              />
            </SwiperSlide>
          ))}
        </Swiper>
        <PostMediaElement.Counter current={current} total={total} />
        <PostMediaElement.Arrows
          current={current}
          total={total}
          onPrev={() => swiperRef.current?.slidePrev()}
          onNext={() => swiperRef.current?.slideNext()}
        />
      </div>
      <PostMediaElement.Indicator current={current} total={total} />
    </div>
  );
}

type PaginationIndicatorProps = {
  current: number;
  total: number;
};

function PaginationIndicator({ current, total }: PaginationIndicatorProps) {
  const { dots } = getIndicatorConfig(current, total);

  return (
    <div className={styles.postMedia__indicator} aria-hidden="true">
      {dots.map((dot) => (
        <span key={dot.key} className={styles.postMedia__dotSlot}>
          <span className={styles.postMedia__dot} data-state={dot.state} data-side={dot.side} />
        </span>
      ))}
    </div>
  );
}

type DesktopArrowsProps = {
  current: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
};

function DesktopArrows({ current, total, onPrev, onNext }: DesktopArrowsProps) {
  const { isDesktop } = useResponsive();

  if (!isDesktop) return null;

  return (
    <>
      {current > 0 && (
        <Button className={styles.postMedia__arrowLeft} onPress={onPrev} aria-label="Previous">
          <ChevronLeft className={styles.postMedia__arrowIcon} />
        </Button>
      )}
      {current < total - 1 && (
        <Button className={styles.postMedia__arrowRight} onPress={onNext} aria-label="Next">
          <ChevronRight className={styles.postMedia__arrowIcon} />
        </Button>
      )}
    </>
  );
}

type PositionCounterProps = {
  current: number;
  total: number;
};

function PositionCounter({ current, total }: PositionCounterProps) {
  return (
    <div className={styles.postMedia__counter} aria-hidden="true">
      <Typography.Body className={styles.postMedia__counterLabel}>
        {current + 1}/{total}
      </Typography.Body>
    </div>
  );
}

type MediaFrameProps = {
  post: MediaPost;
  index: number;
  total: number;
  aspectRatio: string;
  pageId: string;
  componentId: string;
  parentPostId: string;
  onPress: () => void;
};

function MediaFrame({
  post,
  index,
  total,
  aspectRatio,
  pageId,
  componentId,
  parentPostId,
  onPress,
}: MediaFrameProps) {
  const { showProductTagList } = useShowProductTagList({
    pageId,
    mode: post.dataType === 'video' ? 'video' : 'image',
    sourceId: parentPostId,
  });

  const productTags = post.productTags ?? [];

  const altText = post.dataType === 'image' ? post.getImageInfo()?.altText : undefined;

  return (
    <Button
      onPress={onPress}
      className={styles.postMedia__frame}
      style={{ aspectRatio }}
      data-testid={`${pageId}/${componentId}/post_media`}
      aria-label={formatAltText({ total, current: index + 1, altText })}
    >
      {post.dataType === 'image' ? (
        <ImageMedia post={post as Amity.Post<'image'>} />
      ) : (
        <VideoMedia post={post as Amity.Post<'video'>} />
      )}
      {productTags.length > 0 && (
        <div className={styles.postMedia__productTag}>
          <ProductTagBadge
            selectedProductTags={productTags}
            onClick={() => showProductTagList(productTags)}
          />
        </div>
      )}
    </Button>
  );
}

type ImageMediaProps = { post: Amity.Post<'image'> };

function ImageMedia({ post }: ImageMediaProps) {
  const [isBroken, setIsBroken] = useState(false);
  const file = post.getImageInfo();

  if (!file?.fileUrl || isBroken) return <BrokenFrame />;

  return (
    <img
      loading="lazy"
      className={styles.postMedia__media}
      src={getFileUrlWithSize(file.fileUrl)}
      alt=""
      onError={() => setIsBroken(true)}
    />
  );
}

type VideoMediaProps = { post: Amity.Post<'video'> };

function VideoMedia({ post }: VideoMediaProps) {
  const { videoThumbnail } = useLayoutContext();
  const [isBroken, setIsBroken] = useState(false);

  const data = post.data as Amity.ContentDataVideo | undefined;
  const thumbnailFileId = data?.thumbnailFileId;
  const imageThumbnailUrl = useImage({ fileId: thumbnailFileId });

  let thumbnailUrl: string | undefined;
  if (!thumbnailFileId && data?.videoFileId?.original) {
    thumbnailUrl =
      videoThumbnail?.videos.find(({ fileId }) => fileId === data.videoFileId.original)
        ?.thumbnailUrl ?? imageThumbnailUrl;
  } else {
    thumbnailUrl = imageThumbnailUrl;
  }

  if (!thumbnailUrl || isBroken) return <BrokenFrame />;

  return (
    <>
      <img
        loading="lazy"
        className={styles.postMedia__media}
        src={thumbnailUrl}
        alt=""
        onError={() => setIsBroken(true)}
      />
      <div className={styles.postMedia__playButton}>
        <VideoControl className={styles.postMedia__playIcon} />
      </div>
    </>
  );
}

function BrokenFrame() {
  return (
    <div className={styles.postMedia__broken}>
      <BrokenImage className={styles.postMedia__brokenIcon} />
    </div>
  );
}

PostMediaElement.Frame = MediaFrame;

PostMediaElement.Counter = PositionCounter;

PostMediaElement.Indicator = PaginationIndicator;

PostMediaElement.Arrows = DesktopArrows;
