import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import cx from 'classnames';

// equals to 1 GB
const MAX_FILE_SIZE = 1073741824;
const MIN_FILES_LIMIT = 1;

export const FileLoaderContainer = styled.label`
  cursor: pointer;
  background: rgb(235 236 239 / 60%);
  transition: background 0.1s;
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover,
  &:focus,
  &:active {
    background: rgb(235 236 239);
  }

  &.disabled {
    cursor: not-allowed;
  }

  > svg {
    height: 1.125rem;
    width: 1.125rem;
    font-size: 1.125rem;
  }
`;

const FileInput = styled.input.attrs({ type: 'file' })`
  &&& {
    display: none;
  }
`;

const FileLoader = ({
  className,
  'data-qa-anchor': dataQaAnchor = '',
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

  const getLimitFiles = useCallback(
    (targetFiles) => targetFiles.slice(0, multiple ? fileLimitRemaining : MIN_FILES_LIMIT),
    [fileLimitRemaining, multiple],
  );

  const checkFileSizeLimit = (targetFiles) => targetFiles.some((file) => file.size > MAX_FILE_SIZE);
  const checkFilesLimit = useCallback(
    (targetFiles) => fileLimitRemaining < targetFiles.length,
    [fileLimitRemaining],
  );

  const onDragEnter = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;

      e.dataTransfer.setData(mimeType, uniqId);
      setHover(true);
    },
    [disabled, mimeType, uniqId],
  );

  const onDragLeave = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      if (disabled) return;
      setHover(false);
    },
    [disabled],
  );

  const onLoad = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
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
    },
    [checkFilesLimit, disabled, getLimitFiles, onChange, onFileSizeLimit, onMaxFilesLimit],
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (disabled) return;

      const exprs = mimeType
        .split(',')
        .map((expr) => expr.replace('*', '.*'))
        .map((expr) => new RegExp(expr));

      const allowedFiles = Array.from(e.dataTransfer.files).filter((file) =>
        exprs.some((expr) => expr.test(file.type)),
      );

      const limitFiles = getLimitFiles(allowedFiles);

      if (limitFiles.length) onChange(limitFiles);
      setHover(false);
    },
    [disabled, getLimitFiles, mimeType, onChange],
  );

  const onClick = (e) => {
    e.target.value = null;
  };

  return (
    <FileLoaderContainer
      data-qa-anchor={`${dataQaAnchor}`}
      id={uniqId}
      className={cx(className, { hover, disabled })}
      onDragEnter={onDragEnter}
      onDragOver={onDragEnter}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <FileInput
        accept={mimeType}
        multiple={multiple}
        disabled={disabled}
        onChange={onLoad}
        onClick={onClick}
      />
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
  children: PropTypes.node,
  onMaxFilesLimit: PropTypes.func,
  onFileSizeLimit: PropTypes.func,
  onChange: PropTypes.func,
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
