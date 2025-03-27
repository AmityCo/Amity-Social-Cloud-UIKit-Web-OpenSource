import React from 'react';
import { FileRepository } from '@amityco/ts-sdk';

import useFile from '~/core/hooks/useFile';

import StyledFile from './StyledFile';

interface DistantFileProps {
  'data-testid'?: string;
  fileId?: string;
  onRemove?: () => void;
}

const DistantFile = ({ 'data-testid': dataQaAnchor = '', fileId, onRemove }: DistantFileProps) => {
  const file = useFile(fileId);

  if (!file) return null;

  const fileUrl = FileRepository.fileUrlWithSize(file?.fileUrl, 'small');

  return (
    <StyledFile
      data-testid={dataQaAnchor}
      name={file.attributes.name}
      size={!isNaN(Number(file.attributes.size)) ? Number(file.attributes.size) : 0}
      type={file.attributes.mimeType}
      url={fileUrl}
      onRemove={onRemove}
    />
  );
};

export default DistantFile;
