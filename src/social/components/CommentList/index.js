import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import useCommentsQuery from '~/social/hooks/useCommentsQuery';
// eslint-disable-next-line import/no-cycle
import Comment from '~/social/components/Comment';
import LoadMore from '~/social/components/LoadMore';

const CommentList = ({
  parentId,
  referenceId,
  referenceType,
  filterByParentId = false,
  first,
  last,
  canInteract = true,
  isReplyComment = false,
  loadMoreText,
}) => {
  const { commentIds, hasMore, loadMore } = useCommentsQuery({
    parentId,
    referenceId,
    referenceType,
    filterByParentId,
    first,
    last,
  });
  return (
    <LoadMore
      hasMore={hasMore}
      loadMore={loadMore}
      text={loadMoreText || <FormattedMessage id="collapsible.viewAllReplies" />}
    >
      {commentIds.map(commentId => (
        <Comment
          key={commentId}
          commentId={commentId}
          canInteract={canInteract}
          isReplyComment={isReplyComment}
        />
      ))}
    </LoadMore>
  );
};

CommentList.propTypes = {
  parentId: PropTypes.string,
  referenceId: PropTypes.string.isRequired,
  referenceType: PropTypes.string,
  filterByParentId: PropTypes.bool,
  first: PropTypes.number,
  last: PropTypes.number,
  canInteract: PropTypes.bool,
  isReplyComment: PropTypes.bool,
  loadMoreText: PropTypes.node,
};

export default CommentList;
