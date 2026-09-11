import { useEffect, useRef, useState, type MutableRefObject } from 'react';
import type SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { formatAltText } from '~/v4/social/utils';
import { Button } from '~/v4/core/natives/Button';
import { Typography } from '~/v4/core/components';
import ChevronRight from '~/v4/icons/ChevronRight';
import { useAmityElement } from '~/v4/core/hooks/uikit';
import { Popover } from '~/v4/core/components/AriaPopover';
import { ClearButton } from '~/v4/social/elements/ClearButton';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { getFileUrlWithSize } from '~/v4/utils/getFileUrlWithSize';
import { MenuButton } from '~/v4/social/elements';
import { MediaMenu } from '~/v4/social/internal-components/MediaMenu';
import { AltTextBottomSheet } from '~/v4/social/internal-components/ImageThumbnail/ImageThumbnail';
import { ProductTagBadge } from '~/v4/social/features/product-tagged/internal-components/ProductTagBadge/ProductTagBadge';
import { useShowProductTagList } from '~/v4/social/features/product-tagged/hooks/useShowProductTagList';
import styles from './ImageViewer.module.css';
import { usePostPermissions } from '~/v4/core/hooks/usePostPermissions';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { UserProfileTabs } from '~/v4/social/pages/UserProfilePage/UserProfilePage';
import { FeedSourceEnum } from '@amityco/ts-sdk';
import { MediaTabType } from '~/v4/social/constants/mediaTabs';
import { useResponsive } from '~/v4/core/hooks/useResponsive';

export type ImageViewerImage = {
  file: Amity.File<'image'>;
  productTags?: Amity.ProductTag[];
};

type ImageViewerProps = {
  pageId?: string;
  onClose(): void;
  post?: Amity.Post;
  images?: ImageViewerImage[];
  elementId?: string;
  componentId?: string;
  initialImageIndex: number;
  isFromGallery?: boolean;
  target?: 'community' | 'user';
  feedSources?: FeedSourceEnum[];
  indexRef?: MutableRefObject<number>;
};

export function ImageViewer({
  post,
  images,
  onClose,
  target,
  pageId = '*',
  elementId = '*',
  componentId = '*',
  initialImageIndex,
  isFromGallery,
  feedSources,
  indexRef,
}: ImageViewerProps) {
  const { isOwner } = usePostPermissions({ post });
  const { isDesktop } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(initialImageIndex);
  const swiperRef = useRef<SwiperCore | null>(null);
  const { goToPostDetailPage } = useNavigation();

  useEffect(() => {
    if (indexRef) indexRef.current = selectedImageIndex;
  }, [selectedImageIndex, indexRef]);

  useEffect(() => {
    if (swiperRef.current) {
      swiperRef.current.allowTouchMove = !isDesktop;
    }
  }, [isDesktop]);

  const { setLinkToPost } = useLayoutContext();

  const useImages = images != null;
  const isParentPost = !useImages && (post?.children.length ?? 0) > 0;

  const slides: ImageViewerImage[] = useImages
    ? images
    : isParentPost
      ? (post?.childrenPosts ?? []).map((child) => ({
          file: child.getImageInfo() as Amity.File<'image'>,
          productTags: child.productTags,
        }))
      : post?.getImageInfo()
        ? [{ file: post.getImageInfo() as Amity.File<'image'>, productTags: post.productTags }]
        : [];

  const total = slides.length;
  const imageFile = slides[selectedImageIndex]?.file;
  const hasPrev = selectedImageIndex > 0;
  const hasNext = selectedImageIndex < total - 1;

  const { setDrawerData, removeDrawerData } = useDrawer();
  const { themeStyles, accessibilityId } = useAmityElement({ pageId, componentId, elementId });
  const { showProductTagList } = useShowProductTagList({
    pageId,
    mode: 'image',
    sourceId: post?.postId ?? '',
  });

  const redirectToPostDetailPage = () => {
    if (!post) return;
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

      {total > 1 && (
        <Typography.TitleBold className={styles.imageViewer__count} as="p">
          {selectedImageIndex + 1} / {total}
        </Typography.TitleBold>
      )}

      {hasPrev && (
        <Button
          onPress={() => swiperRef.current?.slidePrev()}
          className={styles.imageViewer__prev}
          aria-label="Click to go to previous image"
        >
          <ChevronRight className={styles.imageViewer__prev__icon} />
        </Button>
      )}

      <Swiper
        className={styles.imageViewer__swiper}
        slidesPerView={1}
        initialSlide={initialImageIndex}
        onSwiper={(swiper: SwiperCore) => {
          swiperRef.current = swiper;
          swiper.allowTouchMove = !isDesktop;
        }}
        onSlideChange={(swiper: SwiperCore) => setSelectedImageIndex(swiper.activeIndex)}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index} className={styles.imageViewer__slide}>
            <ImageSlide
              slide={slide}
              index={index}
              total={total}
              showProductTagList={showProductTagList}
            />
          </SwiperSlide>
        ))}
      </Swiper>

      {hasNext && (
        <Button
          onPress={() => swiperRef.current?.slideNext()}
          className={styles.imageViewer__next}
          aria-label="Click to go to next image"
        >
          <ChevronRight className={styles.imageViewer__next__icon} />
        </Button>
      )}

      {imageFile && isOwner && !isDesktop && (
        <AltTextBottomSheet file={imageFile} mode="edit" isOpen={isOpen} setIsOpen={setIsOpen} />
      )}
    </div>
  );
}

type ImageSlideProps = {
  slide: ImageViewerImage;
  index: number;
  total: number;
  showProductTagList: (productTags: Amity.ProductTag[]) => void;
};

function ImageSlide({ slide, index, total, showProductTagList }: ImageSlideProps) {
  const [isBrokenImg, setIsBrokenImg] = useState(false);
  const file = slide.file;
  const productTags = slide.productTags ?? [];

  return (
    <div
      aria-live="assertive"
      className={styles.imageViewer__imageContainer}
      data-testid="image-viewer-container"
    >
      {file?.fileUrl && !isBrokenImg ? (
        <img
          onError={() => setIsBrokenImg(true)}
          className={styles.imageViewer__fullImage}
          src={getFileUrlWithSize(file.fileUrl)}
          alt={formatAltText({ current: index + 1, total, altText: file.altText })}
        />
      ) : (
        <div
          role="status"
          aria-label="loading image"
          className={styles.imageViewer__itemContainer}
        />
      )}
      {productTags.length > 0 && (
        <div className={styles.imageViewer__productTagBadge}>
          <ProductTagBadge
            selectedProductTags={productTags}
            onClick={() => showProductTagList(productTags)}
          />
        </div>
      )}
    </div>
  );
}
