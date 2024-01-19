import React from 'react';
import { FileRepository } from '@amityco/ts-sdk';

import { FileUploadContainer, FileInput, FileIcon, Label } from './styles';

interface FileUploadProps {
  disabled: boolean;
  addFiles: (files: Array<File & { progress: number }>) => void;
  setProgress: (progress: { name: string; progress: number }) => void;
  updateFiles: (fileIds: string[]) => void;
}

export const FileUpload = ({ disabled, addFiles, setProgress, updateFiles }: FileUploadProps) => {
  const upload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const uploadingFiles = event.target.files ? [...event.target.files] : [];
    const filesToUpload = uploadingFiles.map((file) => {
      return {
        ...file,
        progress: 0,
      };
    });

    addFiles(filesToUpload);

    const files = await Promise.all(
      uploadingFiles.map(async (file: File) => {
        const formData = new FormData();
        uploadingFiles.forEach((f) => formData.append('files[]', f));
        const response = await FileRepository.createFile(formData, (currentPercent) => {
          setProgress({
            name: file.name,
            progress: Math.round(currentPercent * 100),
          });
        });

        return response.data[0];
      }),
    );

    updateFiles(files.map(({ fileId }) => fileId));
  };

  return (
    <FileUploadContainer>
      <Label htmlFor="file-upload" disabled={disabled}>
        <FileIcon disabled={disabled} />
      </Label>
      <FileInput id="file-upload" multiple disabled={disabled} onChange={upload} />
    </FileUploadContainer>
  );
};
