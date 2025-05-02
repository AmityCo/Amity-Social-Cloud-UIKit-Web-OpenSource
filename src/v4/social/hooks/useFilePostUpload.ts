import { useState } from 'react';
import { FileRepository, FileType } from '@amityco/ts-sdk';
import { v4 as uuid } from 'uuid';
import { useConfirmContext } from '~/v4/core/providers/ConfirmProvider';
import { generateThumbnailVideo } from '~/v4/social/utils/generateThumbnailVideo';
import { isAmityFile } from '~/v4/utils/checkFileType';

export type FileItem<T extends Amity.FileType = any> = {
  id: string;
  file: File | Amity.File<T>;
  status: 'failed' | 'uploaded' | 'selected';
  errorText?: string;
  thumbnailVideo?: string;
};

const MAX_PERCENT = 100;
const MAX_FILE_SIZE = 1 * 1024 * 1024 * 1024; // 1GB in bytes

export const getUpdatedTime = (file: File | Amity.File) => {
  if (!isAmityFile(file)) return file.lastModified;
  return file.updatedAt ? new Date(file.updatedAt).getTime() : Date.now();
};

export function useFilePostUpload(pageId?: string) {
  const { info } = useConfirmContext();
  const [progress, setProgress] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const [videoThumbnail, setVideoThumbnail] = useState<
    { file: File; videoUrl: string; thumbnail: string | undefined }[]
  >([]);

  const onProgress = (currentFile: FileItem, currentPercent: number) => {
    const value = currentPercent < MAX_PERCENT ? currentPercent : 100;
    setProgress((prev) => ({ ...prev, [currentFile.id]: value }));
  };

  const removeFile = (file: Amity.File | File, index?: number) => {
    if (isAmityFile(file)) {
      const remainingFiles = files.filter(
        (item) => (item.file as Amity.File).fileId !== file.fileId,
      );
      setFiles(remainingFiles);
    } else if (index !== undefined) {
      const remainingFiles = files.filter((_, i) => i !== index);
      setFiles(remainingFiles);
    } else {
      const remainingFiles = files.filter((item) => (item.file as File).name !== file.name);
      setFiles(remainingFiles);
    }
  };

  const uploadFile = async (fileList: File[]) => {
    if (!fileList.length) return;

    const oversizedFiles = fileList.filter((file) => file.size > MAX_FILE_SIZE);
    const validFiles = fileList.filter((file) => file.size <= MAX_FILE_SIZE);

    const failedFiles = oversizedFiles.map<FileItem>((file) => ({
      file,
      id: uuid(),
      status: 'failed',
      errorText: 'File size exceeds 1GB.',
    }));

    if (failedFiles.length > 0) {
      setFiles((prev) => [...prev, ...failedFiles]);
    }

    if (validFiles.length === 0) return;

    // Process files and generate thumbnails for videos
    const processedFiles = await Promise.all(
      validFiles.map(async (file) => {
        const fileItem: FileItem = {
          file,
          id: uuid(),
          status: 'selected',
        };

        if (file.type.includes(FileType.VIDEO)) {
          const thumbnail = await generateThumbnailVideo(file);
          if (thumbnail) {
            fileItem.thumbnailVideo = thumbnail;
          }
        }

        return fileItem;
      }),
    );

    initializeUpload(processedFiles);

    try {
      await Promise.allSettled(processedFiles.map(uploadSingleFile));
      setProgress({});
    } catch (error) {
      console.error('error >>', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeUpload = (fileList: FileItem[]) => {
    setIsLoading(true);
    setFiles((files) => [...files, ...fileList]);
    setProgress(fileList.reduce((acc, item) => ({ ...acc, [item.id]: 0 }), {}));
  };

  const uploadSingleFile = async (item: FileItem) => {
    const formData = new FormData();
    formData.append('files', item.file as File);

    const uploadFunction = getUploadFunction(item.file.type);
    try {
      const response = await uploadFunction(formData, (currentPercent: number) => {
        onProgress(item, currentPercent);
      });

      if (response?.data?.length > 0) {
        setFiles((files) =>
          files.map((file) => {
            if (file.id === item.id) {
              return { ...file, file: response.data[0], status: 'uploaded' };
            }
            return file;
          }),
        );
      }
    } catch (error) {
      setFiles((files) =>
        files.map((file) => {
          if (file.id === item.id) {
            return {
              ...file,
              status: 'failed',
              errorText: 'Failed to upload.',
            };
          }
          return file;
        }),
      );
    }
  };

  const getUploadFunction = (fileType: string) => {
    if (fileType.includes(FileType.VIDEO)) {
      return (formData: FormData, onProgress: (percent: number) => void) =>
        FileRepository.uploadVideo(formData, undefined, onProgress);
    }
    if (fileType.includes(FileType.IMAGE)) {
      return FileRepository.uploadImage;
    }
    return FileRepository.uploadFile;
  };

  const handleFileChange = (file: File[], fileType: string, localFile?: Amity.File[]) => {
    // localFile use for calculate remaining files
    // file use for calculate incoming files

    const filesAmount = localFile
      ? files.length > 0
        ? files?.length + file.length + localFile?.length
        : file?.length + localFile.length
      : file.length + files.length;

    let contentText = '';
    switch (fileType) {
      case FileType.IMAGE:
        contentText =
          'You’ve reached the upload limit of 10 images. Any additional images will not be saved. ';
        break;
      case FileType.FILE:
        contentText =
          'We’ve uploaded the first 10 files you selected. Any additional files have been discarded.';
        break;
      case FileType.VIDEO:
        contentText =
          'You’ve reached the upload limit of 10 videos. Any additional videos will not be saved. ';
        break;
    }
    if (filesAmount && filesAmount > 10) {
      info({
        pageId: pageId,
        type: 'info',
        title: 'Maximum upload limit reached',
        content: contentText,
        okText: 'OK',
      });
      return;
    }

    if (file.length > 0) {
      uploadFile(file);
    }
  };

  const handleAltTextChange = (file: Amity.File<'image'>, altText: string) => {
    setFiles((files) =>
      files.map((item) => {
        if (
          isAmityFile(item.file) &&
          item.file.type === 'image' &&
          item.file.fileId === file.fileId
        ) {
          return { ...item, file: { ...file, altText } };
        }
        return item;
      }),
    );
  };

  return {
    files,
    progress,
    isLoading,
    videoThumbnail,
    uploadFile,
    removeFile,
    handleFileChange,
    handleAltTextChange,
  };
}
