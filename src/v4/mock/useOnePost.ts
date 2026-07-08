import { useGlobalFeedCollection } from '~/v4/social/hooks/collections/useGlobalFeedCollection';

export default function useOnePost(): [Amity.Post | null, boolean] {
  const { posts, isLoading } = useGlobalFeedCollection();
  return [posts[0] ?? null, isLoading];
}
