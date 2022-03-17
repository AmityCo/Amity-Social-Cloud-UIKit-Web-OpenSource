import styled, { css } from 'styled-components';
import { ArrowRight, Shield } from '~/icons';

export const PostHeaderContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const PostInfo = styled.div`
  margin-left: 8px;
`;

export const Name = styled.div`
  ${({ theme }) => theme.typography.title};

  word-break: break-all;

  &.clickable {
    &:hover {
      cursor: pointer;
    }
  }
`;

export const ArrowSeparator = styled(ArrowRight).attrs({
  height: '8px',
  width: '8px',
})`
  color: ${({ theme }) => theme.palette.base.shade1};
`;

export const ShieldIcon = styled(Shield)`
  margin-right: 4px;
`;

export const ModeratorBadge = styled.div`
  display: flex;
  align-items: center;
  margin-right: 4px;
  color: ${({ theme }) => theme.palette.base.shade1};
  ${({ theme }) => theme.typography.captionBold};
`;

export const MessageContainer = styled.div`
  color: ${({ theme }) => theme.palette.base.shade1};
  ${({ theme }) => theme.typography.caption}

  &::before {
    content: '• ';
    margin-left: 4px;
  }
`;

const ModeratorBadgeCSS = css`
  & > ${ModeratorBadge} {
    &::after {
      content: '•';
      margin-left: 4px;
    }
  }
`;

export const AdditionalInfo = styled.div`
  display: flex;
  align-items: center;

  ${({ showTime }) => showTime && ModeratorBadgeCSS};
`;

export const PostNamesContainer = styled.div`
  display: flex;
  align-items: center;

  > :not(:first-child) {
    margin-left: 0.25rem;
  }
`;
