import styled from 'styled-components';

export const Menu = styled.div``;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  &:hover {
    background: #f2f2f4;
  }
  ${({ active, theme }) => active && `color: ${theme.palette.primary.shade1};`}
`;

export const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ theme }) => theme.typography.bodyBold}
  color: ${({ theme }) => theme.palette.base.shade3};
  width: 100%;
  margin: 3px 0;
`;
