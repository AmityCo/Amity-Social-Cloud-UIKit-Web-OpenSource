import { FileItem as TFileItem } from '~/v4/social/hooks/useFilePostUpload';

export const isImageFile = (file: TFileItem) => {
  if (isAmityFile(file.file)) {
    return (
      file.file.type === 'image' || (file.file.attributes?.mimeType || '').startsWith('image/')
    );
  } else if (file.file instanceof File) {
    return file.file.type.startsWith('image/');
  }
  return false;
};

export const isVideoFile = (file: TFileItem) => {
  if (isAmityFile(file.file)) {
    return (
      file.file.type === 'video' || (file.file.attributes?.mimeType || '').startsWith('video/')
    );
  } else if (file.file instanceof File) {
    return file.file.type.startsWith('video/');
  }
  return false;
};

export function isAmityFile(file: Amity.File | File): file is Amity.File {
  return (file as Amity.File).fileId !== undefined;
}
