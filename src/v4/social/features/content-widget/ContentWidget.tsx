import { Skeleton } from '~/v4/core/components/Skeleton';
import { useAmityComponent } from '~/v4/core/hooks/uikit';
import { COMPONENT_ID } from '~/v4/constants/customization';
import { useContentWidget } from './hooks';
import { SKELETON_CARD_COUNT } from './constants';
import { Heading } from './components/Heading';
import { PostCard } from './components/PostCard';
import styles from './ContentWidget.module.css';

export type ContentWidgetProps = {
  pageId?: string;
  topicId: string;
  showHeader?: boolean;
  minVisibilityThreshold?: number;
};

export function ContentWidget({
  pageId = '*',
  topicId,
  showHeader = true,
  minVisibilityThreshold,
}: ContentWidgetProps) {
  const componentId = COMPONENT_ID.CONTENT_WIDGET_COMPONENT;

  const { themeStyles, accessibilityId, isExcluded } = useAmityComponent({ pageId, componentId });

  const {
    phase,
    isLoading,
    layout,
    posts,
    topicName,
    sectionRef,
    trackRef,
    registerCardObserver,
    getCardTabIndex,
    setCardRef,
    onCardsKeyDown,
    canGoPrevious,
    canGoNext,
    scrollByPage,
    handleCardClick,
  } = useContentWidget({ topicId, minVisibilityThreshold });

  if (isExcluded || phase === 'absent') return null;

  const showNavigation = showHeader && layout === 'expanded';

  return (
    <section
      ref={sectionRef}
      style={themeStyles}
      data-layout={layout}
      data-testid={accessibilityId}
      className={styles.contentWidget}
      aria-label={topicName}
    >
      {showHeader && (
        <Heading
          title={topicName}
          showNavigation={showNavigation}
          canGoPrevious={!isLoading && canGoPrevious}
          canGoNext={!isLoading && canGoNext}
          onPrevious={() => scrollByPage(-1)}
          onNext={() => scrollByPage(1)}
          isLoading={isLoading}
        />
      )}
      <div
        ref={trackRef}
        data-layout={layout}
        aria-roledescription="carousel"
        className={styles.contentWidget__track}
        onKeyDown={onCardsKeyDown}
      >
        {isLoading
          ? Array.from({ length: SKELETON_CARD_COUNT }).map((_, index) => (
              <div key={index} className={styles.contentWidget__cell}>
                <ContentWidget.Skeleton />
              </div>
            ))
          : posts.map((post, index) => (
              <div
                key={post.postId}
                ref={registerCardObserver}
                data-post-id={post.postId}
                className={styles.contentWidget__cell}
              >
                <PostCard
                  ref={setCardRef(index)}
                  pageId={pageId}
                  post={post}
                  layout={layout}
                  tabIndex={getCardTabIndex(index)}
                  onCardClick={handleCardClick}
                />
              </div>
            ))}
      </div>
    </section>
  );
}

function ContentWidgetSkeleton() {
  return (
    <Skeleton className={styles.skeletonCard}>
      <Skeleton className={styles.skeletonCard__header}>
        <Skeleton.Circle width="2rem" height="2rem" />
        <Skeleton className={styles.skeletonCard__headerLines}>
          <Skeleton.Square width="11.25rem" height="0.5rem" radius="0.75rem" />
          <Skeleton.Square width="4rem" height="0.5rem" radius="0.75rem" />
        </Skeleton>
      </Skeleton>
      <Skeleton className={styles.skeletonCard__text}>
        <Skeleton.Square width="15rem" height="0.5rem" radius="0.75rem" />
        <Skeleton.Square width="11.25rem" height="0.5rem" radius="0.75rem" />
        <Skeleton.Square width="18.5625rem" height="0.5rem" radius="0.75rem" />
      </Skeleton>
    </Skeleton>
  );
}

ContentWidget.Skeleton = ContentWidgetSkeleton;
