import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';

import File from './File';

import { FilesContainer, ViewAllFilesButton } from './styles';

const MAX_VISIBLE_FILES = 5;

const Files = ({ editing, files = [], onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  const visibleFiles = editing || isOpen ? files : files.slice(0, MAX_VISIBLE_FILES);

  const haveHiddenFiles = visibleFiles.length < files.length;

  return (
    <FilesContainer>
      {visibleFiles.map((file, i) => (
        <File key={file.id} file={file} onRemove={onRemove} />
      ))}
      {haveHiddenFiles && <ViewAllFilesButton onClick={open}>View all files</ViewAllFilesButton>}
    </FilesContainer>
  );
};

export default customizableComponent('Files')(Files);
