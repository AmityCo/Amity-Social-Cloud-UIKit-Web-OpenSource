import styled from 'styled-components';

export const Menu = styled.div`
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.palette.base.shade4};
`;

export const MenuItem = styled.div<{ hover?: boolean; active?: boolean }>`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;

  ${({ hover, theme }) => hover && `background: ${theme.palette.base.shade4};`}
  ${({ active, theme }) => active && `color: ${theme.palette.primary.shade1};`}

  &:hover {
    ${({ theme }) => `background: ${theme.palette.base.shade4};`}
  }
`;
