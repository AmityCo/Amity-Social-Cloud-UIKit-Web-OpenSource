import styled from 'styled-components';

import { SecondaryButton } from '../commonComponents/Button';

export const PostContainer = styled.div`
  width: 560px;
  padding: 16px;
  background: #ffffff;
  border: 1px solid #edeef2;
  border-radius: 4px;
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 14px;
`;

export const PostContent = styled.div`
  overflow-wrap: break-word;
  color: #17181c;
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const PostInfo = styled.div`
  margin-left: 8px;
`;

export const AuthorName = styled.div`
  ${({ theme }) => theme.typography.title}
`;

export const PostDate = styled.div`
  color: #818698;
  ${({ theme }) => theme.typography.caption}
`;

export const ReadMoreButton = styled(SecondaryButton)`
  color: #1054de;
  padding: 4px;
`;
