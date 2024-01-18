import React from 'react';
import styled, { css } from 'styled-components';

import Avatar from '~/core/components/Avatar';

interface CommunityHeaderContainerProps {
  loading?: boolean;
  isActive?: boolean;
}

export const CommunityHeaderContainer = styled.a.attrs(
  (props) => props,
)<CommunityHeaderContainerProps>`
  display: grid;
  grid-template-areas: 'avatar title' 'avatar children';
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  grid-gap: 0 0.75em;
  padding: 0.5em;
  border-radius: 4px;
  align-items: center;
  color: ${({ theme }) => theme.palette.base.main};

  ${({ loading }) =>
    !loading &&
    css`
      &:hover {
        cursor: pointer;
        background-color: ${({ theme }) => theme.palette.base.shade4};
      }
    `}

  ${({ isActive, theme }) =>
    isActive &&
    css`
      color: ${theme.palette.primary.main};
      background-color: ${theme.palette.primary.shade3};
    `};

  ${({ children }) =>
    !!children &&
    css`
      grid-template-areas: 'avatar title';
      align-items: center;
    `}
`;

export const CommunityHeaderAvatar = styled(Avatar)`
  grid-area: avatar;
`;

export const Rest = styled.div`
  grid-area: children;
`;
