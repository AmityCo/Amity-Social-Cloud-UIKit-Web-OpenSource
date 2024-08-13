import React, { useState, useMemo, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { processChunks } from '~/core/components/ChunkHighlighter';
import Button from '~/core/components/Button';
import Linkify from '~/core/components/Linkify';
import MentionHighlightTag from '~/core/components/MentionHighlightTag';
import { Mentioned, findChunks } from '~/helpers/utils';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

export const PostContent = styled.div<{ isExpanded: boolean; postMaxLines: number }>`
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.palette.neutral.main};
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body};
  max-height: ${({ isExpanded, postMaxLines }) =>
    isExpanded ? 'none' : `calc(${postMaxLines} * 1.5em)`}; /* Adjust height based on line count */
  overflow: hidden;
  position: relative;

  /* Hide the ellipsis */
  &::after {
    content: '';
  }
`;

export const ReadMoreButton = styled(Button).attrs({ variant: 'secondary' })`
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 4px;
  display: inline-block;
`;

interface TextContentProps {
  text?: string;
  postMaxLines?: number;
  mentionees?: Mentioned[];
}

const TextContent = ({ text, postMaxLines = 8, mentionees }: TextContentProps) => {
  const chunks = useMemo(
    () => processChunks(text || '', findChunks(mentionees)),
    [mentionees, text],
  );

  const contentRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    if (contentRef.current) {
      const { scrollHeight, clientHeight } = contentRef.current;
      setIsTruncated(scrollHeight > clientHeight);
    }
  }, [text, postMaxLines]);

  const onExpand = () => setIsExpanded(true);

  const textContent = text ? (
    <PostContent
      ref={contentRef}
      isExpanded={isExpanded}
      postMaxLines={postMaxLines}
      data-qa-anchor="post-text-content"
    >
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
    </PostContent>
  ) : null;

  if (!textContent) return null;

  return (
    <>
      {textContent}
      {!isExpanded && isTruncated && (
        <ReadMoreButton onClick={onExpand}>
          <FormattedMessage id="post.readMore" />
        </ReadMoreButton>
      )}
    </>
  );
};

export default (props: TextContentProps) => {
  const CustomComponentFn = useCustomComponent<TextContentProps>('UITextContent');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <TextContent {...props} />;
};
