import React, {
  forwardRef,
  KeyboardEventHandler,
  MutableRefObject,
  RefObject,
  useRef,
  useState,
} from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import clsx from 'clsx';
import TextareaAutosize from 'react-textarea-autosize';

import SocialMentionItem from '~/v4/core/components/SocialMentionItem';
import { QueryMentioneesFnType } from '~/v4/chat/hooks/useMention';

import styles from './styles.module.css';
import typography from '~/v4/styles/typography.module.css';

interface InsideInputTextProps {
  'data-qa-anchor'?: string;
  id?: string;
  input?: unknown;
  name?: string;
  value?: string;
  placeholder?: string;
  multiline?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  rows?: number;
  maxRows?: number;
  prepend?: React.ReactNode;
  append?: React.ReactNode;
  className?: string;
  mentionAllowed?: boolean;
  isModerator?: boolean;
  queryMentionees?: QueryMentioneesFnType;
  loadMoreMentionees?: (query: string) => Promise<unknown>;
  onChange: (data: {
    text: string;
    plainText: string;
    lastMentionText?: string;
    mentions: {
      plainTextIndex: number;
      id: string;
      display: string;
    }[];
  }) => void;
  onKeyPress?: (event: React.KeyboardEvent) => void;
  onClear?: () => void;
  onClick?: () => void;
  suggestionRef?: RefObject<HTMLDivElement>;
  mentionColor?: string;
}

const InsideInputText = forwardRef<HTMLInputElement | HTMLTextAreaElement, InsideInputTextProps>(
  (
    {
      'data-qa-anchor': dataQaAnchor = '',
      id,
      name = '',
      value = '',
      placeholder = '',
      multiline = false,
      disabled = false,
      invalid = false,
      rows = 1,
      maxRows = 3,
      prepend,
      append,
      onChange,
      onClear,
      onClick,
      onKeyPress,
      className,
      mentionAllowed = false,
      queryMentionees,
      loadMoreMentionees,
      isModerator,
      suggestionRef,
      mentionColor,
    },
    ref,
  ) => {
    const [items, setItems] = useState<NonNullable<Awaited<ReturnType<QueryMentioneesFnType>>>>([]);
    const mentionRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleMentionInput: React.ComponentProps<typeof MentionsInput>['onChange'] = (
      e,
      [,],
      newPlainVal,
      mentions,
    ) => {
      // Get last item of mention and save it in upper parent component
      // This way we can call loadMoreMentionees and append new values
      // inside the existing array
      const lastSegment = newPlainVal.split(' ').pop();
      const isMentionText = lastSegment?.[0]?.match(/^@/g) || false;

      onChange({
        text: e.target.value,
        plainText: newPlainVal,
        lastMentionText: isMentionText ? lastSegment : undefined,
        mentions,
      });
    };

    const handleKeyDown: KeyboardEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
      if (e.key === 'Backspace' && value?.length === 0) onClear?.();
    };

    const classNames = clsx(className, { disabled, invalid });

    const props = {
      id,
      name,
      value,
      placeholder,
      disabled,
      className: classNames,
      'data-qa-anchor': dataQaAnchor,
    };

    return (
      <div
        ref={containerRef}
        className={clsx(
          styles.inputTextContainer,
          classNames,
          typography['typography'],
          typography['typography-body'],
        )}
      >
        {prepend}
        <div ref={mentionRef} className={styles.mentionContainer} id="mention-input" />
        {multiline && mentionAllowed && (
          <MentionsInput
            allowSuggestionsAboveCursor
            inputRef={ref as MutableRefObject<HTMLTextAreaElement>}
            rows={rows}
            {...props}
            className="live-chat-mention-input"
            classNames={styles}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={handleMentionInput}
            onClick={onClick}
            suggestionsPortalHost={(suggestionRef?.current || mentionRef.current) as Element}
            onKeyPress={(e) => onKeyPress?.(e)}
          >
            <Mention
              trigger="@"
              className={clsx(styles.mentions_mention, mentionColor)}
              data={(queryValue, callback) => {
                if (!queryMentionees) return callback([]);
                queryMentionees(queryValue).then((result) => {
                  if (!isModerator) {
                    callback(result);
                    return;
                  }

                  const mentionItem = {
                    id: '@all',
                    display: 'All',
                    isLastItem: false,
                  };

                  const resultWithAllMention = mentionItem.display
                    .toLowerCase()
                    .includes(queryValue.trim().toLowerCase())
                    ? [mentionItem]
                    : [];

                  callback(resultWithAllMention.concat(result));
                });
              }}
              renderSuggestion={({ id }, search, highlightedDisplay, index, focused) => {
                return (
                  <SocialMentionItem
                    focused={focused}
                    id={typeof id === 'number' ? `${id}` : id}
                    isLastItem={id === items[items.length - 1]?.id}
                    containerRef={containerRef}
                    rootEl={mentionRef}
                    loadMore={() => loadMoreMentionees?.(search)}
                  />
                );
              }}
              displayTransform={(_id, display) => `@${display}`}
              appendSpaceOnAdd
              onAdd={() => {}}
            />
          </MentionsInput>
        )}
        {multiline ? (
          !mentionAllowed && (
            <TextareaAutosize
              ref={ref as MutableRefObject<HTMLTextAreaElement>}
              minRows={rows}
              maxRows={maxRows}
              {...props}
              className={clsx(styles.baseInputStyle, props.className)}
              onChange={(e) =>
                onChange?.({
                  text: e.target.value,
                  plainText: e.target.value,
                  lastMentionText: '',
                  mentions: [],
                })
              }
              onKeyDown={(e) => handleKeyDown(e)}
              onClick={onClick}
            />
          )
        ) : (
          <input
            type="text"
            ref={ref as MutableRefObject<HTMLInputElement>}
            {...props}
            className={clsx(styles.baseInputStyle, props.className)}
            onChange={(e) =>
              onChange?.({
                text: e.target.value,
                plainText: e.target.value,
                lastMentionText: '',
                mentions: [],
              })
            }
            onKeyDown={(e) => handleKeyDown(e)}
            onClick={onClick}
          />
        )}
        {append}
      </div>
    );
  },
);

export default InsideInputText;
