import React, { useState, useEffect } from 'react';

import { customizableComponent } from '../hoks/customization';

import File from './File';

import { FilesContainer } from './styles';

const Files = ({ files = [], onRemove }) => (
  <FilesContainer>
    {files.map((file, i) => (
      <File key={file.id} file={file} onRemove={onRemove} />
    ))}
  </FilesContainer>
);

export default customizableComponent('Files')(Files);
