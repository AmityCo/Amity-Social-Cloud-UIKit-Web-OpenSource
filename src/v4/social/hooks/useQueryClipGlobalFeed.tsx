import { useState, useCallback, useEffect, useMemo } from 'react';
import { FeedRepository, PostRepository } from '@amityco/ts-sdk';
import { isNonNullable } from '~/v4/helpers/utils';

interface UseQueryClipGlobalFeedParams {
  limit?: number;
  enabled?: boolean;
  dataTypes?: Array<'video' | 'clip'>;
}

interface UseQueryClipGlobalFeedResult {
  posts: Array<Amity.Post<'video' | 'clip'>>;
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
  refresh: () => void;
  error: Error | null;
}

export const useQueryClipGlobalFeed = ({
  limit = 10,
  enabled = true,
  dataTypes = ['video', 'clip'],
}: UseQueryClipGlobalFeedParams = {}): UseQueryClipGlobalFeedResult => {
  const [posts, setPosts] = useState<Array<Amity.Post<'video' | 'clip'>>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [queryToken, setQueryToken] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [hasBeenInitialized, setHasBeenInitialized] = useState(false);

  const hasMore = useMemo(() => queryToken !== null, [queryToken]);

  const fetchPosts = useCallback(
    async (token: string | null) => {
      if (!enabled) return;

      try {
        setIsLoading(true);
        setError(null);

        const response = await FeedRepository.queryGlobalFeed({
          limit,
          queryToken: token || undefined,
          dataTypes: ['video', 'clip'],
        });

        const filteredPosts = (
          await Promise.all(
            response.data.map(async (post: Amity.Post) => {
              if (post?.children?.length > 0) {
                let unsub = () => {};
                const childPost = await new Promise<Amity.Post>((resolve) => {
                  unsub = PostRepository.getPost(post.children[0], (response) => {
                    return resolve(response.data);
                  });
                });
                unsub();
                if (!childPost) {
                  return post;
                }
                // Filter out unsupported file types
                if (['file'].includes(childPost.dataType)) {
                  return null;
                }
                return childPost; // Return child post instead of parent
              }
              return post;
            }),
          )
        ).filter(isNonNullable);

        setQueryToken(response.paging.next || null);

        if (token) {
          // Load more - append to existing posts
          setPosts((prev) => {
            const currentItemIds = new Set([...prev.map((item) => item.postId)]);
            const newItems = filteredPosts.filter(
              (item: Amity.Post) => !currentItemIds.has(item.postId),
            );
            return [...prev, ...newItems];
          });
        } else {
          // Initial load or refresh - replace all posts
          setPosts(filteredPosts);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch posts'));
      } finally {
        setIsLoading(false);
      }
    },
    [limit, enabled, dataTypes],
  );

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore && enabled) {
      fetchPosts(queryToken);
    }
  }, [isLoading, hasMore, queryToken, fetchPosts, enabled]);

  const refresh = useCallback(() => {
    if (!enabled) return;
    setQueryToken(null);
    fetchPosts(null);
  }, [fetchPosts, enabled]);

  // Initial load
  useEffect(() => {
    if (enabled && !hasBeenInitialized) {
      setHasBeenInitialized(true);
      fetchPosts(null);
    }
  }, [enabled, hasBeenInitialized, fetchPosts]);

  return {
    posts,
    isLoading,
    hasMore,
    loadMore,
    refresh,
    error,
  };
};

export default useQueryClipGlobalFeed;
