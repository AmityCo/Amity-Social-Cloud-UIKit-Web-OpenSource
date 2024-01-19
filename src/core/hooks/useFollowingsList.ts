import useFollowingsCollection from './collections/useFollowingsCollection';

type FollowStatusInput = Amity.QueryFollowings['status'];

const useFollowingsList = ({
  userId,
  status,
}: {
  userId?: string | null;
  status: FollowStatusInput;
}) => {
  const { followings, hasMore, loadMore } = useFollowingsCollection({
    userId,
    status,
  });

  return [followings, hasMore, loadMore];
};

export default useFollowingsList;
