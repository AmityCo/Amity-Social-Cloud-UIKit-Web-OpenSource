import React, { useCallback } from 'react';
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
  onChange = () => {},
  className = null,
}) => {
  const handleChange = useCallback(e => onChange(e.target.value), []);

  const classNames = cx(className, { disabled, invalid });

  const props = {
    id,
    name,
    value,
    placeholder,
    disabled,
    onChange: handleChange,
    className: classNames,
  };

  return (
    <Container className={classNames}>
      {prepend}

      <ConditionalRender condition={multiline}>
        <TextArea ref={input} {...props} rows={rows} maxRows={maxRows} />
        <TextField ref={input} {...props} />
      </ConditionalRender>

      {append}
    </Container>
  );
};

export default InputText;
