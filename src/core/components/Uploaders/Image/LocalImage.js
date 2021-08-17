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
      onRemove={onRemove}
      isRejected={isRejected}
      onRetry={() => retry()}
      overlayElements={overlayElements}
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
  onRemove: PropTypes.func,
  isRejected: PropTypes.bool,
  retry: PropTypes.func,
  overlayElements: PropTypes.node,
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
