import React, { useState, useEffect } from 'react';
import filesize from 'filesize';
import { customizableComponent } from 'hocs/customization';

import FileIcon from './FileIcon';

import { FileContainer, Content, FileName, FileSize, ProgressBar, RemoveIcon } from './styles';

const File = ({ editing, file, onRemove }) => {
  // simulate progress animation
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    if (!editing || progress >= 100) return;
    const timeout = setTimeout(() => {
      setProgress(progress + 0.5);
    }, 50);
    return () => clearTimeout(timeout);
  }, [progress]);

  return (
    <FileContainer>
      <ProgressBar progress={progress} />
      <Content>
        <FileIcon file={file} />
        <FileName>{file.filename}</FileName> <FileSize>{filesize(file.size)}</FileSize>
        {!!onRemove && <RemoveIcon onClick={() => onRemove(file)} />}
      </Content>
    </FileContainer>
  );
};

export default customizableComponent('File')(File);
