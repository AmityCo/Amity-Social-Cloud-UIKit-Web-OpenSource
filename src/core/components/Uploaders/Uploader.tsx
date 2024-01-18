import { useShallowCompareEffect } from 'react-use';

import { useState, useCallback, useEffect, useRef } from 'react';
import { FileRepository, FileType } from '@amityco/ts-sdk';
import { isNonNullable } from '~/helpers/utils';

const MAX_PERCENT = 0.999;

export function isAmityFile(file: Amity.File | File): file is Amity.File {
  return (file as Amity.File).fileId !== undefined;
}

export const getUpdatedTime = (file: File | Amity.File) => {
  if (!isAmityFile(file)) return file.lastModified;
  return file.updatedAt ? new Date(file.updatedAt).getTime() : Date.now();
};

function useFileUpload({
  files,
  onChange = (remaining: Array<Amity.File | File>) => {},
  onLoadingChange = (loading: boolean) => {},
  onError = (errorMessage: string) => {},
}: {
  files?: Iterable<File> | Array<File>;
  onChange?: (remaining: Array<Amity.File | File>) => void;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (errorMessage: string) => void;
}) {
  const [uploading, setUploading] = useState<File[]>([]); // local File objects
  const [uploaded, setUploaded] = useState<Amity.File[]>([]); // SDK File models
  const [progress, setProgress] = useState({}); // individual progress

  const [rejected, setRejected] = useState<string[]>([]); // filenames that has loading error

  useEffect(() => {
    if (!files) return;
    addFiles(files);
  }, [files]);

  // browser loading callback from FileLoader
  const addFiles = useCallback((inputFiles: Iterable<File> | Array<File>) => {
    const fileList = Array.isArray(inputFiles) ? inputFiles : Array.from(inputFiles);
    setUploading(fileList);

    setProgress(
      fileList.reduce(
        (acc, file) => ({
          ...acc,
          [file.name]: 0,
        }),
        {},
      ),
    );
  }, []);

  // async update of indivisual upload progress
  const onProgress = useCallback((currentFile: { name: string }, currentPercent: number) => {
    const value = currentPercent <= MAX_PERCENT ? currentPercent : 1;

    setProgress((prev) => ({
      ...prev,
      [currentFile.name]: value,
    }));
  }, []);

  const reset = useCallback(() => {
    setUploaded([]);
    onChange([]);
  }, [onChange]);

  const retry = useCallback(() => {
    // force to re-upload all files
    setUploading((prev) => [...prev]);
    setRejected([]);
  }, []);

  const removeFile = useCallback(
    (file: Amity.File | File) => {
      if (isAmityFile(file)) {
        const remaining = uploaded.filter((item) => item.fileId !== file.fileId);
        setUploaded(remaining);
        onChange(remaining);
      } else {
        const remaining = uploading.filter((item) => item.name !== file.name);
        setUploading(remaining);
        onChange(remaining);
      }
    },
    [onChange, uploaded, uploading],
  );

  // file upload function
  useEffect(() => {
    if (!uploading.length) return;

    async function run() {
      onLoadingChange(true);
      try {
        const updatedFiles = await Promise.all(
          uploading.map(async (file: File) => {
            const formData: FormData = new FormData();
            formData.append('files', file);
            const uploadedFile = await (async () => {
              if (file.type.includes(FileType.VIDEO)) {
                return FileRepository.createVideo(formData, undefined, (currentPercent) => {
                  onProgress(file, currentPercent);
                });
              } else if (file.type.includes(FileType.IMAGE)) {
                return FileRepository.createImage(formData, (currentPercent) => {
                  onProgress(file, currentPercent);
                });
              } else {
                return FileRepository.createFile(formData, (currentPercent) => {
                  onProgress(file, currentPercent);
                });
              }
            })();

            if (uploadedFile.data.length > 0) {
              return uploadedFile.data[0];
            }

            return null;
          }),
        );

        setUploading([]);
        setProgress({});

        const updated = [...uploaded, ...updatedFiles].filter(isNonNullable);
        setUploaded(updated);
        onChange(updated);
        setRejected([]);
      } catch (e) {
        setRejected(uploading.map((file) => file.name));
        onError('Something went wrong. Please try uploading again.');
      } finally {
        onLoadingChange(false);
      }
    }

    run();
  }, [uploading]);

  return {
    allFiles: [...uploaded, ...uploading],
    uploading,
    uploaded,
    progress,
    addFiles,
    removeFile,
    reset,
    rejected,
    retry,
  };
}

/**
 *
 * @deprecated use useFileUpload instead
 */
const FileUploader = ({ files, onChange, onError, onLoadingChange, children }: any) => {
  const { uploading, uploaded, progress, addFiles, removeFile, reset, rejected, retry } =
    useFileUpload({ onChange, onLoadingChange, onError });

  useShallowCompareEffect(() => {
    files && addFiles(files);
    !files.length && reset();
  }, [files]);

  if (!files?.length || (!uploading.length && !uploaded.length)) return null;

  return children?.({ uploading, uploaded, progress, removeFile, rejected, retry });
};

export default FileUploader;
