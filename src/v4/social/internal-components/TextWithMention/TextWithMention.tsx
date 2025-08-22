import clsx from 'clsx';
import { v4 as uuidv4 } from 'uuid';
import Truncate from 'react-truncate-markup';
import React, { useMemo, useState, useCallback, useEffect } from 'react';
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
import { isEmoji } from '~/v4/social/utils/isEmoji';
import { Button } from '~/v4/core/components/AriaButton';
import styles from './TextWithMention.module.css';
import { useResponsive } from '~/v4/core/hooks/useResponsive';
import { useSearchResultContext } from '~/v4/social/providers/SearchResultProvider';
import { hashtagRegex } from '~/v4/social/utils/hashtagRegex';

interface TextWithMentionProps {
  pageId?: string;
  isBold?: boolean;
  maxLines?: number;
  componentId?: string;
  data: { text: string };
  mentionees: Mentionees;
  hashtags?: string[];
  metadata?: { mentioned?: Mentioned[]; hashtagged?: Amity.Hashtag[] };
  onClickSeeMoreButton?: (isOpen: boolean) => void;
  seeMoreClassName?: string;
  textClassName?: string;
  linkClassName?: string;
  mentionClassName?: string;
  hashtagClassName?: string;
  keyword?: string;
  isSearchPost?: boolean;
  seeLessSupport?: boolean;
  seeMoreIsOpen?: boolean;
}

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
  seeMoreIsOpen = false,
  isSearchPost = false,
  seeLessSupport = false,
}: TextWithMentionProps) => {
  const { goToUserProfilePage, goToSocialGlobalSearchPage } = useNavigation();
  const [isExpanded, setIsExpanded] = useState(seeMoreIsOpen);
  const { isDesktop } = useResponsive();
  const { openSearchResultModal, setSearchValue } = useSearchResultContext();

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

    // For exact word matching when keyword starts with #
    if (keyword.startsWith('#')) {
      return hashtagWithoutHash.toLowerCase() === keywordWithoutHash.toLowerCase();
    }

    // For partial matching when keyword doesn't start with #
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
      const keywordStartsWithHash = keyword.startsWith('#');

      // For exact matching when keyword starts with #, highlight the entire hashtag
      if (
        keywordStartsWithHash &&
        hashtagWithoutHash.toLowerCase() === keywordWithoutHash.toLowerCase()
      ) {
        return <span className={styles.textWithMention__highlight}>{hashtagText}</span>;
      }

      // For partial matching, find the matching part (case insensitive)
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

  const isValidHashtag = useCallback(
    (hashtagText: string) => {
      // Remove the # symbol to get the hashtag content
      const hashtagContent = hashtagText.replace(/^#/, '');

      // Check if hashtag exists in props hashtags array
      if (hashtags.includes(hashtagContent)) {
        return true;
      }

      // Check if hashtag exists in metadata.hashtagged array
      if (metadata?.hashtagged?.some((tag) => tag.text === hashtagContent)) {
        return true;
      }

      return false;
    },
    [hashtags, metadata],
  );

  const parseTextWithHashtags = useCallback(
    (text: string) => {
      // Regex to match hashtags: # followed by alphanumeric characters and underscores, max 101 characters
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = hashtagRegex.exec(text)) !== null) {
        // Add text before hashtag
        if (match.index > lastIndex) {
          const beforeText = text.slice(lastIndex, match.index);
          if (isSearchPost) {
            parts.push(getHighlightedText(beforeText, [keyword]));
          } else {
            parts.push(beforeText);
          }
        }

        // Add hashtag with styling only if it's a valid hashtag
        const hashtagText = match[0];
        const shouldStyleAsHashtag = isValidHashtag(hashtagText);

        if (shouldStyleAsHashtag) {
          parts.push(
            <span
              key={`hashtag-${match.index}`}
              data-testid={`${pageId}/${componentId}/hashtag`}
              className={clsx(styles.textWithMention__hashtag, hashtagClassName)}
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                isDesktop
                  ? (() => {
                      window.parent.postMessage('parentNeedsScrollToTop', '*');
                      openSearchResultModal(hashtagText);
                    })()
                  : (() => {
                      setSearchValue(hashtagText);
                      goToSocialGlobalSearchPage(undefined, hashtagText);
                    })();
              }}
              onMouseUp={(e) => e.stopPropagation()}
              onTouchEnd={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerUp={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onTouchStart={(e) => e.stopPropagation()}
            >
              {isSearchPost ? getHighlightedHashtag(hashtagText) : hashtagText}
            </span>,
          );
        } else {
          // Render as plain text if not a valid hashtag
          const textToRender = isSearchPost
            ? getHighlightedText(hashtagText, [keyword])
            : hashtagText;
          parts.push(textToRender);
        }

        lastIndex = match.index + match[0].length;
      }

      // Add remaining text
      if (lastIndex < text.length) {
        const remainingText = text.slice(lastIndex);
        if (isSearchPost) {
          parts.push(getHighlightedText(remainingText, [keyword]));
        } else {
          parts.push(remainingText);
        }
      }

      return parts.length > 0 ? parts : [isSearchPost ? getHighlightedText(text, [keyword]) : text];
    },
    [
      pageId,
      componentId,
      hashtagClassName,
      isDesktop,
      openSearchResultModal,
      setSearchValue,
      goToSocialGlobalSearchPage,
      isSearchPost,
      getHighlightedHashtag,
      getHighlightedText,
      keyword,
      isValidHashtag,
    ],
  );

  const convertSerializedToText = (child: SerializedLexicalNode, childIndex: number) => {
    if ($isSerializedMentionNode<MentionData>(child)) {
      return (
        <span
          key={uuidv4()}
          data-testid={`${pageId}/${componentId}/mention`}
          className={clsx(styles.textWithMention__mention, mentionClassName)}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            goToUserProfilePage(child.data.userId);
          }}
          onMouseUp={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerUp={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          {child.text}
        </span>
      );
    }

    if ($isSerializedHashtagNode(child)) {
      const shouldStyleAsHashtag = isValidHashtag(child.text);

      if (shouldStyleAsHashtag) {
        return (
          <span
            key={uuidv4()}
            data-testid={`${pageId}/${componentId}/hashtag`}
            className={clsx(styles.textWithMention__hashtag, hashtagClassName)}
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              isDesktop
                ? (() => {
                    window.parent.postMessage('parentNeedsScrollToTop', '*');
                    openSearchResultModal(child.text);
                  })()
                : (() => {
                    setSearchValue(child.text);
                    goToSocialGlobalSearchPage(undefined, child.text);
                  })();
            }}
            onMouseUp={(e) => e.stopPropagation()}
            onTouchEnd={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerUp={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onTouchStart={(e) => e.stopPropagation()}
          >
            {isSearchPost ? getHighlightedHashtag(child.text) : child.text}
          </span>
        );
      } else {
        // Render as plain text if not a valid hashtag
        return (
          <React.Fragment key={childIndex}>
            {isSearchPost ? getHighlightedText(child.text, [keyword]) : child.text}
          </React.Fragment>
        );
      }
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
      return <React.Fragment key={childIndex}>{parseTextWithHashtags(child.text)}</React.Fragment>;
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

  useEffect(() => {
    setIsExpanded(seeMoreIsOpen);
  }, [seeMoreIsOpen]);

  return (
    <Component className={clsx(styles.textWithMention__container, textClassName)}>
      {isExpanded ? (
        <>
          {renderText(editorState.root.children)}
          {seeLessSupport && (
            <Button
              variant="text"
              className={clsx(styles.textWithMention__seeMore, seeMoreClassName)}
              onPress={() => {
                onClickSeeMoreButton?.(false);
                setIsExpanded(false);
              }}
            >
              <Typography.BodyBold>See less</Typography.BodyBold>
            </Button>
          )}
        </>
      ) : (
        <Truncate
          lines={maxLines}
          ellipsis={
            <>
              ...{' '}
              <Button
                variant="text"
                className={clsx(styles.textWithMention__seeMore, seeMoreClassName)}
                onPress={() => {
                  onClickSeeMoreButton?.(true);
                  setIsExpanded(true);
                }}
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
