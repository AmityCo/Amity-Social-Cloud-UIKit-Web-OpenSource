import React from 'react';
import styled from 'styled-components';

import File from '~/core/components/Uploaders/File';
import useFileUpload from '~/core/hooks/useFileUpload';
import { useShallowCompareEffect } from 'react-use';

const StylesFileRows = styled.div<{ uploadLoading?: boolean }>`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0.5em;
  min-height: 1em;
  margin-bottom: 1rem;
  ${({ uploadLoading }) => uploadLoading && `cursor: wait !important;`}
`;

interface FileRowsProps {
  uploading: File[];
  uploaded: Amity.File[];
  progress: { [key: string]: number };
  rejected: string[];
  uploadLoading: boolean;
  removeFile: (file: File | Amity.File) => void;
  retry: (file: File) => void;
  rowDataQaAnchor?: string;
}

const FileRows = ({
  uploading,
  uploaded,
  progress,
  removeFile,
  uploadLoading,
  rejected,
  retry,
  rowDataQaAnchor,
}: FileRowsProps) => (
  <StylesFileRows uploadLoading={uploadLoading}>
    {uploaded.map((file) => (
      <File
        key={file.fileId}
        data-qa-anchor={rowDataQaAnchor}
        fileId={file.fileId}
        onRemove={() => removeFile(file)}
      />
    ))}

    {uploading.map((file) => (
      <File
        key={file.name}
        data-qa-anchor={rowDataQaAnchor}
        file={file}
        progress={progress[file.name]}
        isRejected={rejected.includes(file.name)}
        onRemove={() => removeFile(file)}
      />
    ))}
  </StylesFileRows>
);

interface FilesProps {
  files: File[];
  uploadedFiles: Amity.File[];
  onChange: (data: { uploaded: Array<Amity.File>; uploading: Array<File> }) => void;
  onLoadingChange: (loading: boolean) => void;
  uploadLoading: boolean;
  onError: (error: string) => void;
  rowDataQaAnchor?: string;
}

const Files = ({
  files,
  uploadedFiles,
  onChange,
  onLoadingChange,
  uploadLoading,
  onError,
  rowDataQaAnchor = 'post-creator-uploaded-file',
}: FilesProps) => {
  const useFileUploadProps = useFileUpload({
    files,
    uploadedFiles,
    onChange,
    onLoadingChange,
    onError,
  });

  const { allFiles } = useFileUploadProps;

  if (allFiles.length === 0) return null;

  return (
    <FileRows
      {...useFileUploadProps}
      uploadLoading={uploadLoading}
      rowDataQaAnchor={rowDataQaAnchor}
    />
  );
};

export default Files;
