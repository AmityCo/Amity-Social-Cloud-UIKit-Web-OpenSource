import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { FileRepository } from 'eko-sdk';
import useFile from '~/core/hooks/useFile';

import StyledFile from './styles';

const File = ({ fileId, onRemove = () => {} } = {}) => {
  const file = useFile(fileId);

  const removeCallback = useCallback(() => onRemove(fileId), [onRemove]);

  if (!file.fileId) return null;

  const fileUrl = FileRepository.getFileUrlById({ fileId: file.fileId });

  return (
    <StyledFile
      name={file.attributes.name}
      size={file.attributes.size}
      type={file.attributes.mimeType}
      url={fileUrl}
      onRemove={removeCallback}
    />
  );
};

File.propTypes = {
  fileId: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
};

File.defaultProps = {
  onRemove: () => {},
};

export default File;
