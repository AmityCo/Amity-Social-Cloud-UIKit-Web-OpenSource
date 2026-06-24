import useCommunitiesCollection from '~/v4/core/hooks/collections/useCommunitiesCollection';

export default function useOneCommunity(): [Amity.Community | null, boolean] {
  const { communities, isLoading } = useCommunitiesCollection({ limit: 1 });
  return [communities[0] ?? null, isLoading];
}
