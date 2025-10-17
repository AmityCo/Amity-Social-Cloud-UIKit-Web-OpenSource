import { JoinRequestStatusEnum, PostRepository } from '@amityco/ts-sdk';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

type useSemanticSearchPostCollectionParams = Parameters<
  typeof PostRepository.semanticSearchPosts
>[0];

export default function useSemanticSearchPostCollection({
  query,
  targetId,
  targetType,
  dataTypes,
  ...props
}: useSemanticSearchPostCollectionParams) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();
  const [items, setItems] = useState<Amity.Post[] | null>(null);
  const [hasMore, setHasMore] = useState<boolean>();

  const loadMoreRef = useRef<(() => void) | null>();

  const loadMore = useCallback(() => {
    if (loadMoreRef.current) {
      loadMoreRef.current();
    }
  }, []);

  useEffect(() => {
    if (!query) return;

    const unsubscriber = PostRepository.semanticSearchPosts(
      {
        ...props,
        query,
        dataTypes,
        targetId,
        targetType,
        limit: 20,
      },
      ({ data, loading, error, hasNextPage, onNextPage }) => {
        setIsLoading(loading);

        if (!loading && data) {
          setItems([...data]);
          setHasMore(hasNextPage);
          loadMoreRef.current = hasNextPage ? onNextPage : null;
        }

        if (error) setError(error);
      },
    );

    return () => {
      unsubscriber();
    };
  }, [query, targetId, targetType]);

  return {
    posts: items,
    loading: isLoading,
    hasMore,
    loadMore,
    error,
  };
}
