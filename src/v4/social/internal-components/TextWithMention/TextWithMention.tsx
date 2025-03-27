import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import Truncate from 'react-truncate-markup';
import React, { useMemo, useState } from 'react';
import { SerializedLexicalNode, SerializedParagraphNode } from 'lexical';
import { Mentioned, Mentionees } from '~/v4/helpers/utils';
import { useNavigation } from '~/v4/core/providers/NavigationProvider';
import {
  MentionData,
  textToEditorState,
  $isSerializedTextNode,
  $isSerializedLinkNode,
  $isSerializedMentionNode,
  $isSerializedAutoLinkNode,
} from '~/v4/social/internal-components/Lexical/utils';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/natives/Button/Button';
import styles from './TextWithMention.module.css';

type TextWithMentionProps = {
  pageId?: string;
  isBold?: boolean;
  maxLines?: number;
  componentId?: string;
  data: { text: string };
  mentionees: Mentionees;
  metadata?: { mentioned?: Mentioned[] };
};

export const TextWithMention = ({
  data,
  metadata,
  mentionees,
  pageId = '*',
  maxLines = 8,
  isBold = false,
  componentId = '*',
}: TextWithMentionProps) => {
  const { goToUserProfilePage } = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);

  const Component = isBold ? Typography.BodyBold : Typography.Body;

  const editorState = useMemo(
    () => textToEditorState({ data, mentionees, metadata }),
    [data, mentionees, metadata],
  );

  const convertSerializedToText = (child: SerializedLexicalNode, childIndex: number) => {
    if ($isSerializedMentionNode<MentionData>(child)) {
      return (
        <Button
          key={uuidv4()}
          data-testid={`${pageId}/${componentId}/mention`}
          className={clsx(styles.textWithMention__mention)}
          onPress={() => goToUserProfilePage(child.data.userId)}
        >
          {child.text}
        </Button>
      );
    }

    if ($isSerializedAutoLinkNode(child) || $isSerializedLinkNode(child)) {
      return (
        <a
          target="_blank"
          key={child.url}
          href={child.url}
          rel="noopener noreferrer"
          onMouseUp={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          className={clsx(styles.textWithMention__link)}
          data-testid={`${pageId}/${componentId}/post_link`}
        >
          {$isSerializedTextNode(child.children[0]) ? child.children[0]?.text : child.url}
        </a>
      );
    }

    if ($isSerializedTextNode(child)) {
      return <span key={childIndex}>{child.text}</span>;
    }

    return null;
  };

  const renderText = (paragraph: SerializedParagraphNode[]) => {
    return paragraph.map((p, index) => (
      <span key={index}>
        {p.children.map((child, childIndex) => convertSerializedToText(child, childIndex))}
        <br />
      </span>
    ));
  };

  return (
    <Component className={styles.textWithMention__container}>
      {isExpanded ? (
        renderText(editorState.root.children)
      ) : (
        <Truncate
          lines={maxLines}
          ellipsis={
            <>
              ...{' '}
              <Button
                className={styles.textWithMention__seeMore}
                onPress={() => setIsExpanded(true)}
              >
                See more
              </Button>
            </>
          }
        >
          <div>{renderText(editorState.root.children)}</div>
        </Truncate>
      )}
    </Component>
  );
};
