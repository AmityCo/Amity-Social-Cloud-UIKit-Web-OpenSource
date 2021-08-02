import React from 'react';
import PropTypes from 'prop-types';

import { FileRepository, ImageSize } from '@amityco/js-sdk';
import useFile from '~/core/hooks/useFile';

import StyledImage from './styles';

const Image = ({ className, fileId, mediaFit, noBorder, onRemove, overlayElements } = {}) => {
  const file = useFile(fileId);

  if (!file.fileId) return null;

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl = FileRepository.getFileUrlById({
    fileId: file.fileId,
    imageSize: ImageSize.Medium,
  });

  return (
    <StyledImage
      className={className}
      url={fileUrl}
      mediaFit={mediaFit}
      noBorder={noBorder}
      onRemove={onRemove}
      overlayElements={overlayElements}
    />
  );
};

Image.propTypes = {
  className: PropTypes.string,
  fileId: PropTypes.string.isRequired,
  mediaFit: PropTypes.oneOf(['cover', 'contain']),
  noBorder: PropTypes.bool,
  onRemove: PropTypes.func,
  overlayElements: PropTypes.node,
};

Image.defaultProps = {
  className: undefined,
  onRemove: () => {},
  overlayElements: undefined,
};

export default Image;
