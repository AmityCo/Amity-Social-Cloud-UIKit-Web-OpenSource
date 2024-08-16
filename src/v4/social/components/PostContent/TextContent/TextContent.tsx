import React, { useState, useMemo, ReactNode, useEffect } from 'react';

import { Linkify } from '~/v4/social/internal-components/Linkify';
import { Mentioned, findChunks, processChunks } from '~/v4/helpers/utils';
import { Typography } from '~/v4/core/components';
import { LinkPreview } from '~/v4/social/components/PostContent/LinkPreview/LinkPreview';
import styles from './TextContent.module.css';
import * as linkify from 'linkifyjs';

interface MentionHighlightTagProps {
  children: ReactNode;
  mentionee: Mentioned;
}

const MentionHighlightTag = ({ children }: MentionHighlightTagProps) => {
  return <span className={styles.mentionHighlightTag}>{children}</span>;
};

const MAX_TEXT_LENGTH = 500;

interface TextContentProps {
  text?: string;
  mentionees?: Mentioned[];
}

export const TextContent = ({ text = '', mentionees }: TextContentProps) => {
  const needReadMore = text.length > MAX_TEXT_LENGTH;

  const [isReadMoreClick, setIsReadMoreClick] = useState(false);

  const isShowReadMore = needReadMore && !isReadMoreClick;

  const chunks = useMemo(() => {
    if (isShowReadMore) {
      return processChunks(text.substring(0, MAX_TEXT_LENGTH), findChunks(mentionees));
    }
    return processChunks(text, findChunks(mentionees));
  }, [mentionees, text, isShowReadMore]);

  if (!text) {
    return null;
  }

  const linksFounded = linkify.find(text).filter((link) => link.type === 'url');

  return (
    <>
      <Typography.Body className={styles.postContent}>
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
        {isShowReadMore ? (
          <span className={styles.postContent__readmore} onClick={() => setIsReadMoreClick(true)}>
            ...Read more
          </span>
        ) : null}
      </Typography.Body>
      {linksFounded && linksFounded.length > 0 && <LinkPreview url={linksFounded[0].href} />}
    </>
  );
};
