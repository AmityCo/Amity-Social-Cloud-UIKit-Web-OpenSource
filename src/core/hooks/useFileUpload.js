import { useState, useCallback, useEffect } from 'react';
import { FileRepository } from 'eko-sdk';

export default (onChange = () => {}, onLoadingChange = () => {}) => {
  const [uploading, setUploading] = useState([]); // local File objects
  const [uploaded, setUploaded] = useState([]); // SDK File models
  const [progress, setProgress] = useState({}); // individual progress

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

  const removeFile = useCallback(
    fileId => {
      const without = uploaded.filter(file => file.fileId !== fileId);
      setUploaded(without);
      onChange(without);
    },
    [uploaded],
  );

  // file upload function
  useEffect(() => {
    if (!uploading.length) return;
    let cancel = false;

    (async () => {
      onLoadingChange(true);
      const models = await FileRepository.uploadFiles({
        files: uploading,
        onProgress: ({ currentFile, currentPercent }) => {
          !cancel && onProgress(currentFile, currentPercent);
        },
      });

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
  };
};
