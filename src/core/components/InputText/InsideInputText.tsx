import React, { useRef, forwardRef, MutableRefObject, useState, KeyboardEventHandler } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import styled, { css } from 'styled-components';
import cx from 'clsx';
import TextareaAutosize from 'react-textarea-autosize';

import SocialMentionItem from '~/core/components/SocialMentionItem';
import { QueryMentioneesFnType } from '~/social/hooks/useSocialMention';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-wrap: wrap;
  min-width: 1em;
  background: ${({ theme }) => theme.palette.base.shade4};
  border: 1px solid #e3e4e8;
  border-radius: 4px;
  transition: background 0.2s, border-color 0.2s;

  ${({ theme }) => theme.typography.global}

  &:focus-within {
    border-color: ${({ theme }) => theme.palette.primary.main};
  }

  &.invalid {
    border-color: ${({ theme }) => theme.palette.alert.main};
  }

  &.disabled {
    background: ${({ theme }) => theme.palette.base.shade4};
    border-color: ${({ theme }) => theme.palette.base.shade3};
  }
`;

const styling = css`
  flex: 1 1 auto;
  display: block;
  width: 1%;
  min-width: 0;
  margin: 0;
  padding: 0.563rem 0.563rem;
  color: ${({ theme }) => theme.palette.neutral.main};
  background: none;
  border: none;
  box-sizing: border-box;
  outline: none;
  font: inherit;

  &::placeholder {
    font-weight: 400;
  }

  &[disabled] {
    background: none;
  }
`;

const TextField = styled.input`
  ${styling}
`;

const TextArea = styled(TextareaAutosize)`
  ${styling};
  resize: vertical;
`;

// Have to hard code this as we have no way of
// injecting these styles with styled components
const suggestListStyles = {
  suggestions: {
    zIndex: 999,
    position: 'absolute',
    transform: 'translateY(1.25rem)',
    list: {
      borderRadius: '0.5rem',
      maxHeight: '17.5rem',
      boxShadow: '0 0 0.3rem #A5A9B5',
      overflow: 'auto',
    },
  },
  '&multiLine': {
    highlighter: {
      boxSizing: 'border-box',
      overflow: 'hidden',
    },
  },
};

const mentionStyle = {
  position: 'relative',
  color: '#1054DE',
  pointerEvents: 'none',
  textShadow: '1px 1px 1px white, 1px -1px 1px white, -1px 1px 1px white, -1px -1px 1px white',
  zIndex: 1,
};

const StyledMentionsInput = styled(MentionsInput)`
  padding: 0.5rem;
  width: 100%;
  textarea {
    ${styling}
    resize: vertical;
  }
`;

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
    },
    ref,
  ) => {
    const [items, setItems] = useState<NonNullable<Awaited<ReturnType<QueryMentioneesFnType>>>>([]);
    const mentionRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);

    const handleMentionInput: React.ComponentProps<typeof StyledMentionsInput>['onChange'] = (
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

    const classNames = cx(className, { disabled, invalid });

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
      <Container ref={containerRef} className={classNames}>
        {prepend}
        <div ref={mentionRef} id="mention-input" />
        {multiline && mentionAllowed && (
          <StyledMentionsInput
            allowSuggestionsAboveCursor
            inputRef={ref as MutableRefObject<HTMLTextAreaElement>}
            rows={rows}
            style={suggestListStyles}
            {...props}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={handleMentionInput}
            onClick={onClick}
            onKeyPress={(e) => onKeyPress?.(e)}
          >
            <Mention
              trigger="@"
              data={(queryValue, callback) => {
                if (!queryMentionees) return callback([]);
                queryMentionees(queryValue).then((result) => {
                  callback(result);
                });
              }}
              style={mentionStyle}
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
          </StyledMentionsInput>
        )}
        {multiline ? (
          !mentionAllowed && (
            <TextArea
              ref={ref as MutableRefObject<HTMLTextAreaElement>}
              minRows={rows}
              maxRows={maxRows}
              {...props}
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
          <TextField
            ref={ref as MutableRefObject<HTMLInputElement>}
            {...props}
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
      </Container>
    );
  },
);

export default InsideInputText;
