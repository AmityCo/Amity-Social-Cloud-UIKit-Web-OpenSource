import React from 'react';
import styled from 'styled-components';
import File from '~/core/components/Uploaders/File';

const FilesContainer = styled.div`
  & > * {
    margin-bottom: 12px;
  }
`;

interface FileContentListProps {
  items: Amity.Post[];
  onRemove: (id: string) => void;
}

const FileContentList = ({ items, onRemove }: FileContentListProps) => (
  <FilesContainer>
    {items.map((post) => (
      <File key={post.postId} fileId={post?.data?.fileId} onRemove={() => onRemove(post.postId)} />
    ))}
  </FilesContainer>
);

export default FileContentList;
