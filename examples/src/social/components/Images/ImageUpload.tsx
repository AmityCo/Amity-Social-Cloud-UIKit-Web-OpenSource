import React from 'react';
import { FileRepository } from '@amityco/ts-sdk';

import { ImageUploadContainer, FileInput, ImageIcon, Label } from './styles';

interface ImageUploadProps {
  disabled: boolean;
  addImages: (images: { name: string; progress: number; url: string }[]) => void;
  setProgress: (progress: { name: string; progress: number }) => void;
  updateImages: (images: string[]) => void;
}

export const ImageUpload = ({
  disabled,
  addImages,
  setProgress,
  updateImages,
}: ImageUploadProps) => {
  const upload: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const uploadingFiles = event.target.files ? [...event.target.files] : [];
    const imagesToUpload = uploadingFiles.map((image) => {
      const imageUrl = URL.createObjectURL(image);
      return {
        name: image.name,
        progress: 0,
        url: imageUrl,
      };
    });

    addImages(imagesToUpload);

    const files = await Promise.all(
      uploadingFiles.map((file) => {
        const formData = new FormData();
        formData.append('file', file);
        return FileRepository.uploadFile(formData, (percent) => {
          setProgress({
            name: file.name,
            progress: Math.round(percent * 100),
          });
        });
      }),
    );

    updateImages(files.flatMap((file) => file.data.map((f) => f.fileId)));
  };

  return (
    <ImageUploadContainer>
      <Label htmlFor="image-upload" disabled={disabled}>
        <ImageIcon disabled={disabled} />
      </Label>
      <FileInput id="image-upload" multiple disabled={disabled} onChange={upload} />
    </ImageUploadContainer>
  );
};
