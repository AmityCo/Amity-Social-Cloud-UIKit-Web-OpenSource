import React from 'react';
import PropTypes from 'prop-types';
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

const renderTrigger = handleExpand => {
  return (
    <ButtonLink onClick={handleExpand}>
      <FormattedMessage id="collapsible.viewAllFiles" />
    </ButtonLink>
  );
};

const FileListContent = ({ items }) => {
  return (
    <List>
      <Collapsible renderTrigger={renderTrigger}>
        {items.map(({ data }) => (
          <File key={data.fileId} fileId={data.fileId} />
        ))}
      </Collapsible>
    </List>
  );
};

FileListContent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FileListContent;
