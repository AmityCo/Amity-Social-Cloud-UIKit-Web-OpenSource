import { PostRepository } from '@amityco/ts-sdk';
import usePostsCollection from '~/social/hooks/collections/usePostsCollection';

const QUERY_LIMIT = 10;

/**
 *
 * @deprecated use usePostsCollection instead
 */
const usePosts = ({
  targetType,
  targetId,
  feedType,
  limit = QUERY_LIMIT,
}: Partial<Parameters<typeof PostRepository.getPosts>[0]>) => {
  const { posts, hasMore, loadMore } = usePostsCollection({
    targetType,
    targetId,
    feedType,
    limit,
  });

  return [posts, hasMore, loadMore];
};

export default usePosts;
