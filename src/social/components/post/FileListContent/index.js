import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import File from '~/core/components/Uploaders/File';

const List = styled.div`
  display: grid;
  grid-template-columns: 100%;
  grid-gap: 0.5rem;
`;

const FileListContent = ({ items }) => {
  return (
    <List>
      {items.map(({ data }) => (
        <File key={data.fileId} fileId={data.fileId} />
      ))}
    </List>
  );
};

FileListContent.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default FileListContent;
