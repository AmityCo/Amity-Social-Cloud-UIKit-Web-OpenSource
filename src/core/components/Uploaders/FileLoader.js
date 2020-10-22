import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cx from 'classnames';

const FileLoaderContainer = styled.label`
  cursor: pointer;
  background: rgba(0, 0, 0, 0);
  transition: background 0.1s;

  &.hover {
    background: rgba(0, 0, 0, 0.025);
  }

  &.disabled {
    cursor: not-allowed;
  }
`;

const FileInput = styled.input.attrs({ type: 'file' })`
  display: none;
`;

const muteEvent = fn => e => {
  e.preventDefault();
  e.stopPropagation();
  return fn(e);
};

const FileLoader = ({ className, mimeType, multiple, disabled, onChange, children }) => {
  const [uniqId] = useState(`_${(Date.now() * Math.random()).toString(36)}`);
  const [hover, setHover] = useState(false);

  const onDragEnter = useCallback(
    muteEvent(e => {
      if (disabled) return;

      e.dataTransfer.setData(mimeType, uniqId);
      setHover(true);
    }),
  );

  const onDragLeave = useCallback(
    muteEvent(() => {
      if (disabled) return;
      setHover(false);
    }),
  );

  const onLoad = useCallback(
    muteEvent(e => {
      if (disabled) return;
      onChange(Array.from(e.target.files));
    }),
  );

  const onDrop = useCallback(
    muteEvent(e => {
      if (disabled) return;

      const exprs = mimeType
        .split(',')
        .map(expr => expr.replace('*', '.*'))
        .map(expr => new RegExp(expr));

      const files = Array.from(e.dataTransfer.files)
        .filter(file => exprs.some(expr => expr.test(file.type)))
        .slice(0, multiple ? undefined : 1);

      if (files.length) onChange(files);
      setHover(false);
    }),
  );

  return (
    <FileLoaderContainer
      id={uniqId}
      className={cx(className, { hover, disabled })}
      onDragEnter={onDragEnter}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <FileInput onChange={onLoad} accept={mimeType} multiple={multiple} disabled={disabled} />
      {children}
    </FileLoaderContainer>
  );
};

FileLoader.propTypes = {
  className: PropTypes.string,
  mimeType: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

FileLoader.defaultProps = {
  className: '',
  mimeType: '*/*',
  multiple: false,
  disabled: false,
  onChange: () => {},
  children: [],
};

export default FileLoader;
