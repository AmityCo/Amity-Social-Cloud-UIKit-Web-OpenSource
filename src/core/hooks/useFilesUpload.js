import { useState } from 'react';

const useFilesUpload = (initialFiles) => {
  const [files, setFiles] = useState(Array.isArray(initialFiles) ? initialFiles : []);

  const addFiles = (filesToAdd) => {
    const newFiles = filesToAdd.map((file) => ({ ...file, isNew: true }));
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const updateFiles = (fileIds) => {
    setFiles((prevFiles) =>
      prevFiles.map((file, index) => {
        return { ...file, isNew: false, fileId: fileIds[index] };
      }),
    );
  };

  const setProgress = ({ name, progress }) => {
    setFiles((prevFiles) => {
      const index = prevFiles.findIndex((file) => file.name === name);
      return [
        ...prevFiles.slice(0, index),
        { ...prevFiles[index], progress },
        ...prevFiles.slice(index + 1),
      ];
    });
  };

  const removeFile = (image) => {
    setFiles((prevFiles) => {
      return prevFiles.filter(({ name }) => name !== image.name);
    });
  };

  const reset = () => setFiles([]);

  return {
    files,
    addFiles,
    updateFiles,
    setProgress,
    removeFile,
    reset,
  };
};

export default useFilesUpload;
