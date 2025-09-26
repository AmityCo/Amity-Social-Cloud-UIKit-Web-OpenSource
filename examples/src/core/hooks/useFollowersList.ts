import useFollowersCollection from './collections/useFollowersCollection';

type FollowStatusInput = Amity.QueryFollowers['status'];

const useFollowersList = ({
  userId,
  status,
}: {
  userId?: string | null;
  status: FollowStatusInput;
}) => {
  const { followers, hasMore, loadMore } = useFollowersCollection({ userId, status });

  return [followers, hasMore, loadMore];
};

export default useFollowersList;
