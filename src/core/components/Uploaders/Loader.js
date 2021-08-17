import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cx from 'classnames';

// equals to 1 GB
const MAX_FILE_SIZE = 1073741824;

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
  'data-qa-anchor': dataQaAnchor,
  mimeType,
  multiple,
  disabled,
  onChange,
  onMaxFilesLimit,
  onFileSizeLimit,
  fileLimitRemaining,
  children,
}) => {
  const [uniqId] = useState(`_${(Date.now() * Math.random()).toString(36)}`);
  const [hover, setHover] = useState(false);

  const getLimitFiles = targetFiles => targetFiles.slice(0, multiple ? fileLimitRemaining : 1);

  const checkFileSizeLimit = targetFiles => targetFiles.some(file => file.size > MAX_FILE_SIZE);
  const checkFilesLimit = targetFiles => fileLimitRemaining < targetFiles.length;

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
      const isFileSizeLimitReached = checkFileSizeLimit(targetFiles);
      const isFilesLimitReached = checkFilesLimit(targetFiles);
      const limitFiles = getLimitFiles(targetFiles);

      if (isFileSizeLimitReached) {
        e.target.value = null;
        onFileSizeLimit();
      } else if (limitFiles.length) {
        onChange(limitFiles);
      }

      // Attempted to upload more files than allowed meaning some have been removed.
      if (isFilesLimitReached) {
        onMaxFilesLimit();
      }
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
      data-qa-anchor={dataQaAnchor}
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
  'data-qa-anchor': PropTypes.string,
  mimeType: PropTypes.string,
  multiple: PropTypes.bool,
  disabled: PropTypes.bool,
  fileLimitRemaining: PropTypes.number,
  onMaxFilesLimit: PropTypes.func,
  onFileSizeLimit: PropTypes.func,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

FileLoader.defaultProps = {
  className: '',
  'data-qa-anchor': '',
  mimeType: '*/*',
  multiple: false,
  disabled: false,
  fileLimitRemaining: null,
  onMaxFilesLimit: () => {},
  onFileSizeLimit: () => {},
  onChange: () => {},
  children: [],
};

export default FileLoader;
