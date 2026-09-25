import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { usePageBehavior } from '~/v4/core/providers/PageBehaviorProvider';
import { useDiscoveryWidgetPool } from '~/v4/social/hooks/queries';
import {
  MIN_VISIBILITY_THRESHOLD_DEFAULT,
  MIN_VISIBILITY_THRESHOLD_FLOOR,
  MAX_POOL_LIMIT,
} from '~/v4/social/features/discovery-widget/constants';
import { isValidPostType } from '~/v4/social/features/discovery-widget/utils';
import { prefersReducedMotion } from '~/v4/utils/prefersReducedMotion';
import type {
  DiscoveryWidgetLayout,
  DiscoveryWidgetPhase,
} from '~/v4/social/features/discovery-widget/types';
import { useDiscoveryWidgetAnalytics } from './useDiscoveryWidgetAnalytics';
import { useWidgetKeyboardNavigation } from './useWidgetKeyboardNavigation';

type UseDiscoveryWidgetParam = {
  topicId: string;
  minVisibilityThreshold?: number;
  onCardClick?: (topicId: string, post: Amity.Post) => void;
};

export function useDiscoveryWidget({
  topicId,
  minVisibilityThreshold,
  onCardClick,
}: UseDiscoveryWidgetParam) {
  const { isDesktop } = useResponsive();
  const { AmityDiscoveryWidgetComponentBehavior } = usePageBehavior();

  const { pool, isLoading, error } = useDiscoveryWidgetPool({
    topicId,
    limit: MAX_POOL_LIMIT,
  });

  const threshold = Math.max(
    MIN_VISIBILITY_THRESHOLD_FLOOR,
    minVisibilityThreshold ?? MIN_VISIBILITY_THRESHOLD_DEFAULT,
  );

  const posts = useMemo(() => (pool?.posts ?? []).filter(isValidPostType), [pool?.posts]);

  const topic = pool?.topic;

  const layout: DiscoveryWidgetLayout = isDesktop ? 'expanded' : 'compact';

  const phase: DiscoveryWidgetPhase = isLoading
    ? 'loading'
    : error || posts.length < threshold
      ? 'absent'
      : 'rendered';

  const { widgetRef, registerCardObserver, markCardClick } = useDiscoveryWidgetAnalytics(
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

    if (onCardClick) {
      onCardClick(topicId, post);
      return;
    }

    AmityDiscoveryWidgetComponentBehavior?.goToDestination?.({ topicId, post });
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
