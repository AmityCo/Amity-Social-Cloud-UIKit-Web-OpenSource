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

  // Filter out posts with children type 'file' or 'audio'
  const filteredPosts = items.filter((post) => {
    const children = post.childrenPosts || [];
    const hasFileOrAudioChild = children.some(
      (child) => child.dataType === 'file' || child.dataType === 'audio',
    );
    return !hasFileOrAudioChild;
  });

  return {
    posts: filteredPosts,
    ...rest,
  };
}
