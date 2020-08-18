import styled from 'styled-components';

export const Tab = styled.span`
  display: inline-block;
  ${({ theme }) => theme.typography.bodyBold}
  cursor: pointer;
  text-align: center;
  padding: 12px;
  margin-right: 8px;
  ${({ active }) =>
    active
      ? `
border-bottom: 2px solid #1054DE;
color: #1054DE;
`
      : `
  color: #abaeba;
  &:hover {
    color: #818698;
  }
  &:disabled {
    color: #abaeba;
  }
`}

  transition: border-bottom 0.3s;
`;
