import { PostRepository } from '@amityco/ts-sdk';
import { useCallback, useEffect, useRef, useState, useMemo } from 'react';

type useSearchPostWithHashtagCollectionParams = Parameters<
  typeof PostRepository.searchPostsByHashtag
>[0];

export default function useSearchPostWithHashtagCollection({
  hashtags,
  dataTypes,
  ...props
}: useSearchPostWithHashtagCollectionParams) {
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

  // Memoize the stringified arrays to prevent unnecessary re-renders
  const hashtagsKey = useMemo(() => JSON.stringify(hashtags || []), [hashtags]);
  const dataTypesKey = useMemo(() => JSON.stringify(dataTypes || []), [dataTypes]);

  useEffect(() => {
    if (!hashtags || hashtags.length === 0) return;

    const unsubscriber = PostRepository.searchPostsByHashtag(
      {
        ...props,
        hashtags,
        dataTypes,
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
  }, [hashtagsKey, dataTypesKey]);

  return {
    posts: items,
    loading: isLoading,
    hasMore,
    loadMore,
    error,
  };
}
