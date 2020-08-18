import styled from 'styled-components';

import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/pro-regular-svg-icons';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/pro-solid-svg-icons';

import { SecondaryButton } from '../commonComponents/Button';

import UIAvatar from '../Avatar';

export const Avatar = styled(UIAvatar)`
  margin-right: 8px;
`;

export const CommentContainer = styled.div`
  display: flex;
  color: black;
  background: #ffffff;
  border-top: 1px solid #e3e4e8;
  padding: 16px 0;
`;

export const Content = styled.div``;

export const CommentHeader = styled.div`
  display: flex;
  align-items: center;
`;

export const CommentContent = styled.div`
  overflow-wrap: break-word;
  color: #17181c;
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const CommentInfo = styled.div`
  margin-left: 8px;
`;

export const AuthorName = styled.div`
  ${({ theme }) => theme.typography.title}
`;

export const CommentDate = styled.div`
  margin-left: 5px;
  color: #818698;
  ${({ theme }) => theme.typography.caption}
`;

export const ReadMoreButton = styled(SecondaryButton)`
  color: #1054de;
  padding: 4px;
`;

export const InteractionBar = styled.div`
  display: flex;
  padding: 2px 0;
`;

export const LikeIcon = styled(FaIcon).attrs({ icon: faThumbsUp })`
  font-size: 16px;
  margin-right: 5px;
`;

export const SolidLikeIcon = styled(FaIcon).attrs({ icon: faThumbsUpSolid })`
  font-size: 16px;
  margin-right: 5px;
`;
