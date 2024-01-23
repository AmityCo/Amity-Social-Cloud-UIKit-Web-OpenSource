import { StoryRepository } from '@amityco/ts-sdk';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isNonNullable } from '~/helpers/utils';

type UseStories = {
  stories: (Amity.Story | undefined)[];
  isLoading: boolean;
  error: Error | null;
  hasMore: boolean;
  loadMore: () => void;
};

const useStories = (params: Amity.GetStoriesByTargetParam): UseStories => {
  const [stories, setStories] = useState<Amity.Story[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const loadMoreFnRef = useRef<(() => void) | undefined | null>(null);
  const [loadMoreHasBeenCalled, setLoadMoreHasBeenCalled] = useState(false);

  const loadMore = useCallback(() => {
    if (loadMoreFnRef.current) {
      setLoadMoreHasBeenCalled(true);
      loadMoreFnRef.current?.();
    }
  }, [loadMoreFnRef, loadMoreHasBeenCalled, isLoading, setIsLoading]);

  useEffect(() => {
    function run() {
      StoryRepository.getActiveStoriesByTarget(
        {
          targetId: params.targetId,
          targetType: params.targetType,
          options: params.options,
        },
        ({ data, loading, error, hasNextPage, onNextPage }) => {
          if (error) {
            setError(error);
            return;
          }
          if (data) {
            setStories(data.filter(isNonNullable));
          }
          setIsLoading(loading);
          hasNextPage && setHasMore(hasNextPage);
          loadMoreFnRef.current = onNextPage;
        },
      );
    }
    run();
  }, [params.targetId, params.targetType]);

  return {
    stories,
    isLoading,
    error,
    hasMore,
    loadMore,
  };
};

export default useStories;
