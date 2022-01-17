import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import Highlighter from 'react-highlight-words';
import { findChunks } from '~/helpers/utils';
import Linkify from '~/core/components/Linkify';
import { CommentContent, ReadMoreButton, Highlighted } from './styles';

const COMMENT_MAX_LINES = 8;

const CommentText = ({ text, className, mentionees, maxLines = COMMENT_MAX_LINES }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  const textContent = text && (
    <CommentContent className={className}>
      <Truncate.Atom>
        <Highlighter
          autoEscape
          highlightTag={({ children: toHighLight }) => <Highlighted>{toHighLight}</Highlighted>}
          findChunks={() => findChunks(mentionees)}
          textToHighlight={text}
        />
      </Truncate.Atom>
    </CommentContent>
  );

  return (
    <Linkify>
      {isExpanded
        ? { textContent }
        : text && (
            <Truncate
              lines={maxLines}
              ellipsis={
                <ReadMoreButton onClick={expand}>
                  <FormattedMessage id="comment.readmore" />
                </ReadMoreButton>
              }
            >
              {textContent}
            </Truncate>
          )}
    </Linkify>
  );
};

export default CommentText;
