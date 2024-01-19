import useCommentsCollection from './collections/useCommentsCollection';

type useCommentsParams = {
  parentId?: string | null;
  referenceId?: string | null;
  referenceType: Amity.CommentReferenceType;
  limit?: number;
  // breaking changes
  // first?: number;
  // last?: number;
};

/**
 *
 * @deprecated use useCommentsCollection instead
 */
const useCommentsQuery = ({
  parentId,
  referenceId,
  referenceType,
  limit = 10,
}: useCommentsParams) => {
  const { comments, hasMore, loadMore } = useCommentsCollection({
    parentId,
    referenceId,
    referenceType,
    limit,
  });

  return [comments, hasMore, loadMore];
};

export default useCommentsQuery;
