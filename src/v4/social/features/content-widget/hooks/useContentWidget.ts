import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useContentWidgetPool } from '~/v4/social/hooks/queries';
import {
  MIN_VISIBILITY_THRESHOLD_DEFAULT,
  MAX_POOL_LIMIT,
} from '~/v4/social/features/content-widget/constants';
import { isValidPostType } from '~/v4/social/features/content-widget/utils';
import { prefersReducedMotion } from '~/v4/utils/prefersReducedMotion';
import type {
  ContentWidgetLayout,
  ContentWidgetPhase,
} from '~/v4/social/features/content-widget/types';
import { useContentWidgetAnalytics } from './useContentWidgetAnalytics';
import { useWidgetKeyboardNavigation } from './useWidgetKeyboardNavigation';

type UseContentWidgetParam = {
  topicId: string;
  minVisibilityThreshold?: number;
};

export function useContentWidget({ topicId, minVisibilityThreshold }: UseContentWidgetParam) {
  const { isDesktop } = useResponsive();
  const { AmityContentWidgetComponentBehavior } = usePageBehavior();

  const { pool, isLoading, error } = useContentWidgetPool({
    topicId,
    limit: MAX_POOL_LIMIT,
  });

  const threshold = Math.max(
    MIN_VISIBILITY_THRESHOLD_DEFAULT,
    minVisibilityThreshold ?? MIN_VISIBILITY_THRESHOLD_DEFAULT,
  );

  const posts = useMemo(() => (pool?.posts ?? []).filter(isValidPostType), [pool?.posts]);

  const topic = pool?.topic;

  const layout: ContentWidgetLayout = isDesktop ? 'expanded' : 'compact';

  const phase: ContentWidgetPhase = isLoading
    ? 'loading'
    : error || posts.length < threshold
      ? 'absent'
      : 'rendered';

  const { widgetRef, registerCardObserver, markCardClick } = useContentWidgetAnalytics(
    topic,
    phase === 'rendered',
  );

  const trackRef = useRef<HTMLDivElement>(null);

  const {
    getCardTabIndex,
    setCardRef,
    onKeyDown: onCardsKeyDown,
  } = useWidgetKeyboardNavigation(posts.length, trackRef);

  const [canGoPrevious, setCanGoPrevious] = useState(false);
  const [canGoNext, setCanGoNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    setCanGoPrevious(el.scrollLeft > 1);
    setCanGoNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    updateScrollState();
    const el = trackRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState);
    return () => el.removeEventListener('scroll', updateScrollState);
  }, [updateScrollState, phase, posts.length, layout]);

  const scrollByPage = (direction: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * el.clientWidth,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  };

  const handleCardClick = (post: Amity.Post) => {
    markCardClick(post.postId);
    AmityContentWidgetComponentBehavior?.goToDestination?.({ topicId, post });
  };

  return {
    phase,
    isLoading: phase === 'loading',
    layout,
    posts,
    topicName: topic?.topicName,
    sectionRef: widgetRef,
    trackRef,
    registerCardObserver,
    getCardTabIndex,
    setCardRef,
    onCardsKeyDown,
    canGoPrevious,
    canGoNext,
    scrollByPage,
    handleCardClick,
  };
}
