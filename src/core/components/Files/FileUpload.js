import React from 'react';
import { FileRepository } from '@amityco/js-sdk';

import { FileUploadContainer, FileInput, FileIcon, Label } from './styles';

export const FileUpload = ({ disabled, addFiles, setProgress, updateFiles }) => {
  const upload = async event => {
    const uploadingFiles = [...event.target.files];
    const filesToUpload = uploadingFiles.map(file => {
      const { name, type, size } = file;
      return {
        name,
        progress: 0,
        size,
        type,
      };
    });

    addFiles(filesToUpload);

    const files = await FileRepository.uploadFiles({
      files: uploadingFiles,
      onProgress: async ({ currentFile, currentPercent }) => {
        const { name } = currentFile;
        setProgress({
          name,
          progress: Math.round(currentPercent * 100),
        });
      },
    });

    updateFiles(files.map(({ fileId }) => fileId));
  };

  return (
    <FileUploadContainer>
      <Label htmlFor="file-upload" disabled={disabled}>
        <FileIcon disabled={disabled} />
      </Label>
      <FileInput id="file-upload" onChange={upload} multiple disabled={disabled} />
    </FileUploadContainer>
  );
};
