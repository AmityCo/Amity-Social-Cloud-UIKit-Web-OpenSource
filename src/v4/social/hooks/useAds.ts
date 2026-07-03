import { usePaginatorApi } from '~/v4/core/hooks/usePaginator';

type UseAdsOptions = {
  posts: Amity.Post[];
  pageSize?: number;
};

export const useAds = ({ posts, pageSize = 10 }: UseAdsOptions) => {
  const { itemWithAds } = usePaginatorApi({
    items: posts,
    pageSize,
    placement: 'feed' as Amity.AdPlacement,
    getItemId: (item) => item.postId,
  });

  return { itemWithAds };
};
