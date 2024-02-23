import { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { Lock, Verified } from '~/icons';

export const PrivateIcon = styled(Lock).attrs<{ icon?: ReactNode }>({ width: 16, height: 16 })`
  margin-right: 8px;
`;

export const VerifiedIcon = styled(Verified).attrs<{ icon?: ReactNode }>({
  width: 16,
  height: 16,
})`
  margin-left: 8px;
  fill: #1253de;
`;

// the padding-right is to avoid cutting too short when the name ends with an emoji (due to the flex + text-overflow combination)
export const Name = styled.div`
  padding-right: 1ch;
`;

export const NameContainer = styled.div<{
  isActive?: boolean;
  isTitle?: boolean;
}>`
  display: flex;
  align-items: center;
  overflow: hidden;
  ${({ theme, isActive, isTitle }) => css`
    ${theme.typography.bodyBold}
    ${isActive &&
    css`
      color: ${theme.palette.primary.main};
    `}
    ${isTitle && theme.typography.title}
  `}
`;
