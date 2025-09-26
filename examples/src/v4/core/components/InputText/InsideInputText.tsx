import React, {
  forwardRef,
  KeyboardEventHandler,
  MutableRefObject,
  RefObject,
  useRef,
  useState,
  useEffect,
} from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import clsx from 'clsx';
import TextareaAutosize from 'react-textarea-autosize';

import SocialMentionItem from '~/v4/core/components/SocialMentionItem';
import { QueryMentioneesFnType } from '~/v4/chat/hooks/useMention';

import styles from './styles.module.css';
import typographyStyles from '~/v4/core/components/Typography/Typography.module.css';

interface InsideInputTextProps {
  'data-testid'?: string;
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
  floatingPlaceholder?: boolean;
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
      'data-testid': dataQaAnchor = '',
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
      floatingPlaceholder = false,
    },
    ref,
  ) => {
    const [items, setItems] = useState<NonNullable<Awaited<ReturnType<QueryMentioneesFnType>>>>([]);
    const [hasValue, setHasValue] = useState(!!value);
    const [isFocused, setIsFocused] = useState(false);
    const mentionRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
      setHasValue(!!value);
    }, [value]);

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

    const handleFocus = () => {
      setIsFocused(true);
    };

    const handleBlur = () => {
      setIsFocused(false);
    };

    const handleClick = () => {
      onClick?.();
      if (floatingPlaceholder) {
        setIsFocused(true);
      }
    };

    const classNames = clsx(className, { disabled, invalid });

    const props = {
      id,
      name,
      value,
      placeholder: floatingPlaceholder && !multiline ? ' ' : placeholder, // Only use empty placeholder for single-line floating inputs
      disabled,
      className: classNames,
      'data-testid': dataQaAnchor,
      onFocus: handleFocus,
      onBlur: handleBlur,
    };

    return (
      <div
        ref={containerRef}
        className={clsx(styles.inputTextContainer, classNames, typographyStyles.typography__body)}
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
          !mentionAllowed && floatingPlaceholder ? (
            <div className={styles.textareaLabelContainer}>
              <TextareaAutosize
                ref={ref as MutableRefObject<HTMLTextAreaElement>}
                minRows={rows}
                maxRows={maxRows}
                {...props}
                placeholder={placeholder} // Keep the original placeholder inside the textarea
                className={clsx(
                  styles.baseInputStyle,
                  styles.textareaInput,
                  props.className,
                  // Border color states
                  invalid && styles.inputError,
                  !invalid && hasValue && styles.inputFilled,
                  disabled && styles.inputDisabled,
                )}
                onChange={(e) =>
                  onChange?.({
                    text: e.target.value,
                    plainText: e.target.value,
                    lastMentionText: '',
                    mentions: [],
                  })
                }
                onKeyDown={(e) => handleKeyDown(e)}
                onClick={handleClick}
              />
              <label
                className={clsx(
                  styles.textareaLabel,
                  // Error state (highest priority)
                  invalid && styles.textareaLabelError,
                  // Filled state (when has value but not error)
                  !invalid && hasValue && styles.textareaLabelFilled,
                  // Disabled state
                  disabled && styles.textareaLabelDisabled,
                )}
                htmlFor={id}
              >
                {placeholder}
              </label>
            </div>
          ) : (
            !mentionAllowed && (
              <TextareaAutosize
                ref={ref as MutableRefObject<HTMLTextAreaElement>}
                minRows={rows}
                maxRows={maxRows}
                {...props}
                className={clsx(
                  styles.baseInputStyle,
                  props.className,
                  // Border color states for non-floating textareas too
                  invalid && styles.inputError,
                  !invalid && hasValue && styles.inputFilled,
                  disabled && styles.inputDisabled,
                )}
                onChange={(e) =>
                  onChange?.({
                    text: e.target.value,
                    plainText: e.target.value,
                    lastMentionText: '',
                    mentions: [],
                  })
                }
                onKeyDown={(e) => handleKeyDown(e)}
                onClick={handleClick}
              />
            )
          )
        ) : floatingPlaceholder ? (
          <label className={styles.labelContainer}>
            <input
              type="text"
              ref={ref as MutableRefObject<HTMLInputElement>}
              {...props}
              className={clsx(
                styles.baseInputStyle,
                props.className,
                // Border color states
                invalid && styles.inputError,
                !invalid && hasValue && styles.inputFilled,
                disabled && styles.inputDisabled,
              )}
              onChange={(e) =>
                onChange?.({
                  text: e.target.value,
                  plainText: e.target.value,
                  lastMentionText: '',
                  mentions: [],
                })
              }
              onKeyDown={(e) => handleKeyDown(e)}
              onClick={handleClick}
            />
            <span
              className={clsx(
                styles['input-label'],
                // Move to top if focused or has value
                (isFocused || hasValue) && styles.inputLabelActive,
                // Error state (highest priority)
                invalid && styles.inputLabelError,
                // Filled state (when has value but not error and not focused)
                !invalid && hasValue && !isFocused && styles.inputLabelFilled,
                // Focus state (when focused but not error)
                !invalid && isFocused && styles.inputLabelFocus,
                // Disabled state
                disabled && styles.inputLabelDisabled,
              )}
            >
              {placeholder}
            </span>
          </label>
        ) : (
          <input
            type="text"
            ref={ref as MutableRefObject<HTMLInputElement>}
            {...props}
            className={clsx(
              styles.baseInputStyle,
              props.className,
              // Border color states for non-floating inputs too
              invalid && styles.inputError,
              !invalid && hasValue && styles.inputFilled,
              disabled && styles.inputDisabled,
            )}
            onChange={(e) =>
              onChange?.({
                text: e.target.value,
                plainText: e.target.value,
                lastMentionText: '',
                mentions: [],
              })
            }
            onKeyDown={(e) => handleKeyDown(e)}
            onClick={handleClick}
          />
        )}
        {append}
      </div>
    );
  },
);

export default InsideInputText;
