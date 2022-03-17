import React from 'react';
import PropTypes from 'prop-types';
import Image from '~/core/components/Uploaders/Image';

const ImageContent = ({ fileId }) => <Image fileId={fileId} />;

ImageContent.propTypes = {
  fileId: PropTypes.string.isRequired,
};

export default ImageContent;
