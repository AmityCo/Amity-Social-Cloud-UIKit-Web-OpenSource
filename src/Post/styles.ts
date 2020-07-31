import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisH } from '@fortawesome/pro-regular-svg-icons';
import { SecondaryButton } from '../commonComponents/Button';

export const OptionsIcon = styled(FaIcon).attrs({ icon: faEllipsisH })`
  font-size: 16px;
  padding: 0 5px;
  cursor: pointer;
  margin-left: auto;
  color: #17181c;
`;

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
  color: #17181c;
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const ShowMore = styled.div`
  font-weight: bold;
  cursor: pointer;
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
  display: block;
  color: #1054de;
  padding: 4px;
`;
