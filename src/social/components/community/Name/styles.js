import styled, { css } from 'styled-components';
import { Lock, Verified } from '~/icons';

export const PrivateIcon = styled(Lock).attrs({ width: 16, height: 16 })`
  margin-right: 8px;
`;

export const VerifiedIcon = styled(Verified).attrs({ width: 16, height: 16 })`
  margin-left: 8px;
  fill: #1253de;
`;

// the padding-right is to avoid cutting too short when the name ends with an emoji (due to the flex + text-overflow combination)
export const Name = styled.div`
  padding-right: 1ch;
  // color: ${({ theme }) => theme.palette.title.shade1};
`;

// the padding-right is to avoid cutting too short when the name ends with an emoji (due to the flex + text-overflow combination)
export const DescriptionForAll = styled.div`
  font-size: ${({ theme }) => theme.typography.caption};
  color: ${({ theme }) => theme.palette.neutral.shade2};
  font-weight: 200;
`;

export const NameContainer = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  color: ${({ theme }) => theme.palette.neutral.main};
  ${({ theme }) => theme.typography.title};
  ${({ theme, isActive, isTitle }) => css`
    ${theme.typography.bodyBold}
    ${isActive &&
    css`
      color: ${theme.palette.primary.main};
    `}
    ${isTitle &&
    css`
      color: ${theme.palette.title.main};
      margin: 22px;
      ${theme.typography.communityFeedTitle};
    `}
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
