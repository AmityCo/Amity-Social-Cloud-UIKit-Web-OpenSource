import styled from 'styled-components';

export const TabsContainer = styled.nav`
  background: #ffffff;
  border-radius: 4px 4px 0 0;
  border: 1px solid #edeef2;
`;

export const TabsList = styled.ul`
  margin: 0;
  padding: 0 16px;
  list-style-type: none;
`;

export const TabItem = styled.li`
  display: inline-block;
`;

export const TabButton = styled.button`
  padding: 0.75em;
  margin-right: 0.5em;
  background-color: #ffffff;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  outline: none;
  color: #abaeba;
  ${({ theme }) => theme.typography.bodyBold}
  text-align: center;

  &:hover {
    color: #818698;
  }

  &.active {
    ${({ theme }) => `
      border-bottom: 2px solid ${theme.palette.primary.main};
      color: ${theme.palette.primary.main};
    `}
  }

  &:disabled {
    color: #abaeba;
  }

  transition: border-color 0.3s;
`;
