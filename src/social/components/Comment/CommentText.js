import React, { useState } from 'react';
import Truncate from 'react-truncate-markup';
import Linkify from '~/core/components/Linkify';
import { CommentContent, ReadMoreButton } from './styles';

const COMMENT_MAX_LINES = 8;

const CommentText = ({ children }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  return (
    <Linkify>
      {isExpanded ? (
        <CommentContent>{children}</CommentContent>
      ) : (
        <Truncate
          lines={COMMENT_MAX_LINES}
          ellipsis={<ReadMoreButton onClick={expand}>...Read more</ReadMoreButton>}
        >
          <CommentContent>{children}</CommentContent>
        </Truncate>
      )}
    </Linkify>
  );
};

export default CommentText;
