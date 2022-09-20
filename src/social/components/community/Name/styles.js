import styled, { css } from 'styled-components';
import { Lock, Verified } from '~/icons';

export const PrivateIcon = styled(Lock).attrs({ width: 16, height: 16 })`
  margin-right: 8px;
`;

export const VerifiedIcon = styled(Verified).attrs({ width: 16, height: 16 })`
  margin-left: 8px;
  fill: ${({ theme }) => theme.palette.primary.main};
`;

// the padding-right is to avoid cutting too short when the name ends with an emoji (due to the flex + text-overflow combination)
export const Name = styled.div`
  display: inline-flex;
  align-items: center;
  & > * {
    display: inline-block !important;
  }
`;

export const NameContainer = styled.div`
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

  & > ${PrivateIcon},
  & > ${VerifiedIcon} {
    ${({ isTitle }) =>
      isTitle &&
      css`
        font-size: 18px;
      `}
  }
`;
