import React from 'react';
import { FileRepository } from '@amityco/js-sdk';

import { ImageUploadContainer, FileInput, ImageIcon, Label } from './styles';

export const ImageUpload = ({ disabled, addImages, setProgress, updateImages }) => {
  const upload = async event => {
    const uploadingFiles = [...event.target.files];
    const imagesToUpload = uploadingFiles.map(image => {
      const imageUrl = URL.createObjectURL(image);
      return {
        name: image.name,
        progress: 0,
        url: imageUrl,
      };
    });

    addImages(imagesToUpload);

    const files = await FileRepository.uploadFiles({
      files: uploadingFiles,
      onProgress: ({ currentFile, currentPercent }) => {
        setProgress({
          name: currentFile.name,
          progress: Math.round(currentPercent * 100),
        });
      },
    });

    updateImages(files.map(({ fileId }) => fileId));
  };

  return (
    <ImageUploadContainer>
      <Label htmlFor="image-upload" disabled={disabled}>
        <ImageIcon disabled={disabled} />
      </Label>
      <FileInput id="image-upload" onChange={upload} multiple disabled={disabled} />
    </ImageUploadContainer>
  );
};
