import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import useCommentsQuery from '~/social/hooks/useCommentsQuery';
// eslint-disable-next-line import/no-cycle
import Comment from '~/social/components/Comment';
import LoadMore from '~/social/components/LoadMore';

import { TabIcon, TabIconContainer } from './styles';

const CommentList = ({
  parentId,
  referenceId,
  referenceType,
  filterByParentId = false,
  first,
  last,
  readonly = false,
  isExpanded = true,
}) => {
  const { commentIds, hasMore, loadMore } = useCommentsQuery({
    parentId,
    referenceId,
    referenceType,
    filterByParentId,
    first,
    last,
  });
  const isReplyComment = !!parentId;
  const loadMoreText = isReplyComment ? (
    <FormattedMessage id="collapsible.viewMoreReplies" />
  ) : (
    <FormattedMessage id="collapsible.viewMoreComments" />
  );

  let prependIcon = null;
  if (isReplyComment) {
    prependIcon = (
      <TabIconContainer>
        <TabIcon />
      </TabIconContainer>
    );
  }

  return (
    <LoadMore
      hasMore={hasMore}
      loadMore={loadMore}
      text={loadMoreText}
      className={isReplyComment ? 'reply-button' : 'comments-button'}
      prependIcon={prependIcon}
      appendIcon={null}
      isExpanded={isExpanded}
    >
      {commentIds.map(commentId => (
        <Comment key={commentId} commentId={commentId} readonly={readonly} />
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
  readonly: PropTypes.bool,
  isExpanded: PropTypes.bool,
};

export default memo(CommentList);
