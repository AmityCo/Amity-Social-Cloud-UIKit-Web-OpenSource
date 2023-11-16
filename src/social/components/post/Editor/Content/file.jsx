import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import File from '~/core/components/Uploaders/File';

const FilesContainer = styled.div`
  & > * {
    margin-bottom: 12px;
  }
`;

const FileContentList = ({ items, onRemove }) => (
  <FilesContainer>
    {items.map((post) => (
      <File key={post.postId} fileId={post?.data?.fileId} onRemove={() => onRemove(post.postId)} />
    ))}
  </FilesContainer>
);

FileContentList.propTypes = {
  items: PropTypes.array,
  onRemove: PropTypes.func,
};

FileContentList.defaultProps = {
  items: [],
  onRemove: () => {},
};

export default FileContentList;
