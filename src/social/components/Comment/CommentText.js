import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import Linkify from '~/core/components/Linkify';
import { CommentContent, ReadMoreButton } from './styles';

const COMMENT_MAX_LINES = 8;

const CommentText = ({ children, className, maxLines = COMMENT_MAX_LINES }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  return (
    <Linkify>
      {isExpanded ? (
        <CommentContent className={className}>{children}</CommentContent>
      ) : (
        children && (
          <Truncate
            lines={maxLines}
            ellipsis={
              <ReadMoreButton onClick={expand}>
                <FormattedMessage id="comment.readmore" />
              </ReadMoreButton>
            }
          >
            <CommentContent className={className}>{children}</CommentContent>
          </Truncate>
        )
      )}
    </Linkify>
  );
};

export default CommentText;
