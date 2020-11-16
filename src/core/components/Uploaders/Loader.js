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
  &&& {
    display: none;
  }
`;

const muteEvent = fn => e => {
  e.preventDefault();
  e.stopPropagation();
  return fn(e);
};

const FileLoader = ({
  className,
  mimeType,
  multiple,
  disabled,
  onChange,
  onMaxFilesLimit,
  fileLimitRemaining,
  children,
}) => {
  const [uniqId] = useState(`_${(Date.now() * Math.random()).toString(36)}`);
  const [hover, setHover] = useState(false);

  const getLimitFiles = targetFiles => {
    const limitFiles = targetFiles.slice(0, multiple ? fileLimitRemaining : 1);

    // Attempted to upload more files than allowed meaning some have been removed.
    if (limitFiles.length < targetFiles.length) {
      onMaxFilesLimit();
    }

    return limitFiles;
  };

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
      const targetFiles = Array.from(e.target.files);
      const limitFiles = getLimitFiles(targetFiles);
      limitFiles.length && onChange(limitFiles);
    }),
  );

  const onDrop = useCallback(
    muteEvent(e => {
      if (disabled) return;

      const exprs = mimeType
        .split(',')
        .map(expr => expr.replace('*', '.*'))
        .map(expr => new RegExp(expr));

      const allowedFiles = Array.from(e.dataTransfer.files).filter(file =>
        exprs.some(expr => expr.test(file.type)),
      );

      const limitFiles = getLimitFiles(allowedFiles);

      if (limitFiles.length) onChange(limitFiles);
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
  fileLimitRemaining: PropTypes.number,
  onMaxFilesLimit: PropTypes.func,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

FileLoader.defaultProps = {
  className: '',
  mimeType: '*/*',
  multiple: false,
  disabled: false,
  fileLimitRemaining: null,
  onMaxFilesLimit: () => {},
  onChange: () => {},
  children: [],
};

export default FileLoader;
