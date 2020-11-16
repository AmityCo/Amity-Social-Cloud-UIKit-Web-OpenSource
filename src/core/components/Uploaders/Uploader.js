import { useEffect, cloneElement } from 'react';
import PropTypes from 'prop-types';

import useFileUpload from '~/core/hooks/useFileUpload';

const FileUploader = ({ files, onChange, onLoadingChange, children }) => {
  const { uploading, uploaded, progress, addFiles, removeFile } = useFileUpload(
    onChange,
    onLoadingChange,
  );

  useEffect(() => {
    files && addFiles(files);
  }, [files]);

  if (!files?.length || (!uploading.length && !uploaded.length)) return null;

  return cloneElement(children, {
    uploading,
    uploaded,
    progress,
    removeFile,
  });
};

FileUploader.propTypes = {
  files: PropTypes.array,
  onChange: PropTypes.func,
  onLoadingChange: PropTypes.func,
  children: PropTypes.node,
};

FileUploader.defaultProps = {
  files: [],
  onChange: () => {},
  onLoadingChange: () => {},
  children: null,
};

export default FileUploader;
