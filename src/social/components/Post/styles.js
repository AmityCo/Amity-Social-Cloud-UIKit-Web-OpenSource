import styled from 'styled-components';
import { FontAwesomeIcon as FaIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/pro-solid-svg-icons';

import UIOptions from '~/core/components/Options';
import { SecondaryButton } from '~/core/components/Button';
import { ArrowRight } from '~/icons';

export const Options = styled(UIOptions)`
  margin-left: auto;
`;

export const PostContainer = styled.div`
  padding: 16px;
  padding-bottom: 8px;
  background: #ffffff;
  border: 1px solid #edeef2;
  border-radius: 4px;
`;

export const PostHeader = styled.div`
  display: flex;
  align-items: center;
  padding-bottom: 14px;
`;

export const PostAuthor = styled.div`
  display: flex;
  cursor: pointer;
`;

export const PostContent = styled.div`
  overflow-wrap: break-word;
  color: ${({ theme }) => theme.palette.neutral.main};
  white-space: pre-wrap;
  ${({ theme }) => theme.typography.body}
`;

export const PostInfo = styled.div`
  margin-left: 8px;
`;

export const AuthorName = styled.div`
  ${({ theme }) => theme.typography.title}
`;

export const ArrowSeparatorContainer = styled.div`
  margin: 0 4px !important;
`;

export const ArrowSeparator = styled(ArrowRight).attrs({ height: '8px', width: '8px' })`
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const PostCommunityName = styled.div`
  ${({ theme }) => theme.typography.title}
`;

export const ReadMoreButton = styled(SecondaryButton)`
  color: ${({ theme }) => theme.palette.primary.main};
  padding: 4px;
`;

export const ShieldIcon = styled(FaIcon).attrs({ icon: faShieldAlt })`
  margin-right: 4px;
`;

export const ModeratorBadgeContainer = styled.div`
  display: flex;
  align-items: center;
  .time {
    &::before {
      content: '• ';
    }
  }
`;

export const ModeratorBadge = styled.div`
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.palette.base.shade1};
  margin-right: 4px;
  ${({ theme }) => theme.typography.captionBold}
`;

export const AdditionalInfo = styled.div`
  display: flex;
  align-items: center;
`;

export const PostTitleContainer = styled.div`
  display: flex;
  align-items: center;
`;
