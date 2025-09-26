import React from 'react';
import styled, { css } from 'styled-components';

import Avatar from '~/core/components/Avatar';

export const CategoryHeaderContainer = styled.div<{ hasNoChildren?: boolean; clickable?: boolean }>`
  display: grid;
  grid-template-areas: 'avatar title' 'avatar subtitle';
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  grid-gap: 0 0.5em;
  padding: 0.5rem;
  ${({ hasNoChildren }) =>
    hasNoChildren &&
    css`
      grid-template-areas: 'avatar title';
      align-items: center;
    `}

  ${({ theme, clickable }) =>
    clickable &&
    css`
      border-radius: 4px;
      cursor: pointer;

      &:hover {
        background: ${theme.palette.base.shade4};
      }
    `}
`;

export const CategoryHeaderAvatar = styled(Avatar)`
  grid-area: avatar;
`;

export const CategoryHeaderTitle = styled.div`
  grid-area: title;
  ${({ theme }) => theme.typography.title};
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
`;

export const CategoryHeaderSubtitle = styled.div`
  grid-area: subtitle;
  ${({ theme }) => theme.typography.body}
`;
