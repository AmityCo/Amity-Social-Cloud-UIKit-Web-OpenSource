import React, { useState } from 'react';

import { customizableComponent } from '~/core/hocs/customization';

import File from './File';

import { FilesContainer, ViewAllFilesButton } from './styles';

const MAX_VISIBLE_FILES = 5;

const Files = ({ files = [], onRemove, setFileLoaded }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  const visibleFiles = isOpen ? files : files.slice(0, MAX_VISIBLE_FILES);

  const haveHiddenFiles = visibleFiles.length < files.length;

  if (files.length === 0) return null;

  return (
    <FilesContainer>
      {visibleFiles.map(file => (
        <File key={file.id} file={file} onRemove={onRemove} setFileLoaded={setFileLoaded} />
      ))}
      {haveHiddenFiles && <ViewAllFilesButton onClick={open}>View all files</ViewAllFilesButton>}
    </FilesContainer>
  );
};

export default customizableComponent('Files', Files);
