import React, { useCallback, useRef, forwardRef } from 'react';
import { Mention, MentionsInput } from 'react-mentions';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import cx from 'classnames';
import TextareaAutosize from 'react-autosize-textarea';

import ConditionalRender from '~/core/components/ConditionalRender';
import SocialMentionItem from '~/core/components/SocialMentionItem';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: 1em;
  background: ${({ theme }) => theme.palette.system.background};
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

const displayTransform = (_, display) => `@${display}`;
// Have to hard code this as we have no way of
// injecting these styles with styled components
const suggestListStyles = {
  suggestions: {
    zIndex: 999,
    list: {
      borderRadius: '0.5rem',
      minWidth: '22.5rem',
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
    ${styling};
    resize: vertical;
  }
`;

const renderMentionItem = (
  { id, isLastItem },
  search,
  highlightedDisplay,
  index,
  focused,
  dataLength,
  parentContainer,
  loadMore,
) => (
  <SocialMentionItem
    focused={focused}
    id={id}
    highlightedDisplay={highlightedDisplay}
    isLastItem={isLastItem}
    rootEl={parentContainer}
    loadMore={loadMore}
  />
);

const InputText = (
  {
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
    onClear = () => {},
    onClick = () => {},
    onKeyPress = () => {},
    className = null,
    mentionAllowed = false,
    queryMentionees = () => [],
    loadMoreMentionees = () => [],
  },
  ref,
) => {
  const mentionRef = useRef();
  const handleMentionInput = useCallback(
    (e, [,], newPlainVal, mentions) => {
      // Get last item of mention and save it in upper parent component
      // This way we can call loadMoreMentionees and append new values
      // inside the existing array
      const lastSegment = newPlainVal.split(' ').pop();
      const isMentionText = lastSegment[0]?.match(/^@/g);

      onChange({
        text: e.target.value,
        plainText: newPlainVal,
        lastMentionText: isMentionText && lastSegment,
        mentions,
      });
    },
    [onChange],
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Backspace' && value.length === 0) onClear();
    },
    [onClear, value.length],
  );

  const classNames = cx(className, { disabled, invalid });

  const props = {
    id,
    name,
    value,
    placeholder,
    disabled,
    onChange: mentionAllowed ? handleMentionInput : (e) => onChange(e.target.value),
    onKeyDown: handleKeyDown,
    className: classNames,
  };

  return (
    <Container className={classNames}>
      {prepend}
      <div ref={mentionRef} id="mention-input" />
      {multiline && mentionAllowed && (
        <StyledMentionsInput
          allowSuggestionsAboveCursor
          inputRef={ref}
          rows={rows}
          maxRows={maxRows}
          suggestionsPortalHost={mentionRef?.current}
          style={suggestListStyles}
          {...props}
          onClick={onClick}
          onKeyPress={onKeyPress}
        >
          <Mention
            trigger="@"
            data={queryMentionees}
            style={mentionStyle}
            renderSuggestion={(...args) =>
              renderMentionItem(...args, queryMentionees?.length, mentionRef, loadMoreMentionees)
            }
            displayTransform={displayTransform}
            appendSpaceOnAdd
            onAdd={() => {}}
          />
        </StyledMentionsInput>
      )}
      <ConditionalRender condition={multiline}>
        {!mentionAllowed && (
          <TextArea ref={ref} rows={rows} maxRows={maxRows} {...props} onClick={onClick} />
        )}
        <TextField ref={ref} {...props} onClick={onClick} />
      </ConditionalRender>
      {append}
    </Container>
  );
};

InputText.propTypes = {
  id: PropTypes.string,
  input: PropTypes.object,
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  multiline: PropTypes.bool,
  disabled: PropTypes.bool,
  invalid: PropTypes.bool,
  rows: PropTypes.number,
  maxRows: PropTypes.number,
  prepend: PropTypes.node,
  append: PropTypes.node,
  className: PropTypes.string,
  mentionAllowed: PropTypes.bool,
  queryMentionees: PropTypes.func,
  loadMoreMentionees: PropTypes.func,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func,
  onClear: PropTypes.func,
  onClick: PropTypes.func,
};

export default forwardRef(InputText);
