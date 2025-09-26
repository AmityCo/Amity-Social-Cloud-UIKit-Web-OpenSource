import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import FileComponent from './File';
import { FilesContainer, ViewAllFilesButton } from './styles';

const MAX_VISIBLE_FILES = 5;

interface FilesProps {
  files: (File & {
    isNew?: boolean;
    progress?: number;
  })[];
  onRemove?: (file: File) => void;
}

export const Files = ({ files, onRemove }: FilesProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  const visibleFiles = isOpen ? files : files.slice(0, MAX_VISIBLE_FILES);

  const haveHiddenFiles = visibleFiles.length < files.length;

  if (files.length === 0) return null;

  return (
    <FilesContainer>
      {visibleFiles.map((file) => (
        <FileComponent key={file.name} file={file} onRemove={onRemove} />
      ))}
      {haveHiddenFiles && (
        <ViewAllFilesButton onClick={open}>
          <FormattedMessage id="files.all" />
        </ViewAllFilesButton>
      )}
    </FilesContainer>
  );
};
