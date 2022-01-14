import React from 'react';
import PropTypes from 'prop-types';

import StyledImage from './styles';

const Image = ({
  className,
  'data-qa-anchor': dataQaAnchor,
  file,
  progress,
  mediaFit,
  noBorder,
  onRemove,
  isRejected,
  retry = () => {},
  overlayElements,
} = {}) => {
  const fileUrl = URL.createObjectURL(file);

  return (
    <StyledImage
      className={className}
      data-qa-anchor={dataQaAnchor}
      url={fileUrl}
      progress={progress}
      mediaFit={mediaFit}
      noBorder={noBorder}
      isRejected={isRejected}
      overlayElements={overlayElements}
      onRemove={onRemove}
      onRetry={() => retry()}
    />
  );
};

Image.propTypes = {
  className: PropTypes.string,
  'data-qa-anchor': PropTypes.string,
  file: PropTypes.instanceOf(File).isRequired,
  progress: PropTypes.number,
  noBorder: PropTypes.bool,
  mediaFit: PropTypes.oneOf(['cover', 'contain']),
  isRejected: PropTypes.bool,
  retry: PropTypes.func,
  overlayElements: PropTypes.node,
  onRemove: PropTypes.func,
};

Image.defaultProps = {
  className: undefined,
  'data-qa-anchor': undefined,
  progress: -1,
  onRemove: null,
  isRejected: false,
  retry: () => {},
  overlayElements: undefined,
};

export default Image;
