import { SerializedParagraphNode, SerializedTextNode } from 'lexical';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Typography } from '~/v4/core/components';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import styles from './TextWithMention.module.css';
import {
  textToEditorState,
  $isSerializedMentionNode,
  $isSerializedAutoLinkNode,
  $isSerializedTextNode,
  MentionData,
  $isSerializedLinkNode,
} from '~/v4/social/internal-components/Lexical/utils';
import clsx from 'clsx';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import { Button } from '~/v4/core/natives/Button/Button';

interface TextWithMentionProps {
  pageId?: string;
  componentId?: string;
  maxLines?: number;
  data: {
    text: string;
  };
  mentionees: Mentionees;
  metadata?: {
    mentioned?: Mentioned[];
  };
}

export const TextWithMention = ({
  pageId = '*',
  componentId = '*',
  maxLines = 8,
  data,
  mentionees,
  metadata,
}: TextWithMentionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isClamped, setIsClamped] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const fullContentRef = useRef<HTMLDivElement>(null);

  const { goToUserProfilePage } = useNavigation();

  const editorState = useMemo(
    () =>
      textToEditorState({
        data,
        mentionees,
        metadata,
      }),
    [data, mentionees, metadata],
  );

  useEffect(() => {
    // check if should be clamped or not, then hide the full content
    const fullContentHeight = fullContentRef.current?.clientHeight || 0;

    const rootFontSize = parseInt(
      window.getComputedStyle(document.body).getPropertyValue('font-size'),
      10,
    );

    const clampHeight =
      parseFloat(
        getComputedStyle(document.documentElement).getPropertyValue('--asc-line-height-md'),
      ) * rootFontSize;

    if (fullContentHeight > clampHeight * maxLines) {
      setIsClamped(true);
    }

    setIsHidden(true);
  }, []);

  const renderText = (paragraph: SerializedParagraphNode, typoClassName: string) => {
    return paragraph.children.map((child) => {
      if ($isSerializedMentionNode<MentionData>(child)) {
        return (
          <Button
            data-qa-anchor={`${pageId}/${componentId}/mention`}
            key={child.data.userId}
            className={clsx(typoClassName, styles.textWithMention__mention)}
            onPress={() => goToUserProfilePage(child.data.userId)}
          >
            {child.text}
          </Button>
        );
      }
      if ($isSerializedAutoLinkNode(child) || $isSerializedLinkNode(child)) {
        return (
          <a
            key={child.url}
            href={child.url}
            className={clsx(typoClassName, styles.textWithMention__link)}
            data-qa-anchor={`${pageId}/${componentId}/post_link`}
          >
            {$isSerializedTextNode(child.children[0]) ? child.children[0]?.text : child.url}
          </a>
        );
      }

      if ($isSerializedTextNode(child)) {
        return (
          <span className={clsx(typoClassName, styles.textWithMention__text)}>{child.text}</span>
        );
      }

      return null;
    });
  };

  return (
    <div className={styles.textWithMention__container}>
      <div
        ref={fullContentRef}
        className={styles.textWithMention__fullContent}
        data-hidden={isHidden}
      >
        {editorState.root.children.map((paragraph) => {
          return (
            <p className={styles.textWithMention__paragraph}>
              {paragraph.children.length > 0 ? (
                <Typography.Body
                  renderer={({ typoClassName }) => {
                    return <>{renderText(paragraph, typoClassName)}</>;
                  }}
                />
              ) : (
                <br />
              )}
            </p>
          );
        })}
      </div>
      <div
        data-qa-anchor={`${pageId}/${componentId}/text_with_mention`}
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
        {editorState.root.children.map((paragraph, index) => {
          return (
            <p className={styles.textWithMention__paragraph} key={index}>
              {paragraph.children.length > 0 ? (
                <Typography.Body
                  renderer={({ typoClassName }) => {
                    return <>{renderText(paragraph, typoClassName)}</>;
                  }}
                />
              ) : (
                <br />
              )}
            </p>
          );
        })}
      </div>
    </div>
  );
};
