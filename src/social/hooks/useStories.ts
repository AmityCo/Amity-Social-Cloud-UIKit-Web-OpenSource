import { StoryRepository } from '@amityco/ts-sdk';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { isNonNullable } from '~/helpers/utils';
import useCommunityStoriesSubscription from './useCommunityStoriesSubscription';

type UseStories = {
  stories: (Amity.Story | undefined)[];
  hasMore: boolean;
  loadMore: () => void;
};

const useStories = (params: Amity.GetStoriesByTargetParam): UseStories => {
  const disposeFnRef = useRef<(() => void) | null>(null);
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
    async function run() {
      if (disposeFnRef.current) {
        disposeFnRef.current();
      }

      disposeFnRef.current = StoryRepository.getActiveStoriesByTarget(
        {
          targetId: params.targetId,
          targetType: params.targetType,
          options: params.options,
        },
        async ({ data, hasNextPage, onNextPage }) => {
          if (data) {
            if (params.options?.orderBy === 'asc' && params.options?.sortBy === 'createdAt') {
              const sortedData = data.filter(isNonNullable).sort((a, b) => {
                // Place stories with syncing state at the end
                if (a.syncState === 'syncing' && b.syncState !== 'syncing') {
                  return 1;
                } else if (a.syncState !== 'syncing' && b.syncState === 'syncing') {
                  return -1;
                } else {
                  // For other cases, maintain the original order
                  return 0;
                }
              });
              setStories(sortedData);
            } else {
              setStories(data.filter(isNonNullable));
            }
          }

          hasNextPage && setHasMore(hasNextPage);
          loadMoreFnRef.current = onNextPage;
        },
      );
    }

    run();

    return () => {
      if (disposeFnRef.current) {
        disposeFnRef.current();
      }
    };
  }, [params.targetId]);

  useCommunityStoriesSubscription({
    targetId: params.targetId,
    targetType: params.targetType as Amity.StoryTargetType, // TO FIX: type issue
  });

  return {
    stories,
    hasMore,
    loadMore,
  };
};

export default useStories;
