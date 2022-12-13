import React from 'react';
import PropTypes from 'prop-types';
import { FileRepository, ImageSize } from '@amityco/js-sdk';

import useFile from '~/core/hooks/useFile';

import StyledFile from './styles';

const File = ({ 'data-qa-anchor': dataQaAnchor = '', fileId, onRemove }) => {
  const file = useFile(fileId);

  if (!file.fileId) return null;

  const fileUrl = FileRepository.getFileUrlById({
    fileId: file.fileId,
    imageSize: ImageSize.Small,
  });

  return (
    <StyledFile
      data-qa-anchor={dataQaAnchor}
      name={file.attributes.name}
      size={file.attributes.size}
      type={file.attributes.mimeType}
      url={fileUrl}
      onRemove={onRemove}
    />
  );
};

File.propTypes = {
  'data-qa-anchor': PropTypes.string,
  fileId: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
};

File.defaultProps = {
  'data-qa-anchor': '',
  onRemove: undefined,
};

export default File;
