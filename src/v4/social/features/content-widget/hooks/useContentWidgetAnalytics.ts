import { useCallback, useEffect, useRef } from 'react';
import { CARD_IMPRESSION_VISIBILITY_RATIO } from '~/v4/social/features/content-widget/constants';

export function useContentWidgetAnalytics(
  topic: Amity.CuratedContentTopic | undefined,
  enabled: boolean,
) {
  const topicRef = useRef(topic);
  topicRef.current = topic;

  const impressionFired = useRef(false);
  const postImpressionsFired = useRef<Set<string>>(new Set());

  const markWidgetViewed = useCallback(() => {
    if (!topicRef.current || impressionFired.current) return;
    impressionFired.current = true;
    topicRef.current.analytics.markAsViewed();
  }, []);

  const markCardViewed = useCallback((postId: string) => {
    if (!topicRef.current || postImpressionsFired.current.has(postId)) return;
    postImpressionsFired.current.add(postId);
    topicRef.current.analytics.markPostAsViewed(postId);
  }, []);

  const markCardClick = useCallback((postId: string) => {
    topicRef.current?.analytics.markPostClick(postId);
  }, []);

  const widgetRef = useRef<HTMLElement>(null);

  const cardObserverRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!enabled) return;
    const el = widgetRef.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        markWidgetViewed();
        observer.disconnect();
      }
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, markWidgetViewed]);

  useEffect(() => () => cardObserverRef.current?.disconnect(), []);

  const registerCardObserver = useCallback(
    (cell: HTMLDivElement | null) => {
      if (!cell || typeof IntersectionObserver === 'undefined') return;
      if (!cardObserverRef.current) {
        cardObserverRef.current = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (!entry.isIntersecting) return;
              const { postId } = (entry.target as HTMLElement).dataset;
              if (postId) {
                markCardViewed(postId);
                cardObserverRef.current?.unobserve(entry.target);
              }
            });
          },
          { threshold: CARD_IMPRESSION_VISIBILITY_RATIO },
        );
      }
      cardObserverRef.current.observe(cell);
    },
    [markCardViewed],
  );

  return { widgetRef, registerCardObserver, markCardClick };
}
