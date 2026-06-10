import { PostRepository } from '@amityco/ts-sdk';
import { useLiveCollectionV4 } from '~/v4/core/hooks/useLiveCollectionV4';

const QUERY_LIMIT = 20;

type UsePostsCollectionParams = Partial<Parameters<typeof PostRepository.getPosts>[0]>;

export default function usePostsCollection({
  targetType,
  targetId,
  limit = QUERY_LIMIT,
  ...props
}: UsePostsCollectionParams) {
  const { items, ...rest } = useLiveCollectionV4({
    fetcher: PostRepository.getPosts,
    params: {
      targetId: targetId ?? '',
      targetType,
      limit,
      ...props,
    },
    shouldCall: !!targetId && !!targetType,
  });

  // Audio children have no renderer in v4, so drop posts containing them. File
  // children now render (PostContent's FileContent), so file posts are kept.
  const filteredPosts = items.filter((post) => {
    const children = post.childrenPosts || [];
    const hasAudioChild = children.some((child) => child.dataType === 'audio');
    return !hasAudioChild;
  });

  return {
    posts: filteredPosts,
    ...rest,
  };
}
