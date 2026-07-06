import React, {
  useRef,
  forwardRef,
  MutableRefObject,
  useState,
  useCallback,
  KeyboardEventHandler,
} from 'react';
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
  transition:
    background 0.2s,
    border-color 0.2s;

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
// injecting these styles with styled components.
//
// The suggestions list is rendered into a portal (see `suggestionsPortalHost`
// below) so it can escape any ancestor `overflow: hidden`. react-mentions
// positions a portalled overlay with viewport-relative coordinates, so the
// list must be `fixed` rather than `absolute` — otherwise our style here
// overrides react-mentions' computed `position` and the list gets clipped to
// a sliver inside the compose bar (ENG-701).
const suggestListStyles = {
  suggestions: {
    zIndex: 999,
    position: 'fixed',
    transform: 'translateY(1.25rem)',
    // Theme via DS tokens so the dropdown matches the app's colour scheme in
    // both light and dark themes (the kit's styled-components palette is frozen
    // at light; react-mentions otherwise defaults the panel to white, which
    // makes the light foreground text unreadable in dark mode).
    backgroundColor: 'var(--asc-color-background-default)',
    color: 'var(--asc-color-base-default)',
    border: '1px solid var(--asc-color-base-shade4)',
    borderRadius: '0.5rem',
    boxShadow: '0 0.5rem 1.5rem rgba(0, 0, 0, 0.32), 0 0 0.25rem rgba(0, 0, 0, 0.12)',
    overflow: 'hidden',
    list: {
      borderRadius: '0.5rem',
      maxHeight: '17.5rem',
      overflow: 'auto',
      backgroundColor: 'var(--asc-color-background-default)',
    },
    item: {
      // react-mentions toggles `&focused` on keyboard navigation and mouse
      // hover, so this doubles as the hover highlight.
      '&focused': {
        backgroundColor: 'var(--asc-color-base-shade4)',
      },
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
    },
    ref,
  ) => {
    const [items, setItems] = useState<NonNullable<Awaited<ReturnType<QueryMentioneesFnType>>>>([]);
    const mentionRef = useRef<HTMLDivElement | null>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    // Hold the `#mention-input` node in state so react-mentions receives a
    // non-null `suggestionsPortalHost` on the render that opens the suggestions
    // list. A plain ref isn't enough: it's still null on the render where the
    // overlay first mounts, so react-mentions would fall back to absolute
    // (clipped) positioning. Portalling the list into this node also keeps it a
    // descendant of `mentionRef`, which SocialMentionItem relies on as the
    // IntersectionObserver root for loadMore.
    const [mentionPortalHost, setMentionPortalHost] = useState<HTMLDivElement | null>(null);
    const setMentionHostRef = useCallback((el: HTMLDivElement | null) => {
      mentionRef.current = el;
      setMentionPortalHost(el);
    }, []);

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
      'data-testid': dataQaAnchor,
    };

    return (
      <Container ref={containerRef} className={classNames}>
        {prepend}
        <div ref={setMentionHostRef} id="mention-input" />
        {multiline && mentionAllowed && (
          <StyledMentionsInput
            allowSuggestionsAboveCursor
            inputRef={ref as MutableRefObject<HTMLTextAreaElement>}
            rows={rows}
            style={suggestListStyles}
            suggestionsPortalHost={mentionPortalHost ?? undefined}
            {...props}
            onKeyDown={(e) => handleKeyDown(e)}
            onChange={handleMentionInput}
            onClick={onClick}
            onKeyPress={(e) => onKeyPress?.(e)}
          >
            <Mention
              trigger="@"
              markup="@[__display__](__id__)"
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
