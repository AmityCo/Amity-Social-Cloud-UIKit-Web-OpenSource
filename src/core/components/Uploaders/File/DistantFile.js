import React from 'react';
import PropTypes from 'prop-types';
import { FileRepository, ImageSize } from '@amityco/js-sdk';

import useFile from '~/core/hooks/useFile';

import StyledFile from './styles';

const File = ({ fileId, onRemove }) => {
  const file = useFile(fileId);

  if (!file.fileId) return null;

  const fileUrl = FileRepository.getFileUrlById({
    fileId: file.fileId,
    imageSize: ImageSize.Small,
  });

  return (
    <StyledFile
      name={file.attributes.name}
      size={file.attributes.size}
      type={file.attributes.mimeType}
      url={fileUrl}
      onRemove={onRemove}
    />
  );
};

File.propTypes = {
  fileId: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
};

File.defaultProps = {
  onRemove: null,
};

export default File;
