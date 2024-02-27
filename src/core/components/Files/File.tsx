import React, { useState, useEffect } from 'react';
import filesize from 'filesize';

import { FileIcon, FileName, FileSize, RemoveIcon } from '../Uploaders/File/styles';
import { FileContainer, Content } from './styles';
import ProgressBar from '~/core/components/ProgressBar';
import { useCustomComponent } from '~/core/providers/CustomComponentsProvider';

interface FileProps {
  file: File & {
    isNew?: boolean;
    progress?: number;
  };
  onRemove?: (file: File) => void;
}

const FileComponent = ({ file, onRemove }: FileProps) => {
  const { isNew, name, type } = file;
  const [progress, setProgress] = useState(isNew ? file.progress || 0 : 100);

  useEffect(() => {
    if (!isNew || progress >= 100) {
      return;
    }
    const timeout = setTimeout(() => {
      setProgress(file.progress || 0);
    }, 150);
    return () => clearTimeout(timeout);
  }, [progress, file, isNew]);

  return (
    <FileContainer>
      {isNew && <ProgressBar progress={progress} />}

      <Content>
        <FileIcon file={{ name, type }} width={null} height="100%" />
        <FileName>{file.name}</FileName> <FileSize>{filesize(file.size, { base: 2 })}</FileSize>
        {onRemove && <RemoveIcon onClick={() => onRemove(file)} />}
      </Content>
    </FileContainer>
  );
};

export default (props: FileProps) => {
  const CustomComponentFn = useCustomComponent<FileProps>('File');

  if (CustomComponentFn) return CustomComponentFn(props);

  return <FileComponent {...props} />;
};
