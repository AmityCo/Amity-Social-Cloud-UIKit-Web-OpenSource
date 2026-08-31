import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type MutableRefObject,
} from 'react';
import type SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import CloseIcon from '~/v4/icons/Close';
import ChevronLeft from '~/v4/icons/ChevronLeft';
import ChevronRight from '~/v4/icons/ChevronRight';
import ExclamationCircle from '~/v4/icons/ExclamationCircle';
import { Play } from '~/v4/icons/Play';
import { Button } from '~/v4/core/natives/Button';
import { getImageUrl } from '~/v4/utils/getImageUrl';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import { isAmityFile, isImageFile, isVideoFile } from '~/v4/utils/checkFileType';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { useImage } from '~/v4/core/hooks/useImage';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { AltTextBadge } from '~/v4/social/internal-components/AltTextBadge';
import { AltTextBottomSheet } from '~/v4/social/internal-components/ImageThumbnail/ImageThumbnail';
import { AltTextConfig } from '~/v4/social/components/AltTextConfig';
import {
  ImageViewer,
  type ImageViewerImage,
} from '~/v4/social/internal-components/ImageViewer/ImageViewer';
import { VideoViewer, type VideoViewerItem } from '~/v4/social/internal-components/VideoViewer';
import { BackButton } from '~/v4/social/elements';
import { Typography } from '~/v4/core/components';
import { usePopupContext } from '~/v4/core/providers/PopupProvider';
import { useString } from '~/v4/core/localization';
import { ProgressSpinner } from '~/v4/social/internal-components/ProgressSpinner/ProgressSpinner';
import { ProductTagBadge } from '~/v4/social/features/product-tagged/internal-components/ProductTagBadge';
import { useProductTagSelection } from '~/v4/social/features/product-tagged/hooks';
import { FileItem as TFileItem } from '~/v4/social/hooks/useFilePostUpload';
import {
  getFrameRatio,
  getVideoDisplayDims,
  FRAME_RATIO_CSS,
  DEFAULT_FRAME_RATIO,
  type FrameRatio,
} from '~/v4/social/features/posts/utils/getFrameRatio';
import styles from './SelectedMediaComponent.module.css';

export type SelectedMediaControls = {
  slideTo: (index: number) => void;
};

type MediaType = 'image' | 'video';

type ComposerFrame =
  | { kind: 'post'; mediaType: 'image'; id: string; post: Amity.Post<'image'> }
  | { kind: 'post'; mediaType: 'video'; id: string; post: Amity.Post<'video'> }
  | { kind: 'file'; mediaType: 'image'; id: string; item: TFileItem<'image'> }
  | { kind: 'file'; mediaType: 'video'; id: string; item: TFileItem<'video'> };

export type SelectedMediaComponentProps = {
  pageId?: string;
  componentId?: string;
  files: TFileItem[];
  postImages?: Amity.Post<'image'>[];
  postVideos?: Amity.Post<'video'>[];
  progress: { [key: string]: number };
  removeFile: (file: File | Amity.File, index?: number) => void;
  onRemovePostImage?: (fileId: string) => void;
  onRemovePostVideo?: (fileId: string) => void;
  onAltTextChange: (file: Amity.File<'image'>, altText: string) => void;
  onFileProductTagsChange?: (
    file: Amity.File<'image'> | Amity.File<'video'>,
    productTags: Amity.ProductTag[],
  ) => void;
  onChildPostProductTagsChange?: (postId: string, productTags: Amity.ProductTag[]) => void;
  onImageClick?: (index: number) => void;
  ratioRef?: MutableRefObject<FrameRatio | undefined>;
  productTagsReachLimit?: boolean;
  remainingLimit?: number;
  taggedProductIds?: string[];
  controlsRef?: MutableRefObject<SelectedMediaControls | null>;
};

const FRAME_RATIO_DECIMAL: Record<FrameRatio, number> = {
  '16:9': 16 / 9,
  '1:1': 1,
  '4:5': 4 / 5,
};

const VIEWER_POPUP_ID = 'composer-media-viewer';

function isSettledImageFrame(frame: ComposerFrame): boolean {
  if (frame.mediaType !== 'image') return false;
  if (frame.kind === 'post') return !!frame.post.getImageInfo();
  return isAmityFile(frame.item.file) && !frame.item.errorText;
}

function isSettledVideoFrame(frame: ComposerFrame): boolean {
  if (frame.mediaType !== 'video') return false;
  if (frame.kind === 'post') return !!frame.post.getVideoInfo();
  return isAmityFile(frame.item.file) && !frame.item.errorText;
}

function toViewerImage(frame: ComposerFrame): ImageViewerImage {
  if (frame.kind === 'post') {
    return {
      file: frame.post.getImageInfo() as Amity.File<'image'>,
      productTags: frame.post.productTags,
    };
  }
  return {
    file: frame.item.file as Amity.File<'image'>,
    productTags: frame.item.productTags,
  };
}

function toViewerVideo(frame: ComposerFrame): VideoViewerItem {
  if (frame.kind === 'post') {
    const videoFile = frame.post.getVideoInfo() as Amity.File<'video'> | undefined;
    return {
      fileId: videoFile?.fileId,
      thumbnailFileId: (frame.post.data as Amity.ContentDataVideo)?.thumbnailFileId,
      productTags: frame.post.productTags,
    };
  }
  const file = frame.item.file as Amity.File<'video'>;
  return {
    fileId: file.fileId,
    thumbnailUrl: frame.item.thumbnailVideo,
    productTags: frame.item.productTags,
  };
}

function getImageDims(file?: Amity.File<'image'>): { width?: number; height?: number } {
  const metadata = file?.attributes?.metadata as { width?: number; height?: number } | undefined;
  return { width: metadata?.width, height: metadata?.height };
}

function getVideoDims(file?: Amity.File<'video'>): { width?: number; height?: number } {
  return getVideoDisplayDims({
    width: file?.getWidth(),
    height: file?.getHeight(),
    rotation: file?.getRotation(),
  });
}

function getFrameRatioFromFrame(frame?: ComposerFrame): FrameRatio {
  if (!frame) return DEFAULT_FRAME_RATIO;
  if (frame.mediaType === 'video') {
    const record =
      frame.kind === 'post'
        ? (frame.post.getVideoInfo() as Amity.File<'video'> | undefined)
        : isAmityFile(frame.item.file)
          ? (frame.item.file as Amity.File<'video'>)
          : undefined;
    if (!record) return DEFAULT_FRAME_RATIO;
    const { width, height } = getVideoDims(record);
    return getFrameRatio(width, height);
  }
  if (frame.kind === 'post') {
    const { width, height } = getImageDims(frame.post.getImageInfo());
    return getFrameRatio(width, height);
  }
  if (isAmityFile(frame.item.file)) {
    const { width, height } = getImageDims(frame.item.file);
    return getFrameRatio(width, height);
  }
  return DEFAULT_FRAME_RATIO;
}

export function SelectedMediaComponent({
  files,
  progress,
  removeFile,
  postImages = [],
  postVideos = [],
  pageId = '*',
  componentId = '*',
  onRemovePostImage,
  onRemovePostVideo,
  onAltTextChange,
  onFileProductTagsChange,
  onChildPostProductTagsChange,
  onImageClick,
  ratioRef,
  productTagsReachLimit = false,
  remainingLimit,
  taggedProductIds,
  controlsRef,
}: SelectedMediaComponentProps) {
  const { themeStyles } = useAmityComponent({ pageId, componentId });
  const { isDesktop } = useResponsive();
  const { openPopup, closePopup } = usePopupContext();
  const [edges, setEdges] = useState({ isBeginning: true, isEnd: false });
  const [measured, setMeasured] = useState<{ file: File; ratio: FrameRatio } | null>(null);
  const swiperRef = useRef<SwiperCore | null>(null);
  const draggedRef = useRef(false);

  const frames = useMemo<ComposerFrame[]>(() => {
    const postImageFrames = postImages
      .filter((post) => !!post.getImageInfo() && !!post.postId)
      .map<ComposerFrame>((post) => ({ kind: 'post', mediaType: 'image', id: post.postId, post }));
    const postVideoFrames = postVideos
      .filter((post) => !!post.getVideoInfo() && !!post.postId)
      .map<ComposerFrame>((post) => ({ kind: 'post', mediaType: 'video', id: post.postId, post }));
    const fileFrames = files
      .filter((file) => isImageFile(file) || isVideoFile(file))
      .map<ComposerFrame>((item) =>
        isVideoFile(item)
          ? { kind: 'file', mediaType: 'video', id: item.id, item: item as TFileItem<'video'> }
          : { kind: 'file', mediaType: 'image', id: item.id, item: item as TFileItem<'image'> },
      );
    return [...postImageFrames, ...postVideoFrames, ...fileFrames];
  }, [postImages, postVideos, files]);

  const firstLocalFile = useMemo(() => {
    const first = frames[0];
    if (first?.kind === 'file' && !isAmityFile(first.item.file)) return first.item.file as File;
    return null;
  }, [frames]);

  const metadataRatio = useMemo(() => getFrameRatioFromFrame(frames[0]), [frames]);
  const measuredRatio = measured && measured.file === firstLocalFile ? measured.ratio : null;
  const ratio = measuredRatio ?? metadataRatio;

  if (ratioRef) ratioRef.current = ratio;

  useEffect(() => {
    if (!firstLocalFile) return;
    let active = true;
    const url = URL.createObjectURL(firstLocalFile);

    if (firstLocalFile.type.startsWith('video/')) {
      const video = document.createElement('video');
      video.onloadedmetadata = () => {
        if (active) {
          setMeasured({
            file: firstLocalFile,
            ratio: getFrameRatio(video.videoWidth, video.videoHeight),
          });
        }
        URL.revokeObjectURL(url);
      };
      video.onerror = () => URL.revokeObjectURL(url);
      video.src = url;
    } else {
      const img = new Image();
      img.onload = () => {
        if (active) {
          setMeasured({
            file: firstLocalFile,
            ratio: getFrameRatio(img.naturalWidth, img.naturalHeight),
          });
        }
        URL.revokeObjectURL(url);
      };
      img.onerror = () => URL.revokeObjectURL(url);
      img.src = url;
    }

    return () => {
      active = false;
      URL.revokeObjectURL(url);
    };
  }, [firstLocalFile]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.allowTouchMove = !isDesktop;
    }
  }, [isDesktop]);

  if (frames.length === 0) return null;

  const isCarousel = frames.length > 1;
  const aspectRatio = FRAME_RATIO_CSS[ratio];
  const containerStyle = {
    ...themeStyles,
    '--frame-ratio': FRAME_RATIO_DECIMAL[ratio],
  } as CSSProperties;

  const updateEdges = (swiper: SwiperCore) => {
    setEdges({ isBeginning: swiper.isBeginning, isEnd: swiper.isEnd });
  };

  const closeViewer = (returnIndex: number) => {
    closePopup(VIEWER_POPUP_ID);
    swiperRef.current?.slideTo(returnIndex, 0);
  };

  const removeFrame = (frame: ComposerFrame) => {
    if (frame.kind === 'post') {
      if (frame.mediaType === 'video') {
        const fileId = (frame.post.data as Amity.ContentDataVideo)?.videoFileId?.original;
        if (fileId) onRemovePostVideo?.(fileId);
      } else {
        const fileId = (frame.post.data as Amity.ContentDataImage)?.fileId;
        if (fileId) onRemovePostImage?.(fileId);
      }
    } else {
      removeFile(frame.item.file);
    }
  };

  const openImageViewer = (carouselIndex: number, tapped: ComposerFrame) => {
    const settled = frames.filter(isSettledImageFrame);
    const viewerIndex = settled.indexOf(tapped);
    if (viewerIndex < 0) return;
    openPopup({
      id: VIEWER_POPUP_ID,
      disabledAnimation: true,
      isDismissable: isDesktop,
      className: styles.selectedMedia__viewer,
      overlayClassName: styles.selectedMedia__viewerOverlay,
      onClose: () => closeViewer(carouselIndex),
      children: (
        <ImageViewer
          pageId={pageId}
          componentId={componentId}
          images={settled.map(toViewerImage)}
          initialImageIndex={viewerIndex}
          onClose={() => closeViewer(carouselIndex)}
        />
      ),
    });
  };

  const openVideoViewer = (carouselIndex: number, tapped: ComposerFrame) => {
    const settled = frames.filter(isSettledVideoFrame);
    const viewerIndex = settled.indexOf(tapped);
    if (viewerIndex < 0) return;
    openPopup({
      id: VIEWER_POPUP_ID,
      disabledAnimation: true,
      isDismissable: isDesktop,
      className: styles.selectedMedia__viewer,
      overlayClassName: styles.selectedMedia__viewerOverlay,
      onClose: () => closeViewer(carouselIndex),
      children: (
        <VideoViewer
          pageId={pageId}
          videos={settled.map(toViewerVideo)}
          initialIndex={viewerIndex}
          onClose={() => closeViewer(carouselIndex)}
        />
      ),
    });
  };

  const openViewer = (carouselIndex: number) => {
    onImageClick?.(carouselIndex);
    const tapped = frames[carouselIndex];
    if (!tapped) return;
    if (tapped.mediaType === 'video') return openVideoViewer(carouselIndex, tapped);
    return openImageViewer(carouselIndex, tapped);
  };

  const renderFrame = (frame: ComposerFrame, index: number) => (
    <SelectedMediaComponent.Frame
      key={frame.id}
      frame={frame}
      index={index}
      pageId={pageId}
      componentId={componentId}
      progress={progress}
      aspectRatio={aspectRatio}
      draggedRef={draggedRef}
      onRemoveFrame={removeFrame}
      onAltTextChange={onAltTextChange}
      onFileProductTagsChange={onFileProductTagsChange}
      onChildPostProductTagsChange={onChildPostProductTagsChange}
      onImageClick={openViewer}
      productTagsReachLimit={productTagsReachLimit}
      remainingLimit={remainingLimit}
      taggedProductIds={taggedProductIds}
    />
  );

  if (!isCarousel) {
    return (
      <div className={styles.selectedMedia} style={containerStyle} data-single="true">
        {renderFrame(frames[0], 0)}
      </div>
    );
  }

  return (
    <div className={styles.selectedMedia} style={containerStyle}>
      <div className={styles.selectedMedia__track}>
        <Swiper
          className={styles.selectedMedia__swiper}
          slidesPerView="auto"
          slidesOffsetBefore={isDesktop ? 24 : 16}
          slidesOffsetAfter={isDesktop ? 24 : 16}
          spaceBetween={8}
          onSwiper={(swiper: SwiperCore) => {
            swiperRef.current = swiper;
            swiper.allowTouchMove = !isDesktop;
            updateEdges(swiper);
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
          onSlideChange={updateEdges}
          onReachEnd={updateEdges}
          onReachBeginning={updateEdges}
          onFromEdge={updateEdges}
          onResize={updateEdges}
          onUpdate={updateEdges}
        >
          {frames.map((frame, index) => (
            <SwiperSlide key={frame.id} className={styles.selectedMedia__slide}>
              {renderFrame(frame, index)}
            </SwiperSlide>
          ))}
        </Swiper>
        <SelectedMediaComponent.Arrows
          canPrev={!edges.isBeginning}
          canNext={!edges.isEnd}
          onPrev={() => swiperRef.current?.slidePrev()}
          onNext={() => swiperRef.current?.slideNext()}
        />
      </div>
    </div>
  );
}

type DesktopArrowsProps = {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
};

function DesktopArrows({ canPrev, canNext, onPrev, onNext }: DesktopArrowsProps) {
  const { isDesktop } = useResponsive();

  if (!isDesktop) return null;

  return (
    <>
      {canPrev && (
        <Button className={styles.selectedMedia__arrowLeft} onPress={onPrev} aria-label="Previous">
          <ChevronLeft className={styles.selectedMedia__arrowIcon} />
        </Button>
      )}
      {canNext && (
        <Button className={styles.selectedMedia__arrowRight} onPress={onNext} aria-label="Next">
          <ChevronRight className={styles.selectedMedia__arrowIcon} />
        </Button>
      )}
    </>
  );
}

type FrameProps = {
  frame: ComposerFrame;
  index: number;
  pageId: string;
  componentId: string;
  aspectRatio: string;
  progress: { [key: string]: number };
  draggedRef: MutableRefObject<boolean>;
  onRemoveFrame: (frame: ComposerFrame) => void;
  onAltTextChange: SelectedMediaComponentProps['onAltTextChange'];
  onFileProductTagsChange?: SelectedMediaComponentProps['onFileProductTagsChange'];
  onChildPostProductTagsChange?: SelectedMediaComponentProps['onChildPostProductTagsChange'];
  onImageClick?: SelectedMediaComponentProps['onImageClick'];
  productTagsReachLimit?: boolean;
  remainingLimit?: number;
  taggedProductIds?: string[];
};

function Frame({
  frame,
  index,
  pageId,
  componentId,
  aspectRatio,
  progress,
  draggedRef,
  onRemoveFrame,
  onAltTextChange,
  onFileProductTagsChange,
  onChildPostProductTagsChange,
  onImageClick,
  productTagsReachLimit = false,
  remainingLimit,
  taggedProductIds,
}: FrameProps) {
  const isVideo = frame.mediaType === 'video';
  const isFile = frame.kind === 'file';
  const item = isFile ? frame.item : undefined;
  const isUploading = !!item && progress[item.id] != null && !isAmityFile(item.file);
  const hasError = !!item && !!item.errorText && !isAmityFile(item.file);
  const isSettled = !isUploading && !hasError;

  const localImageFile =
    frame.kind === 'file' && frame.mediaType === 'image' && !isAmityFile(frame.item.file)
      ? (frame.item.file as File)
      : null;

  const [localUrl, setLocalUrl] = useState<string | null>(null);
  useEffect(() => {
    if (!localImageFile) {
      setLocalUrl(null);
      return;
    }
    const url = URL.createObjectURL(localImageFile);
    setLocalUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [localImageFile]);

  const postVideoThumbFileId =
    frame.kind === 'post' && frame.mediaType === 'video'
      ? (frame.post.data as Amity.ContentDataVideo)?.thumbnailFileId
      : undefined;
  const postVideoThumbUrl = useImage({ fileId: postVideoThumbFileId });

  let src = '';
  if (isVideo) {
    src = frame.kind === 'post' ? postVideoThumbUrl ?? '' : frame.item.thumbnailVideo ?? '';
  } else if (frame.kind === 'post') {
    const postFileUrl = frame.post.getImageInfo()?.fileUrl;
    src = postFileUrl ? getFileUrlWithSize(postFileUrl) : '';
  } else {
    src = isAmityFile(frame.item.file) ? getImageUrl(frame.item) : localUrl ?? '';
  }

  const altText =
    !isVideo && frame.kind === 'post'
      ? frame.post.getImageInfo()?.altText ?? ''
      : !isVideo && isAmityFile(frame.item.file)
        ? (frame.item.file as Amity.File<'image'>).altText ?? ''
        : '';

  const handlePress = () => {
    if (draggedRef.current || !isSettled) return;
    onImageClick?.(index);
  };

  const mediaLabel = isVideo ? 'video' : 'image';

  return (
    <div className={styles.selectedMedia__frame} style={{ aspectRatio }}>
      <Button
        className={styles.selectedMedia__media__button}
        onPress={handlePress}
        aria-label={`${mediaLabel} ${index + 1}`}
      >
        <img className={styles.selectedMedia__media} src={src} alt={altText} />
      </Button>

      {(isUploading || hasError) && <div className={styles.selectedMedia__overlay} />}

      {isVideo && isSettled && (
        <div className={styles.selectedMedia__playDisc}>
          <Play className={styles.selectedMedia__playGlyph} />
        </div>
      )}

      <Button
        type="reset"
        className={styles.selectedMedia__remove}
        onPress={() => onRemoveFrame(frame)}
        aria-label={`Remove ${mediaLabel} ${index + 1}`}
        data-testid={`${pageId}/${componentId}/remove_media`}
      >
        <CloseIcon className={styles.selectedMedia__removeIcon} />
      </Button>

      {isUploading && (
        <div className={styles.selectedMedia__state}>
          <ProgressSpinner progress={progress[item!.id] ?? 100} />
        </div>
      )}
      {hasError && (
        <div className={styles.selectedMedia__state}>
          <ExclamationCircle className={styles.selectedMedia__errorIcon} />
        </div>
      )}

      {isSettled && (
        <FrameControls
          frame={frame}
          pageId={pageId}
          onAltTextChange={onAltTextChange}
          onFileProductTagsChange={onFileProductTagsChange}
          onChildPostProductTagsChange={onChildPostProductTagsChange}
          productTagsReachLimit={productTagsReachLimit}
          remainingLimit={remainingLimit}
          taggedProductIds={taggedProductIds}
        />
      )}
    </div>
  );
}

type FrameControlsProps = {
  frame: ComposerFrame;
  pageId: string;
  onAltTextChange: SelectedMediaComponentProps['onAltTextChange'];
  onFileProductTagsChange?: SelectedMediaComponentProps['onFileProductTagsChange'];
  onChildPostProductTagsChange?: SelectedMediaComponentProps['onChildPostProductTagsChange'];
  productTagsReachLimit?: boolean;
  remainingLimit?: number;
  taggedProductIds?: string[];
};

function FrameControls({
  frame,
  pageId,
  onAltTextChange,
  onFileProductTagsChange,
  onChildPostProductTagsChange,
  productTagsReachLimit = false,
  remainingLimit,
  taggedProductIds,
}: FrameControlsProps) {
  const productTags =
    frame.kind === 'post' ? frame.post.productTags ?? [] : frame.item.productTags ?? [];
  const showProductTag =
    (frame.kind === 'post' ? !!onChildPostProductTagsChange : !!onFileProductTagsChange) &&
    (productTags.length !== 0 || !productTagsReachLimit);

  const { openProductTagSelection } = useProductTagSelection<MediaType>({
    pageId,
    onFileProductTagsChange: onFileProductTagsChange as (
      file: Amity.File<MediaType>,
      productTags: Amity.ProductTag[],
    ) => void,
    onChildPostProductTagsChange,
    taggedProductIds,
  });

  const handleProductTagClick = () => {
    if (frame.kind === 'post') {
      openProductTagSelection({
        postId: frame.post.postId,
        initialProductTags: frame.post.productTags,
        remainingLimit,
      });
      return;
    }
    if (!isAmityFile(frame.item.file)) return;
    openProductTagSelection({
      file: frame.item.file,
      initialProductTags: frame.item.productTags,
      remainingLimit,
    });
  };

  const altFile =
    frame.kind === 'file' && frame.mediaType === 'image' && isAmityFile(frame.item.file)
      ? frame.item.file
      : null;

  return (
    <>
      {altFile && (
        <div className={styles.selectedMedia__altText}>
          <AltTextControl file={altFile} onAltTextChange={onAltTextChange} />
        </div>
      )}
      {showProductTag && (
        <div className={styles.selectedMedia__productTag}>
          <ProductTagBadge selectedProductTags={productTags} onClick={handleProductTagClick} />
        </div>
      )}
    </>
  );
}

type AltTextControlProps = {
  file: Amity.File<'image'>;
  onAltTextChange: SelectedMediaComponentProps['onAltTextChange'];
};

function AltTextControl({ file, onAltTextChange }: AltTextControlProps) {
  const { openPopup } = usePopupContext();
  const { isDesktop } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const addAltTextTitle = useString('amity_social_label_image_add_alt_text_title');

  return (
    <>
      <AltTextBadge
        completed={!!file.altText}
        onPress={() => {
          if (!isDesktop) {
            setIsOpen(true);
            return;
          }
          openPopup({
            children: ({ close }) => (
              <AltTextConfig
                result={(altText: string) => {
                  onAltTextChange(file, altText);
                  close();
                }}
                mode={
                  file.altText !== null
                    ? {
                        type: 'edit',
                        altText: file.altText || '',
                        media: { type: 'image', image: file },
                      }
                    : { type: 'create', media: { type: 'image', image: file } }
                }
                renderHeader={({ count }) => (
                  <div className={styles.selectedMedia__altTextHeader}>
                    <BackButton
                      onPress={close}
                      defaultClassName={styles.selectedMedia__altTextHeader__icon}
                    />
                    <div>
                      <Typography.Headline>{addAltTextTitle}</Typography.Headline>
                      <Typography.Caption className={styles.selectedMedia__altTextHeader__count}>
                        {count}/180
                      </Typography.Caption>
                    </div>
                  </div>
                )}
              />
            ),
          });
        }}
      />
      <AltTextBottomSheet
        file={file}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onAltTextChange={onAltTextChange}
      />
    </>
  );
}

SelectedMediaComponent.Frame = Frame;
SelectedMediaComponent.Arrows = DesktopArrows;
