import { SerializedParagraphNode, SerializedTextNode } from 'lexical';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Typography } from '~/v4/core/components';
import { Mentioned } from '~/v4/helpers/utils';
import { TextToEditorState } from '~/v4/social/components/CommentComposer/CommentInput';
import styles from './TextWithMention.module.css';
import { v4 } from 'uuid';

interface TextWithMentionProps {
  maxLines?: number;
  data: {
    text: string;
  };
  mentionees: Amity.UserMention[];
  metadata?: {
    mentioned?: Mentioned[];
  };
}

export const TextWithMention = ({ maxLines = 8, ...props }: TextWithMentionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const fullContentRef = useRef<HTMLDivElement>(null);

  const editorState = useMemo(() => {
    return TextToEditorState(props);
  }, [props]);

  useEffect(() => {
    // check if should be clamped or not, then hide the full content
    const fullContentHeight = fullContentRef.current?.clientHeight || 0;

    const clampHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--asc-line-height-md'),
      ) * 16;

    if (fullContentHeight > clampHeight * maxLines) {
      setIsClamped(true);
    }

    setIsHidden(true);
  }, []);

  const renderText = (paragraph: SerializedParagraphNode) => {
    return paragraph.children.map((text) => {
      const uid = v4();
      if ((text as SerializedTextNode).type === 'mention') {
        return (
          <span key={uid} className={styles.textWithMention__mention}>
            {(text as SerializedTextNode).text}
          </span>
        );
      }
      return (
        <span key={uid} className={styles.textWithMention__text}>
          {(text as SerializedTextNode).text}
        </span>
      );
    });
  };

  return (
    <div className={styles.textWithMention__container}>
      <div
        ref={fullContentRef}
        className={styles.textWithMention__fullContent}
        data-hidden={isHidden}
      >
        {editorState.root.children.map((child) => {
          const uuid = v4();
          return <Typography.Body key={uuid}>{renderText(child)}</Typography.Body>;
        })}
      </div>
      <div
        key={isExpanded ? 'expanded' : 'collapsed'}
        data-expanded={isExpanded}
        className={styles.textWithMention__clamp}
        style={
          {
            '--asc-text-with-mention-max-lines': maxLines,
          } as React.CSSProperties
        }
      >
        {isClamped && !isExpanded && (
          <div onClick={() => setIsExpanded(true)} className={styles.textWithMention__showMoreLess}>
            <Typography.Body>...See more</Typography.Body>
          </div>
        )}
        {editorState.root.children.map((child, index) => {
          const uuid = v4();
          return <Typography.Body key={uuid}>{renderText(child)}</Typography.Body>;
        })}
      </div>
    </div>
  );
};
