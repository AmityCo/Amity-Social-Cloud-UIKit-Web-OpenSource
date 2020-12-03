import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import cx from 'classnames';

import TextareaAutosize from 'react-autosize-textarea';
import ConditionalRender from '~/core/components/ConditionalRender';

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  min-width: 1em;
  overflow: hidden;
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
  padding: 0.625rem 0.75rem;
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
  ${styling}
  resize: vertical;
`;

const InputText = ({
  id,
  input = null,
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
  className = null,
}) => {
  const handleChange = useCallback(e => onChange(e.target.value), []);

  const handleKeyDown = useCallback(
    e => {
      if (e.key === 'Backspace' && value.length === 0) onClear();
    },
    [value],
  );

  const classNames = cx(className, { disabled, invalid });

  const props = {
    id,
    name,
    value,
    placeholder,
    disabled,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    className: classNames,
  };

  return (
    <Container className={classNames}>
      {prepend}

      <ConditionalRender condition={multiline}>
        <TextArea ref={input} rows={rows} maxRows={maxRows} {...props} />
        <TextField ref={input} {...props} />
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
  onChange: PropTypes.func.isRequired,
  onClear: PropTypes.func,
  className: PropTypes.string,
};

export default InputText;
