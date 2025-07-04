import React, { useState, useRef, useEffect } from 'react';
import type SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, Mousewheel, FreeMode } from 'swiper/modules';
import { VideoFullScreen } from './VideoFullScreen/VideoFullScreen';
import { getFileUrl } from '~/v4/utils/getFileUrl';
import { BackButton } from '~/v4/social/elements';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { ClipHeader } from './CommunityHeader/CommunityHeader';
import { CreateNewClipButton } from '~/v4/social/elements/CreateNewClipButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { ClipFeedMenu } from './ClipFeedMenu/ClipFeedMenu';
import { ClipCaption } from './ClipCaption/ClipCaption';
import styles from './ClipFeedPage.module.css';
import { useDrawer } from '~/v4/core/providers/DrawerProvider';
import { Button } from '~/v4/core/components/AriaButton';
import { ViewPost } from '~/v4/icons/ViewPost';
import { Typography } from '~/v4/core/components';
import usePost from '~/v4/core/hooks/objects/usePost';

type ClipFeedPageProps = {
  posts?: Amity.Post<'video' | 'clip'>[];
  currentPostId?: string;
};

export const ClipFeedPage = ({ posts, currentPostId }: ClipFeedPageProps) => {
  const pageId = 'clip_feed_page';

  const { accessibilityId, themeStyles, config } = useAmityPage({
    pageId,
  });
  const { onBack } = useNavigation();
  const { AmityClipFeedPageBehavior } = usePageBehavior();
  const { prevPage } = useNavigation();
  const { setDrawerData, removeDrawerData } = useDrawer();

  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const swiperRef = useRef<SwiperCore | null>(null);
  const [isLocalMuted, setIsLocalMuted] = useState(false);
  const [isShowInteractionMenu, setIsShowInteractionMenu] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  // for post content render with no posts
  const { post, isLoading } = usePost(currentPostId, posts?.length == 0);

  // Hide interaction menu for pending post
  useEffect(() => {
    if (prevPage?.type === PageTypes.PendingRequestPage) {
      setIsShowInteractionMenu(false);
    }
  }, []);

  // Set initial active index based on currentPostId
  useEffect(() => {
    if (currentPostId && posts && posts.length > 0) {
      const index = posts.findIndex((post) => post.postId === currentPostId);
      if (index !== -1) {
        setActiveIndex(index);
        // If Swiper is already initialized, slide to the new index
        if (swiperRef.current) {
          swiperRef.current.slideTo(index);
        }
      }
    }
  }, [currentPostId, posts]);

  const handleSlideChange = (swiper: SwiperCore) => {
    setActiveIndex(swiper.activeIndex);
  };

  const handleVideoToggle = (postId: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }

    const video = videoRefs.current[postId];
    if (video) {
      if (video.paused) {
        video.play().catch((error) => {
          console.warn('Failed to play video:', error);
        });
      } else {
        video.pause();
      }
    }
  };

  const handleNextVideo = () => {
    if (swiperRef.current && posts && activeIndex < posts.length - 1) {
      swiperRef.current.slideNext();
    }
  };

  const handleMuteToggle = () => {
    setIsLocalMuted((prev) => !prev);
  };

  const handleMenuClick = (postId: string) => {
    setDrawerData({
      content: (
        <Button
          variant="text"
          className={styles.clipFeedPage__viewPostButton}
          data-testid={`${pageId}/*/view_post_button`}
          onPress={() => {
            AmityClipFeedPageBehavior?.goToPostDetailPage?.({
              postId,
              posts,
            });
            removeDrawerData();
          }}
        >
          <ViewPost className={styles.clipFeedPage__viewPostIcon} />
          <Typography.BodyBold className={styles.clipFeedPage__viewPostText}>
            View post
          </Typography.BodyBold>
        </Button>
      ),
    });
  };

  // Preload next/prev videos
  useEffect(() => {
    const preloadVideo = (index: number) => {
      const post = posts?.[index];
      if (!post) return;

      const url = getFileUrl(post as Amity.Post<'video' | 'clip'>);
      if (!url) return;

      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'video';
      link.href = url;
      document.head.appendChild(link);

      // Cleanup to avoid too many <link> tags
      return () => document.head.removeChild(link);
    };

    const cleanups: (() => void)[] = [];

    if (posts) {
      // Preload next video
      if (activeIndex + 1 < posts.length) {
        const cleanup = preloadVideo(activeIndex + 1);
        if (cleanup) cleanups.push(cleanup);
      }

      // Preload previous video
      if (activeIndex - 1 >= 0) {
        const cleanup = preloadVideo(activeIndex - 1);
        if (cleanup) cleanups.push(cleanup);
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [activeIndex, posts]);

  const handleDragging = (val: boolean) => setIsDragging(val);

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.clipFeedPage__container}
    >
      <Swiper
        direction={'vertical'}
        pagination={{ clickable: true }}
        scrollbar={{ draggable: true }}
        mousewheel={currentPostId && (!posts || posts.length === 0) ? false : true}
        freeMode={false}
        allowTouchMove={currentPostId && (!posts || posts.length === 0) ? false : true}
        modules={[Scrollbar, Mousewheel, FreeMode]}
        className={styles.clipFeedPage__swiperContainer}
        slidesPerView={1}
        initialSlide={activeIndex}
        onSwiper={(swiper: SwiperCore) => (swiperRef.current = swiper)}
        onSlideChange={handleSlideChange}
      >
        {posts && posts.length > 0 ? (
          posts.map((post, index) => (
            <SwiperSlide
              key={post.postId}
              className={styles.clipFeedPage__swiperSlide}
              onClick={() => handleVideoToggle(post.postId)}
            >
              <div className={styles.clipFeedPage__clipContainer}>
                <VideoFullScreen
                  post={post as Amity.Post}
                  isActive={index === activeIndex}
                  videoRefs={videoRefs}
                  onClickVideo={handleVideoToggle}
                  onNextVideo={handleNextVideo}
                  isDragging={isDragging}
                  onDragging={handleDragging}
                  isLocalMuted={isLocalMuted}
                />
                <div className={styles.clipFeedPage__header}>
                  <BackButton
                    pageId={pageId}
                    onPress={() => onBack()}
                    defaultClassName={styles.clipFeedPage__backButton}
                  />
                  <ClipHeader
                    pageId={pageId}
                    targetId={post.targetId}
                    targetType={post.targetType}
                  />
                  {isShowInteractionMenu ? (
                    <CreateNewClipButton
                      onClick={() =>
                        AmityClipFeedPageBehavior?.goToSelectClipPostTargetPage?.({
                          isClipPost: true,
                        })
                      }
                    />
                  ) : (
                    <div />
                  )}
                </div>
                <ClipFeedMenu
                  postId={post.parentPostId}
                  childPost={post}
                  isShowInteractionMenu={isShowInteractionMenu}
                  isDragging={isDragging}
                  handleMuteToggle={handleMuteToggle}
                  isLocalMuted={isLocalMuted}
                  onClickMenuButton={() => handleMenuClick(post.parentPostId)}
                />
                <ClipCaption
                  postId={post.parentPostId}
                  creator={post.creator}
                  isDragging={isDragging}
                  onClickSeeMoreButton={() => handleMenuClick(post.parentPostId)}
                  onClickUser={() =>
                    AmityClipFeedPageBehavior?.goToUserProfilePage?.({
                      userId: post.creator?.userId as string,
                    })
                  }
                  isLoading={isLoading}
                />
              </div>
            </SwiperSlide>
          ))
        ) : currentPostId && post ? (
          <SwiperSlide
            key={post.postId}
            className={styles.clipFeedPage__swiperSlide}
            onClick={() => handleVideoToggle(post.postId)}
          >
            <div className={styles.clipFeedPage__clipContainer}>
              <VideoFullScreen
                post={post as Amity.Post}
                isActive={true}
                videoRefs={videoRefs}
                onClickVideo={handleVideoToggle}
                onNextVideo={handleNextVideo}
                isDragging={isDragging}
                onDragging={handleDragging}
                isLocalMuted={isLocalMuted}
              />
              <div className={styles.clipFeedPage__header}>
                <BackButton
                  pageId={pageId}
                  onPress={() => onBack()}
                  defaultClassName={styles.clipFeedPage__backButton}
                />
                <ClipHeader pageId={pageId} targetId={post.targetId} targetType={post.targetType} />
                {isShowInteractionMenu ? (
                  <CreateNewClipButton
                    onClick={() =>
                      AmityClipFeedPageBehavior?.goToSelectClipPostTargetPage?.({
                        isClipPost: true,
                      })
                    }
                  />
                ) : (
                  <div />
                )}
              </div>
              <ClipFeedMenu
                postId={post.parentPostId}
                childPost={post as Amity.Post<'video' | 'clip'>}
                isShowInteractionMenu={isShowInteractionMenu}
                isDragging={isDragging}
                handleMuteToggle={handleMuteToggle}
                isLocalMuted={isLocalMuted}
                onClickMenuButton={() => handleMenuClick(post.parentPostId)}
              />
              <ClipCaption
                postId={post.parentPostId}
                creator={post.creator}
                isDragging={isDragging}
                onClickSeeMoreButton={() => handleMenuClick(post.parentPostId)}
                onClickUser={() =>
                  AmityClipFeedPageBehavior?.goToUserProfilePage?.({
                    userId: post.creator?.userId as string,
                  })
                }
                isLoading={isLoading}
              />
            </div>
          </SwiperSlide>
        ) : (
          <SwiperSlide className={styles.clipFeedPage__swiperSlide}>
            <div className={styles.emptyState}>No clips available</div>
          </SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};
