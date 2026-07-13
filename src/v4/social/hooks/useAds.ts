import { useMemo } from 'react';
import { usePaginatorApi } from '~/v4/core/hooks/usePaginator';

type UseAdsOptions = {
  posts: Amity.Post[];
  pageSize?: number;
};

export const useAds = ({ posts, pageSize = 10 }: UseAdsOptions) => {
  // Live collections can transiently contain undefined entries (a referenced
  // post id not yet resolved in cache). Drop them before paginating, otherwise
  // getItemId below reads `.postId` off undefined and throws.
  const validPosts = useMemo(() => posts.filter((post) => !!post?.postId), [posts]);

  const { itemWithAds } = usePaginatorApi({
    items: validPosts,
    pageSize,
    placement: 'feed' as Amity.AdPlacement,
    getItemId: (item) => item.postId,
  });

  return { itemWithAds };
};
