import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
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

export default function useFileUpload({
  files = [],
  uploadedFiles = [],
  onChange = (data: { uploaded: Array<Amity.File>; uploading: Array<File> }) => {},
  onLoadingChange = (loading: boolean) => {},
  onError = (errorMessage: string) => {},
}: {
  files: Iterable<File> | Array<File>;
  uploadedFiles: Amity.File[];
  onChange?: (data: { uploaded: Array<Amity.File>; uploading: Array<File> }) => void;
  onLoadingChange?: (loading: boolean) => void;
  onError?: (errorMessage: string) => void;
}) {
  const [progress, setProgress] = useState({}); // individual progress

  const [rejected, setRejected] = useState<string[]>([]); // filenames that has loading error

  const fileList = useMemo(() => (Array.isArray(files) ? files : Array.from(files)), [files]);

  useEffect(() => {
    setProgress(
      fileList.reduce(
        (acc, file) => ({
          ...acc,
          [file.name]: 0,
        }),
        {},
      ),
    );
  }, [fileList]);

  // async update of indivisual upload progress
  const onProgress = useCallback((currentFile: { name: string }, currentPercent: number) => {
    const value = currentPercent <= MAX_PERCENT ? currentPercent : 1;

    setProgress((prev) => ({
      ...prev,
      [currentFile.name]: value,
    }));
  }, []);

  const reset = useCallback(() => {
    onChange({
      uploaded: [],
      uploading: [],
    });
  }, [onChange]);

  const retry = useCallback(() => {
    setRejected([]);
  }, []);

  const removeFile = useCallback(
    (file: Amity.File | File) => {
      if (isAmityFile(file)) {
        const remaining = uploadedFiles.filter((item) => item.fileId !== file.fileId);
        onChange({
          uploaded: remaining,
          uploading: fileList,
        });
      } else {
        const remaining = fileList.filter((item) => item.name !== file.name);
        onChange({
          uploaded: uploadedFiles,
          uploading: remaining,
        });
      }
    },
    [onChange],
  );

  // file upload function
  useEffect(() => {
    if (!fileList.length) return;

    async function run() {
      onLoadingChange(true);
      try {
        const updatedFiles = await Promise.all(
          fileList.map(async (file: File) => {
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

        setProgress({});

        const updated = [...uploadedFiles, ...updatedFiles].filter(isNonNullable);
        onChange({
          uploaded: updated,
          uploading: [],
        });
        setRejected([]);
      } catch (e) {
        setRejected(fileList.map((file) => file.name));
        onError('Something went wrong. Please try uploading again.');
      } finally {
        onLoadingChange(false);
      }
    }

    run();
  }, [fileList]);

  const allFiles = [...uploadedFiles, ...fileList];

  return {
    allFiles,
    uploading: fileList,
    uploaded: uploadedFiles,
    progress,
    removeFile,
    reset,
    rejected,
    retry,
  };
}
