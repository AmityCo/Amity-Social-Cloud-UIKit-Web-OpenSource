import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import Highlighter from 'react-highlight-words';
import { findChunks } from '~/helpers/utils';
import MentionHighlightTag from '~/core/components/MentionHighlightTag';
import { CommentContent, ReadMoreButton } from './styles';

const COMMENT_MAX_LINES = 8;

const CommentText = ({ text, className, mentionees, maxLines = COMMENT_MAX_LINES }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  const textContent = text && (
    <CommentContent className={className}>
      <Truncate.Atom>
        <Highlighter
          autoEscape
          highlightTag={(props) => (
            <MentionHighlightTag {...props} text={text} mentionees={mentionees} />
          )}
          findChunks={() => findChunks(mentionees, text)}
          textToHighlight={text}
        />
      </Truncate.Atom>
    </CommentContent>
  );

  if (isExpanded) return textContent;

  return (
    <Truncate.Atom
      lines={maxLines}
      ellipsis={
        <ReadMoreButton onClick={expand}>
          <FormattedMessage id="comment.readmore" />
        </ReadMoreButton>
      }
    >
      {textContent}
    </Truncate.Atom>
  );
};

export default CommentText;
