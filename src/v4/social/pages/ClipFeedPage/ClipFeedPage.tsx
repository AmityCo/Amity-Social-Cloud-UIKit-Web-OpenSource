import React, { useState, useRef, useEffect } from 'react';
import type SwiperCore from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar, Mousewheel, FreeMode } from 'swiper/modules';
import { VideoFullScreen } from './VideoFullScreen/VideoFullScreen';
import { DeletedClipView } from './DeletedClipView';
import { getFileUrl } from '~/v4/utils/getFileUrl';
import { BackButton } from '~/v4/social/elements';
import { useAmityPage } from '~/v4/core/hooks/uikit';
import { PageTypes, useNavigation } from '~/v4/core/providers/NavigationProvider';
import { ClipHeader } from './CommunityHeader/CommunityHeader';
import { CreateNewClipButton } from '~/v4/social/elements/CreateNewClipButton';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { ClipFeedMenu } from './ClipFeedMenu/ClipFeedMenu';
import { ClipCaption } from './ClipCaption/ClipCaption';
import { useDrawer, useDrawerData } from '~/v4/core/providers/DrawerProvider';
import { Button } from '~/v4/core/components/AriaButton';
import { ViewPost } from '~/v4/icons/ViewPost';
import { Typography } from '~/v4/core/components';
import usePost from '~/v4/core/hooks/objects/usePost';
import { EmptyFeed } from './EmptyFeed/EmptyFeed';
import { useLayoutContext } from '~/v4/social/providers/LayoutProvider';
import { HomePageTab } from '~/v4/social/constants/HomePageTab';
import styles from './ClipFeedPage.module.css';
import usePostsCollection from '~/v4/social/hooks/collections/usePostsCollection';
import { useQueryClipGlobalFeed } from '~/v4/social/hooks/useQueryClipGlobalFeed';
import useIntersectionObserver from '~/v4/core/hooks/useIntersectionObserver';

type ClipFeedPageProps = {
  currentPostId?: string;
  postIndex?: number;
  targetType?: 'community' | 'user';
  targetId?: string;
};

export const ClipFeedPage = ({
  currentPostId,
  postIndex,
  targetType,
  targetId,
}: ClipFeedPageProps) => {
  const pageId = 'clip_feed_page';

  const { accessibilityId, themeStyles } = useAmityPage({
    pageId,
  });
  const {
    onBack,
    prevPage,
    currentClip: activeIndex,
    setCurrentClip: setActiveIndex,
  } = useNavigation();
  const { AmityClipFeedPageBehavior } = usePageBehavior();
  const { setDrawerData, removeDrawerData } = useDrawer();
  const { setActiveTab } = useLayoutContext();
  const drawerData = useDrawerData();

  const [initialSlideSet, setInitialSlideSet] = useState(false);
  const videoRefs = useRef<Record<string, HTMLVideoElement>>({});
  const swiperRef = useRef<SwiperCore | null>(null);
  const [isLocalMuted, setIsLocalMuted] = useState(false);
  const [isShowInteractionMenu, setIsShowInteractionMenu] = useState(true);
  const [isClipFailed, setIsClipFailed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [intersectionNode, setIntersectionNode] = useState<HTMLDivElement | null>(null);

  // Use global clip feed when no props are passed, otherwise use collection
  const shouldUseGlobalFeed = !targetType && !targetId && !currentPostId;

  const {
    posts: globalPosts,
    refresh: refreshGlobal,
    isLoading: isGlobalFeedLoading,
    hasMore: hasMoreGlobalPosts,
    loadMore: loadMoreGlobalPosts,
  } = useQueryClipGlobalFeed({
    limit: 20,
    enabled: shouldUseGlobalFeed,
  });

  const {
    posts: collectionPosts,
    refresh: refreshCollection,
    isLoading: isLoadingCollectionPosts,
    hasMore: hasMoreCollectionPosts,
    loadMore: loadMoreCollectionPosts,
  } = usePostsCollection({
    targetType,
    targetId,
    dataTypes: ['clip'],
    limit: 20,
  });

  const posts = shouldUseGlobalFeed ? globalPosts : collectionPosts;
  const refresh = shouldUseGlobalFeed ? refreshGlobal : refreshCollection;

  useIntersectionObserver({
    onIntersect: () => {
      // Only load more if there are more posts available
      if (!shouldUseGlobalFeed && hasMoreCollectionPosts && isLoadingCollectionPosts === false) {
        loadMoreCollectionPosts();
      }

      if (shouldUseGlobalFeed && hasMoreGlobalPosts && isGlobalFeedLoading === false) {
        loadMoreGlobalPosts();
      }
    },
    node: intersectionNode,
  });

  useEffect(() => {
    refresh();
  }, []);

  // for post content render with no posts
  const { post, isLoading, refresh: refreshPost } = usePost(currentPostId, posts?.length === 0);

  useEffect(() => {
    if (currentPostId) refreshPost();
  }, [currentPostId]);

  // Check if currentPostId exists in the posts array
  const isCurrentPostInPosts =
    currentPostId && posts?.some((post) => post.postId === currentPostId);

  // Determine if we should show deleted clip view
  const shouldShowDeletedClip = currentPostId && posts && posts.length > 0 && !isCurrentPostInPosts;

  // Determine if we should enable infinite loop
  const hasMorePosts = shouldUseGlobalFeed ? hasMoreGlobalPosts : hasMoreCollectionPosts;
  const shouldEnableLoop = posts && posts.length >= 10 && !hasMorePosts && !shouldShowDeletedClip;

  // Hide interaction menu for pending post
  useEffect(() => {
    if (prevPage?.type === PageTypes.PendingRequestPage) {
      setIsShowInteractionMenu(false);
    }
  }, []);

  // Pause/resume video based on drawer state
  useEffect(() => {
    let currentPost = null;

    if (posts && posts.length > 0) {
      // Calculate actual post index (accounting for deleted clip view offset)
      const actualPostIndex = shouldShowDeletedClip ? activeIndex - 1 : activeIndex;
      if (actualPostIndex >= 0 && actualPostIndex < posts.length) {
        currentPost = posts[actualPostIndex];
      }
    } else if (currentPostId && post) {
      currentPost = post;
    }

    if (!currentPost) return;

    const video = videoRefs.current[currentPost.postId];
    if (!video) return;

    if (drawerData) {
      // Drawer is open, pause video
      if (!video.paused) {
        video.pause();
      }
    } else {
      // Drawer is closed, resume video if it was playing
      if (video.paused) {
        video.play().catch((error) => {
          console.warn('Failed to play video:', error);
        });
      }
    }
  }, [drawerData, activeIndex, posts, currentPostId, post, shouldShowDeletedClip]);

  // Set initial active index based on postIndex or currentPostId
  useEffect(() => {
    if (posts && posts.length > 0 && !initialSlideSet) {
      let targetIndex = activeIndex ?? 0;

      // Priority 1: Use postIndex if provided
      if (postIndex !== undefined && postIndex >= 0 && postIndex < posts.length) {
        targetIndex = postIndex;
      }
      // Priority 2: Use currentPostId if postIndex is not provided
      else if (currentPostId) {
        const index = posts.findIndex((post) => post.postId === currentPostId);
        if (index !== -1) {
          targetIndex = index;
        } else if (shouldShowDeletedClip) {
          // Post not found, show deleted clip view at index 0
          setActiveIndex(0);
          setInitialSlideSet(true);
          if (swiperRef.current) {
            swiperRef.current.slideTo(0);
          }
          return;
        }
      }

      // Calculate actual index accounting for deleted clip view
      const actualIndex = targetIndex;
      setActiveIndex(actualIndex);
      setInitialSlideSet(true);

      // If Swiper is already initialized, slide to the new index
      if (swiperRef.current) {
        swiperRef.current.slideTo(actualIndex);
      }
    }
  }, [postIndex, currentPostId, posts, shouldShowDeletedClip, initialSlideSet]);

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
      // Calculate actual post index (accounting for deleted clip view offset)
      const actualPostIndex = shouldShowDeletedClip ? activeIndex - 1 : activeIndex;

      // Only preload if we're not on the deleted clip view
      if (actualPostIndex >= 0) {
        // Load more posts early if we're getting close to the end
        if (actualPostIndex >= posts.length - 5 && hasMorePosts) {
          // We're within 5 videos of the end and there are more posts to load
          if (shouldUseGlobalFeed && hasMoreGlobalPosts && !isGlobalFeedLoading) {
            loadMoreGlobalPosts();
          } else if (!shouldUseGlobalFeed && hasMoreCollectionPosts && !isLoadingCollectionPosts) {
            loadMoreCollectionPosts();
          }
        }

        // Preload next video (swipe down)
        if (actualPostIndex + 1 < posts.length) {
          const cleanup = preloadVideo(actualPostIndex + 1);
          if (cleanup) cleanups.push(cleanup);
        }

        // Preload previous video (swipe up)
        if (actualPostIndex - 1 >= 0) {
          const cleanup = preloadVideo(actualPostIndex - 1);
          if (cleanup) cleanups.push(cleanup);
        }
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, [
    activeIndex,
    posts,
    shouldShowDeletedClip,
    postIndex,
    hasMorePosts,
    shouldUseGlobalFeed,
    hasMoreGlobalPosts,
    isGlobalFeedLoading,
    hasMoreCollectionPosts,
    isLoadingCollectionPosts,
    loadMoreGlobalPosts,
    loadMoreCollectionPosts,
  ]);

  const handleSlideChange = (swiper: SwiperCore) => {
    const newIndex = swiper.activeIndex;
    setActiveIndex(newIndex);

    // Handle looping when reaching the end
    if (shouldEnableLoop && posts) {
      const totalSlides = posts.length;

      // If we're at the last slide, prepare to loop back
      if (newIndex === totalSlides - 1) {
        // Use a timeout to allow the current slide to settle, then loop back
        setTimeout(() => {
          if (swiperRef.current) {
            swiperRef.current.slideTo(0, 300); // Smooth transition back to first slide
          }
        }, 1000); // Wait 1 second before looping
      }
    }
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
    if (swiperRef.current && posts) {
      const totalSlides = shouldShowDeletedClip ? posts.length + 1 : posts.length;

      if (activeIndex < totalSlides - 1) {
        swiperRef.current.slideNext();
      } else if (shouldEnableLoop) {
        // Loop back to the first clip
        const firstClipIndex = shouldShowDeletedClip ? 1 : 0;
        swiperRef.current.slideTo(firstClipIndex, 300);
      }
    }
  };

  const handleWatchNextFromDeleted = () => {
    if (swiperRef.current && posts && posts.length > 0) {
      // Move to the first actual clip (index 1 if deleted clip is at index 0)
      swiperRef.current.slideTo(1);

      // Auto-play the video after sliding to the next clip
      const firstPost = posts[0];
      if (firstPost) {
        setTimeout(() => {
          const video = videoRefs.current[firstPost.postId];
          if (video) {
            video.play().catch((error) => {
              console.warn('Failed to auto-play video:', error);
            });
          }
        }, 300); // Small delay to ensure slide transition is complete
      }
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
              posts: posts as Amity.Post<'video' | 'clip'>[],
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

  const handleClipFailed = () => setIsClipFailed(true);

  const handleDragging = (val: boolean) => setIsDragging(val);

  const handleOnBack = () => {
    if (prevPage?.type === PageTypes.SocialHomePage) {
      setActiveTab(HomePageTab.Newsfeed);
      setActiveIndex(0);
    }
    onBack();
  };

  const isLoadingVideo =
    posts.length == 0 && currentPostId
      ? isLoading
      : shouldUseGlobalFeed
        ? isGlobalFeedLoading
        : isLoadingCollectionPosts;

  return (
    <div
      style={themeStyles}
      data-testid={accessibilityId}
      className={styles.clipFeedPage__container}
    >
      {post === undefined ||
      post?.isDeleted ||
      (posts.length === 0 && !isLoading && !isLoadingCollectionPosts) ? (
        <EmptyFeed
          pageId={pageId}
          onClickBack={() => onBack()}
          onPressCreateNewClip={() =>
            AmityClipFeedPageBehavior?.goToSelectClipPostTargetPage?.({
              isClipPost: true,
            })
          }
        />
      ) : (
        <Swiper
          direction={'vertical'}
          pagination={{ clickable: true }}
          scrollbar={{ draggable: true }}
          mousewheel={true}
          freeMode={false}
          allowTouchMove={true}
          modules={[Scrollbar, Mousewheel, FreeMode]}
          className={styles.clipFeedPage__swiperContainer}
          slidesPerView={1}
          initialSlide={initialSlideSet ? activeIndex : 0}
          onSwiper={(swiper: SwiperCore) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
        >
          {posts && posts.length > 0 ? (
            <>
              {/* Show deleted clip view if currentPostId is not found in posts */}
              {shouldShowDeletedClip && (
                <SwiperSlide key="deleted-clip" className={styles.clipFeedPage__swiperSlide}>
                  <div className={styles.clipFeedPage__clipContainer}>
                    <DeletedClipView onWatchNext={handleWatchNextFromDeleted} />
                    <div className={styles.clipFeedPage__header}>
                      <BackButton
                        pageId={pageId}
                        onPress={() => handleOnBack()}
                        defaultClassName={styles.clipFeedPage__backButton}
                      />
                      <div />
                      <div />
                    </div>
                  </div>
                </SwiperSlide>
              )}

              {/* Render actual posts */}
              {posts.map((post, index) => {
                const actualIndex = shouldShowDeletedClip ? index + 1 : index;
                // Show intersection observer on 3rd to last post when there are more posts to load
                const isThirdLastPost = index === posts.length - 3;
                const shouldShowIntersectionNode = isThirdLastPost && hasMorePosts;
                return (
                  <SwiperSlide
                    key={post.postId}
                    className={styles.clipFeedPage__swiperSlide}
                    onClick={() => handleVideoToggle(post.postId)}
                  >
                    <div className={styles.clipFeedPage__clipContainer}>
                      <VideoFullScreen
                        post={post as Amity.Post}
                        isActive={actualIndex === activeIndex}
                        videoRefs={videoRefs}
                        onClickVideo={handleVideoToggle}
                        onNextVideo={handleNextVideo}
                        isDragging={isDragging}
                        onDragging={handleDragging}
                        isLocalMuted={isLocalMuted}
                        onClipFailed={handleClipFailed}
                        isLoading={isLoadingVideo}
                      />
                      <div className={styles.clipFeedPage__header}>
                        <BackButton
                          pageId={pageId}
                          onPress={() => handleOnBack()}
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
                      {!isClipFailed && (
                        <ClipFeedMenu
                          postId={post.parentPostId}
                          childPost={post as Amity.Post<'video' | 'clip'>}
                          isShowInteractionMenu={isShowInteractionMenu}
                          isDragging={isDragging}
                          handleMuteToggle={handleMuteToggle}
                          isLocalMuted={isLocalMuted}
                          onClickMenuButton={() => handleMenuClick(post.parentPostId)}
                        />
                      )}
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
                        isLoading={isLoadingVideo}
                      />
                      {/* Intersection observer trigger for loading more clips - only when more posts are available */}
                      {shouldShowIntersectionNode && (
                        <div ref={(node) => setIntersectionNode(node)} />
                      )}
                    </div>
                  </SwiperSlide>
                );
              })}
            </>
          ) : (
            currentPostId &&
            post && (
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
                    onClipFailed={handleClipFailed}
                    isLoading={isLoadingVideo}
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
                  {!isClipFailed && (
                    <ClipFeedMenu
                      postId={post.parentPostId}
                      childPost={post as Amity.Post<'video' | 'clip'>}
                      isShowInteractionMenu={isShowInteractionMenu}
                      isDragging={isDragging}
                      handleMuteToggle={handleMuteToggle}
                      isLocalMuted={isLocalMuted}
                      onClickMenuButton={() => handleMenuClick(post.parentPostId)}
                    />
                  )}
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
            )
          )}
        </Swiper>
      )}
    </div>
  );
};
