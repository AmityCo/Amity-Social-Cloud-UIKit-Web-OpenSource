import styled from 'styled-components';
import { PrimaryButton } from '~/core/components/Button';

export const PostEditorContainer = styled.div`
  padding: 0;
  border: none;
  display: flex;
  flex-direction: column;
  background: ${({ theme }) => theme.palette.system.background};
  border-radius: 4px;
`;

export const ContentContainer = styled.div`
  padding-bottom: 0.5rem;
`;

export const Footer = styled.div`
  border-top: 1px solid ${({ theme }) => theme.palette.base.shade4};
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  display: flex;
`;

export const PostButton = styled(PrimaryButton)`
  padding: 10px 16px;
  margin-left: auto;
  flex: 1;
`;
