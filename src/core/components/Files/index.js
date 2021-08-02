import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import ConditionalRender from '~/core/components/ConditionalRender';
import File from './File';

import { FilesContainer, ViewAllFilesButton } from './styles';

const MAX_VISIBLE_FILES = 5;

export const Files = ({ files, onRemove }) => {
  const [isOpen, setIsOpen] = useState(false);
  const open = () => setIsOpen(true);

  const visibleFiles = isOpen ? files : files.slice(0, MAX_VISIBLE_FILES);

  const haveHiddenFiles = visibleFiles.length < files.length;

  if (files.length === 0) return null;

  return (
    <ConditionalRender condition={files.length}>
      <FilesContainer>
        {visibleFiles.map(file => (
          <File key={file.id} file={file} onRemove={onRemove} />
        ))}
        {haveHiddenFiles && (
          <ViewAllFilesButton onClick={open}>
            <FormattedMessage id="files.all" />
          </ViewAllFilesButton>
        )}
      </FilesContainer>
    </ConditionalRender>
  );
};
