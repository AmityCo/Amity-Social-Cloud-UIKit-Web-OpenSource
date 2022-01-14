import React from 'react';
import PropTypes from 'prop-types';

import { FileRepository, ImageSize } from '@amityco/js-sdk';
import useFile from '~/core/hooks/useFile';

import StyledImage from './styles';

const Image = ({
  className,
  'data-qa-anchor': dataQaAnchor,
  fileId,
  loading,
  mediaFit,
  noBorder,
  onRemove,
  overlayElements,
} = {}) => {
  const file = useFile(fileId);

  if (!loading && !file.fileId) return null;

  // TODO: this is temporary - we should use file.fileUrl when supported.
  const fileUrl =
    file.fileId &&
    FileRepository.getFileUrlById({
      fileId: file.fileId,
      imageSize: ImageSize.Medium,
    });

  return (
    <StyledImage
      className={className}
      data-qa-anchor={dataQaAnchor}
      url={fileUrl}
      mediaFit={mediaFit}
      noBorder={noBorder}
      overlayElements={overlayElements}
      onRemove={onRemove}
    />
  );
};

Image.propTypes = {
  className: PropTypes.string,
  'data-qa-anchor': PropTypes.string,
  fileId: PropTypes.string.isRequired,
  loading: PropTypes.bool,
  mediaFit: PropTypes.oneOf(['cover', 'contain']),
  noBorder: PropTypes.bool,
  overlayElements: PropTypes.node,
  onRemove: PropTypes.func,
};

Image.defaultProps = {
  className: undefined,
  'data-qa-anchor': undefined,
  loading: false,
  onRemove: () => {},
  overlayElements: undefined,
};

export default Image;
