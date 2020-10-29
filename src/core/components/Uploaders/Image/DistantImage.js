import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { FileRepository, EkoImageSize } from 'eko-sdk';
import useFile from '~/core/hooks/useFile';

import StyledImage from './styles';

const Image = ({ fileId, onRemove = () => {}, fullSize } = {}) => {
  const file = useFile(fileId);

  const removeCallback = useCallback(() => onRemove(fileId), [onRemove]);

  if (!file.fileId) return null;

  const fileUrl = FileRepository.getFileUrlById({
    fileId: file.fileId,
    imageSize: EkoImageSize.Large,
  });

  return <StyledImage url={fileUrl} onRemove={removeCallback} fullSize={fullSize} />;
};

Image.propTypes = {
  fileId: PropTypes.string.isRequired,
  onRemove: PropTypes.func,
  fullSize: PropTypes.bool,
};

Image.defaultProps = {
  onRemove: () => {},
};

export default Image;
