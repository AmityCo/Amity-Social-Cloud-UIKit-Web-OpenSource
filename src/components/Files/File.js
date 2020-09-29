import React, { useState, useEffect } from 'react';
import filesize from 'filesize';
import { customizableComponent } from 'hocs/customization';

import FileIcon from './FileIcon';

import { FileContainer, Content, FileName, FileSize, RemoveIcon } from './styles';
import { ProgressBar } from '../ProgressBar';

const File = ({ file, onRemove, setFileLoaded }) => {
  // simulate progress animation
  const { isNew } = file;
  const [progress, setProgress] = useState(isNew ? 0 : 100);

  useEffect(() => {
    if (!isNew || progress >= 100) {
      isNew && setFileLoaded && setFileLoaded(file);
      return;
    }
    const timeout = setTimeout(() => {
      setProgress(progress + 0.5);
    }, 50);
    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <FileContainer>
      {isNew && <ProgressBar progress={progress} />}
      <Content>
        <FileIcon file={file} />
        <FileName>{file.filename}</FileName> <FileSize>{filesize(file.size)}</FileSize>
        {!!onRemove && <RemoveIcon onClick={() => onRemove(file)} />}
      </Content>
    </FileContainer>
  );
};

export default customizableComponent('File', File);
