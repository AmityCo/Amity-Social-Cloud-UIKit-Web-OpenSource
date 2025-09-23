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

const CommentText = ({ text, className, mentionees, maxLines = COMMENT_MAX_LINES, isOldStyle }) => {
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
      a: {
        component: ({ href, children, ...props }) => {
          // Handle mention links with format: mention:index
          if (href && href.startsWith('mention:')) {
            const indexStr = href.replace('mention:', '');
            const highlightIndex = parseInt(indexStr, 10);
            
            // Validate that we have a valid number
            if (isNaN(highlightIndex) || highlightIndex < 0) {
              console.warn(`Invalid mention index: ${indexStr}. Falling back to regular link.`);
              return <a href={href} {...props}>{children}</a>;
            }
            
            return (
              <MentionHighlightTag 
                highlightIndex={highlightIndex} 
                mentionees={mentionees}
                {...props}
              >
                {children}
              </MentionHighlightTag>
            );
          }
          // Regular links
          return <a href={href} {...props}>{children}</a>;
        },
      },
    }),
    [mentionees],
  );

  const textContent = text && (
    <CommentContent className={className} data-qa-anchor="comment-content" isOldStyle={isOldStyle}>
      <Markdown
        options={{
          overrides: renderOverrides,
          disableParsingRawHTML: true,
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
