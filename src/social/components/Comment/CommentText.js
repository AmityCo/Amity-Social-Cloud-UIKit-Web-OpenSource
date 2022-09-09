import React, { useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import { findChunks } from '~/helpers/utils';
import MentionHighlightTag from '~/core/components/MentionHighlightTag';
import ChunkHighlighter from '~/core/components/ChunkHighlighter';
import Linkify from '~/core/components/Linkify';
import { CommentContent, ReadMoreButton } from './styles';

const COMMENT_MAX_LINES = 8;

const CommentText = ({ text, className, mentionees, maxLines = COMMENT_MAX_LINES }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const chunks = useMemo(() => findChunks(mentionees), [mentionees]);

  const expand = () => setIsExpanded(true);

  const textContent = text && (
    <CommentContent className={className}>
      <Truncate.Atom>
        <ChunkHighlighter
          textToHighlight={text}
          chunks={chunks}
          highlightNode={(props) => <MentionHighlightTag {...props} mentionees={mentionees} />}
          unhighlightNode={Linkify}
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
