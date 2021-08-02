import { useState, useCallback, useEffect } from 'react';
import { FileRepository, FileType } from '@amityco/js-sdk';

export default (onChange = () => {}, onLoadingChange = () => {}, onError = () => {}) => {
  const [uploading, setUploading] = useState([]); // local File objects
  const [uploaded, setUploaded] = useState([]); // SDK File models
  const [progress, setProgress] = useState({}); // individual progress

  const [rejected, setRejected] = useState([]); // filenames that has loading error

  // browser loading callback from FileLoader
  const addFiles = useCallback(files => {
    setUploading(Array.from(files));

    setProgress(
      Array.from(files)
        .map(file => ({ [file.name]: 0 }))
        .reduce((obj, item) => ({ ...obj, ...item }), {}),
    );
  }, []);

  // async update of indivisual upload progress
  const onProgress = useCallback(
    (currentFile, currentPercent) => {
      const value = currentPercent <= 0.999 ? currentPercent : 1;

      setProgress(prev => ({
        ...prev,
        [currentFile.name]: value,
      }));
    },
    [progress],
  );

  const reset = useCallback(() => {
    setUploaded([]);
    onChange([]);
  }, []);

  const retry = useCallback(() => {
    // force to re-upload all files
    setUploading(prev => [...prev]);
    setRejected([]);
  }, [rejected]);

  const removeFile = useCallback(
    file => {
      if (file.fileId) {
        const without = uploaded.filter(item => item.fileId !== file.fileId);
        setUploaded(without);
        onChange(without);
      } else {
        const without = uploading.filter(item => item.name !== file.name);
        setUploading(without);
        onChange(without);
      }
    },
    [uploaded, uploading],
  );

  // file upload function
  useEffect(() => {
    if (!uploading.length) return;
    let cancel = false;

    (async () => {
      onLoadingChange(true);
      try {
        const models = await Promise.all(
          uploading.map(async file => {
            const uploader =
              file.forceType === FileType.Video
                ? FileRepository.createVideo
                : FileRepository.createFile;

            const liveObject = uploader({
              file,
              onProgress: ({ currentFile, currentPercent }) => {
                !cancel && onProgress(currentFile, currentPercent);
              },
            });

            await new Promise(resolve => liveObject.once('loadingStatusChanged', resolve));

            return liveObject.model;
          }),
        );

        // cancel xhr, the easy way
        if (cancel) {
          onLoadingChange(false);
          return;
        }

        setUploading([]);
        setProgress({});

        const updated = [...uploaded, ...models];
        setUploaded(updated);
        onChange(updated);
        onLoadingChange(false);
        setRejected([]);
      } catch (e) {
        setRejected(uploading.map(file => file.name));
        onLoadingChange(false);
        onError('Something went wrong. Please try uploading again.');
      }
    })();

    return () => {
      cancel = true;
    };
  }, [uploading]);

  return {
    uploading,
    uploaded,
    progress,
    addFiles,
    removeFile,
    reset,
    rejected,
    retry,
  };
};
