import React, { useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import Truncate from 'react-truncate-markup';
import clsx from 'clsx';
import { findChunks, Mentioned } from '~/v4/helpers/utils';
import MentionHighlightTag from '~/core/components/MentionHighlightTag';
import { processChunks } from '~/core/components/ChunkHighlighter';
import Linkify from '~/core/components/Linkify';
import styles from './CommentText.module.css';

const COMMENT_MAX_LINES = 8;

interface CommentTextProps {
  text?: string;
  className?: string;
  mentionees?: Mentioned[];
  maxLines?: number;
}

const CommentText = ({
  text,
  className,
  mentionees,
  maxLines = COMMENT_MAX_LINES,
}: CommentTextProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const chunks = useMemo(
    () => processChunks(text || '', findChunks(mentionees)),
    [mentionees, text],
  );

  const expand = () => setIsExpanded(true);

  const textContent = text ? (
    <div data-qa-anchor="comment-content" className={clsx(styles.commentContent, className)}>
      <Truncate.Atom>
        {chunks.map((chunk) => {
          const key = `${text}-${chunk.start}-${chunk.end}`;
          const sub = text.substring(chunk.start, chunk.end);
          if (chunk.highlight) {
            const mentionee = mentionees?.find((m) => m.index === chunk.start);
            if (mentionee) {
              return (
                <MentionHighlightTag key={key} mentionee={mentionee}>
                  {sub}
                </MentionHighlightTag>
              );
            }
            return <span key={key}>{sub}</span>;
          }
          return <Linkify key={key}>{sub}</Linkify>;
        })}
      </Truncate.Atom>
    </div>
  ) : null;

  if (isExpanded) {
    return textContent;
  }

  return textContent ? (
    <Truncate
      lines={maxLines}
      ellipsis={
        <button className={clsx(styles.readMoreButton)} onClick={expand}>
          <FormattedMessage id="comment.readmore" />
        </button>
      }
    >
      {textContent}
    </Truncate>
  ) : null;
};

export default CommentText;
