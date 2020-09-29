import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-regular-svg-icons';

import { SecondaryButton } from '~/core/components/Button';

export const RemoveIcon = styled(FaIcon).attrs({ icon: faTimes })`
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
  display: flex;
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
