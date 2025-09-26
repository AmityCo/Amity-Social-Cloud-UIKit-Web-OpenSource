import styled, { css } from 'styled-components';

import Avatar from '~/core/components/Avatar';

export const UserHeaderContainer = styled.div<{ noSubtitle?: boolean }>`
  display: grid;
  grid-template-areas: 'avatar title' 'avatar subtitle';
  grid-template-columns: min-content auto;
  grid-template-rows: min-content min-content;
  grid-gap: 0 0.5em;
  padding: 1em;
  ${({ noSubtitle }) =>
    !noSubtitle &&
    css`
      grid-template-areas: 'avatar title';
      align-items: center;
    `}
`;

export const UserHeaderAvatar = styled(Avatar)`
  grid-area: avatar;
`;

export const UserHeaderTitle = styled.div`
  grid-area: title;
  ${({ theme }) => theme.typography.title}
  display: flex;
  min-width: 0;
  align-items: center;
  gap: 8px;

  > div {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
`;

export const UserHeaderSubtitle = styled.div`
  grid-area: subtitle;
  ${({ theme }) => theme.typography.body}
`;
