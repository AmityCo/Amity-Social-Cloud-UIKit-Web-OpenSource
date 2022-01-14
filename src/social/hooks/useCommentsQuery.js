import { useMemo } from 'react';
import { CommentRepository } from '@amityco/js-sdk';

import useLiveCollection from '~/core/hooks/useLiveCollection';

const useCommentsQuery = ({ parentId, referenceId, referenceType, first, last }) => {
  const [comments, hasMore, loadMore] = useLiveCollection(
    () =>
      CommentRepository.queryComments({
        parentId,
        filterByParentId: true,
        referenceId,
        referenceType,
        first,
        last,
      }),
    [referenceId],
  );

  const commentIds = useMemo(() => comments.map((comment) => comment.commentId), [comments]);

  return {
    comments,
    hasMore,
    loadMore,
    commentIds,
  };
};

export default useCommentsQuery;
