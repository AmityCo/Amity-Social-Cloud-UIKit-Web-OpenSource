import React from 'react';
import PropTypes from 'prop-types';
import File from '~/core/components/Uploaders/File';

const FileContent = ({ fileId }) => <File fileId={fileId} />;

FileContent.propTypes = {
  fileId: PropTypes.string.isRequired,
};

export default FileContent;
