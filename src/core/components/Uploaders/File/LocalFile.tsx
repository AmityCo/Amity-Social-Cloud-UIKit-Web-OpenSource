import React from 'react';

import StyledFile from './StyledFile';

interface LocalFileProps {
  'data-qa-anchor'?: string;
  file?: File;
  progress?: number;
  onRemove?: () => void;
  isRejected?: boolean;
  retry?: () => void;
}

const LocalFile = ({
  'data-qa-anchor': dataQaAnchor = '',
  file,
  progress = -1,
  onRemove,
  isRejected,
  retry = () => {},
}: LocalFileProps) => {
  if (file == null) return null;

  const fileUrl = file.type.includes('image') ? URL.createObjectURL(file) : undefined;

  return (
    <StyledFile
      data-qa-anchor={dataQaAnchor}
      name={file.name}
      size={file.size}
      type={file.type}
      url={fileUrl}
      progress={progress}
      isRejected={isRejected}
      onRemove={onRemove}
      onRetry={() => retry()}
    />
  );
};

export default LocalFile;
