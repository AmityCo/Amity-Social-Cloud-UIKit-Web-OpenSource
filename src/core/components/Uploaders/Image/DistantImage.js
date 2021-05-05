import React from 'react';
import PropTypes from 'prop-types';

import { FileRepository, ImageSize } from '@amityco/js-sdk';
import useFile from '~/core/hooks/useFile';

import StyledImage from './styles';

const Image = ({ fileId, imageFit, noBorder, onRemove } = {}) => {
  const file = useFile(fileId);

  if (!file.fileId) return null;

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = FileRepository.getFileUrlById({
    fileId: file.fileId,
    imageSize: ImageSize.Medium,
  });

  return <StyledImage url={fileUrl} imageFit={imageFit} noBorder={noBorder} onRemove={onRemove} />;
};

Image.propTypes = {
  fileId: PropTypes.string.isRequired,
  imageFit: PropTypes.oneOf(['cover', 'contain']),
  noBorder: PropTypes.bool,
  onRemove: PropTypes.func,
};

Image.defaultProps = {
  onRemove: () => {},
};

export default Image;
