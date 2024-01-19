import React from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';

import File from '~/core/components/Uploaders/File';
import Collapsible from '~/core/components/Collapsible';

const List = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0.5rem;
`;

const ButtonLink = styled.button.attrs({ role: 'button' })`
  color: ${({ theme }) => theme.palette.highlight.main};
  font-size: 14px;
  border: none;
  outline: none;
  background: none;
  padding: 4px 0 4px 0px;
  text-align: left;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.palette.highlight.main};
  }
`;

const renderTrigger = (handleExpand?: React.MouseEventHandler<HTMLButtonElement>) => {
  return (
    <ButtonLink onClick={handleExpand}>
      <FormattedMessage id="collapsible.viewAllFiles" />
    </ButtonLink>
  );
};

interface FileListContentProps {
  items: Array<{
    data: {
      fileId: string;
    };
  }>;
}

const FileListContent = ({ items }: FileListContentProps) => {
  return (
    <List data-qa-anchor="post-file-list-content">
      <Collapsible
        items={items}
        renderTrigger={renderTrigger}
        renderItem={(item) => (
          <File key={item.data.fileId} item-qa-anchor="post-file-item" fileId={item.data.fileId} />
        )}
      />
    </List>
  );
};

export default FileListContent;
