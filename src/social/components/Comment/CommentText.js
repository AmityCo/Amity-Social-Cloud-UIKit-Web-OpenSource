import React, { useState, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import Markdown from 'markdown-to-jsx';
import MentionHighlightTag from '~/core/components/MentionHighlightTag';
import { formatMentionChunks } from '~/core/components/ChunkHighlighter';
import { CommentContent, ReadMoreButton } from './styles';

import {
  defaultBlockComponentMap,
  defaultMarkComponentMap,
} from '~/core/components/RichTextEditor';

const COMMENT_MAX_LINES = 8;

const CommentText = ({ text, className, mentionees, maxLines = COMMENT_MAX_LINES }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const expand = () => setIsExpanded(true);

  const textWithMentions = useMemo(
    () => formatMentionChunks(text, mentionees, 'mention'),
    [text, mentionees],
  );

  const renderOverrides = useMemo(
    () => ({
      ...defaultBlockComponentMap,
      ...defaultMarkComponentMap,
      mention: {
        component: MentionHighlightTag,
        props: {
          mentionees,
        },
      },
    }),
    [mentionees],
  );

  const textContent = text && (
    <CommentContent className={className} data-qa-anchor="comment-content">
      <Markdown
        options={{
          overrides: renderOverrides,
        }}
      >
        {textWithMentions}
      </Markdown>
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
