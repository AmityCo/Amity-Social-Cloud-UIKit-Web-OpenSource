import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import Truncate from 'react-truncate-markup';
import React, { useMemo, useState, useCallback } from 'react';
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
  $isSerializedHashtagNode,
} from '~/v4/social/internal-components/Lexical/utils';
import { Typography } from '~/v4/core/components';
import { Button } from '~/v4/core/components/AriaButton';
import { isEmoji } from '~/v4/social/utils/isEmoji';
import styles from './TextWithMention.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useSearchResultContext } from '~/v4/social/providers/SearchResultProvider';

type TextWithMentionProps = {
  pageId?: string;
  isBold?: boolean;
  maxLines?: number;
  componentId?: string;
  data: { text: string };
  mentionees: Mentionees;
  hashtags?: string[];
  metadata?: { mentioned?: Mentioned[]; hashtagged?: Amity.Hashtag[] };
  onClickSeeMoreButton?: () => void;
  seeMoreClassName?: string;
  textClassName?: string;
  linkClassName?: string;
  mentionClassName?: string;
  hashtagClassName?: string;
  keyword?: string;
  isSearchPost?: boolean;
};

export const TextWithMention = ({
  data,
  metadata,
  mentionees,
  hashtags = [],
  pageId = '*',
  maxLines = 8,
  isBold = false,
  componentId = '*',
  seeMoreClassName,
  onClickSeeMoreButton,
  textClassName,
  linkClassName,
  mentionClassName,
  hashtagClassName,
  keyword = '',
  isSearchPost = false,
}: TextWithMentionProps) => {
  const { goToUserProfilePage, goToSocialGlobalSearchPage } = useNavigation();
  const [isExpanded, setIsExpanded] = useState(false);
  const { isDesktop } = useResponsive();
  const { openSearchResultModal } = useSearchResultContext();

  const Component = isBold ? Typography.BodyBold : Typography.Body;

  const editorState = useMemo(
    () => textToEditorState({ data, mentionees, hashtags, metadata }),
    [data, mentionees, hashtags, metadata],
  );

  const escapeRegex = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const getHighlightedText = useCallback((text: string, wordsToHighlight: string[]) => {
    const escapedWords = wordsToHighlight.map(escapeRegex);
    const regex = new RegExp(`\\b(${escapedWords.join('|')})\\b`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const result: JSX.Element[] = [];
      let currentIndex = 0;

      if (isEmoji(part)) {
        return <React.Fragment key={index}>{part}</React.Fragment>;
      }

      while (currentIndex < part.length) {
        const matchedWord = wordsToHighlight.find(
          (word) =>
            part.slice(currentIndex, currentIndex + word.length).toLowerCase() ===
            word.trim().toLowerCase(),
        );

        if (matchedWord) {
          result.push(
            <span key={`${index}-${currentIndex}`} className={styles.textWithMention__highlight}>
              {matchedWord}
            </span>,
          );
          currentIndex += matchedWord.length;
        } else {
          result.push(
            <React.Fragment key={`${index}-${currentIndex}`}>{part[currentIndex]}</React.Fragment>,
          );
          currentIndex++;
        }
      }

      return <span key={index}>{result}</span>;
    });
  }, []);

  const shouldHighlightHashtag = (hashtagText: string) => {
    if (!isSearchPost || !keyword) return false;
    // Check if hashtag matches keyword (with or without # symbol)
    const hashtagWithoutHash = hashtagText.replace(/^#/, '');
    const keywordWithoutHash = keyword.replace(/^#/, '');
    return hashtagWithoutHash.toLowerCase().includes(keywordWithoutHash.toLowerCase());
  };

  const getHighlightedHashtag = useCallback(
    (hashtagText: string) => {
      if (!shouldHighlightHashtag(hashtagText)) {
        return hashtagText;
      }
      const hashtagWithoutHash = hashtagText.replace(/^#/, '');
      const keywordWithoutHash = keyword.replace(/^#/, '');
      const hasHashSymbol = hashtagText.startsWith('#');
      // Find the matching part (case insensitive)
      const lowerHashtag = hashtagWithoutHash.toLowerCase();
      const lowerKeyword = keywordWithoutHash.toLowerCase();
      const matchIndex = lowerHashtag.indexOf(lowerKeyword);
      if (matchIndex === -1) {
        return hashtagText;
      }
      const beforeMatch = hashtagWithoutHash.slice(0, matchIndex);
      const matchedPart = hashtagWithoutHash.slice(
        matchIndex,
        matchIndex + keywordWithoutHash.length,
      );
      const afterMatch = hashtagWithoutHash.slice(matchIndex + keywordWithoutHash.length);
      return (
        <>
          {hasHashSymbol && '#'}
          {beforeMatch}
          <span className={styles.textWithMention__highlight}>{matchedPart}</span>
          {afterMatch}
        </>
      );
    },
    [isSearchPost, keyword],
  );

  const convertSerializedToText = (child: SerializedLexicalNode, childIndex: number) => {
    if ($isSerializedMentionNode<MentionData>(child)) {
      return (
        <span
          key={uuidv4()}
          data-testid={`${pageId}/${componentId}/mention`}
          className={clsx(styles.textWithMention__mention, mentionClassName)}
          onClick={() => goToUserProfilePage(child.data.userId)}
        >
          {child.text}
        </span>
      );
    }

    if ($isSerializedHashtagNode(child)) {
      return (
        <span
          key={uuidv4()}
          data-testid={`${pageId}/${componentId}/hashtag`}
          className={clsx(styles.textWithMention__hashtag, hashtagClassName)}
          onClick={() => {
            isDesktop
              ? openSearchResultModal(child.text)
              : goToSocialGlobalSearchPage(undefined, child.text);
          }}
        >
          {isSearchPost ? getHighlightedHashtag(child.text) : child.text}
        </span>
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
          className={clsx(styles.textWithMention__link, linkClassName)}
          data-testid={`${pageId}/${componentId}/post_link`}
        >
          {$isSerializedTextNode(child.children[0]) ? child.children[0]?.text : child.url}
        </a>
      );
    }

    if ($isSerializedTextNode(child)) {
      return (
        <React.Fragment key={childIndex}>
          {isSearchPost ? getHighlightedText(child.text, [keyword]) : child.text}
        </React.Fragment>
      );
    }

    return null;
  };

  const renderText = (paragraph: SerializedParagraphNode[]) => {
    return paragraph.map((p, index) => (
      <React.Fragment key={index}>
        {p.children.map((child, childIndex) => convertSerializedToText(child, childIndex))}
        <br />
      </React.Fragment>
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
                variant="text"
                className={clsx(styles.textWithMention__seeMore, seeMoreClassName)}
                onPress={() =>
                  onClickSeeMoreButton ? onClickSeeMoreButton() : setIsExpanded(true)
                }
              >
                <Typography.BodyBold> See more</Typography.BodyBold>
              </Button>
            </>
          }
        >
          <div className={clsx(textClassName)}>{renderText(editorState.root.children)}</div>
        </Truncate>
      )}
    </Component>
  );
};
