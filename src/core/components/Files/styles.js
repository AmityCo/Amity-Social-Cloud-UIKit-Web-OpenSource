import styled from 'styled-components';

import { SecondaryButton } from '~/core/components/Button';
import { FileAttachment, Remove } from '~/icons';

export const RemoveIcon = styled(Remove)`
  padding: 0 10px;
  cursor: pointer;
  margin-left: auto;
`;

export const FilesContainer = styled.div`
  padding: 10px 0;
`;

export const FileContainer = styled.div`
  position: relative;
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
  padding: 8px;
  border-radius: 4px;
  :not(:first-child) {
    margin-top: 8px;
  }
  overflow: hidden;
`;

export const Content = styled.div`
  position: relative;
  align-items: center;
  display: grid;
  grid-template-areas: 'icon name size remove';
  grid-template-columns: minmax(min-content, 2em) auto max-content min-content;
  grid-template-rows: 2.5em;
  grid-gap: 0.5em;
  padding: 0.5em;
  align-items: center;
`;

export const FileSize = styled.div`
  ${({ theme }) => theme.typography.caption}
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const FileName = styled.div`
  ${({ theme }) => theme.typography.bodyBold}
  margin-left: 8px;
  margin-right: 4px;
`;

export const ViewAllFilesButton = styled(SecondaryButton)`
  ${({ theme }) => theme.typography.body}
  display: block;
  color: ${({ theme }) => theme.palette.primary.main};
  margin-top: 4px;
  padding: 12px 0;

  &:hover {
    background-color: transparent;
  }
`;

export const FileUploadContainer = styled.div``;

export const FileInput = styled.input.attrs({ type: 'file' })`
  &&& {
    display: none;
  }
`;

export const Label = styled.label``;

export const FileIcon = styled(FileAttachment).attrs({ width: 18, height: 18 })`
  cursor: pointer;

  ${({ disabled, theme }) =>
    disabled &&
    `
      color: ${theme.palette.base.shade3};
      cursor: default;
  `}
`;
