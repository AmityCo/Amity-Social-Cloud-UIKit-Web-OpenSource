import React, { useState, useEffect } from 'react';
import filesize from 'filesize';

import customizableComponent from '~/core/hocs/customization';
import ConditionalRender from '~/core/components/ConditionalRender';
import { FileIcon, FileName, FileSize, RemoveIcon } from '../Uploaders/File/styles';
import { FileContainer, Content } from './styles';
import ProgressBar from '~/core/components/ProgressBar';

const File = ({ file, onRemove }) => {
  const { isNew, name, type } = file;
  const [progress, setProgress] = useState(isNew ? file.progress : 100);

  useEffect(() => {
    if (!isNew || progress >= 100) {
      return;
    }
    const timeout = setTimeout(() => {
      setProgress(file.progress);
    }, 150);
    return () => clearTimeout(timeout);
  }, [progress, file, isNew]);

  return (
    <FileContainer>
      <ConditionalRender condition={isNew}>
        <ProgressBar progress={progress} />
      </ConditionalRender>
      <Content>
        <FileIcon file={{ name, type }} width={null} height="100%" />
        <FileName>{file.name}</FileName> <FileSize>{filesize(file.size)}</FileSize>
        <ConditionalRender condition={onRemove}>
          <RemoveIcon onClick={() => onRemove(file)} />
        </ConditionalRender>
      </Content>
    </FileContainer>
  );
};

export default customizableComponent('File', File);
