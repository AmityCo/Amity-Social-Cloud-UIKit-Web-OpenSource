import styled from 'styled-components';

export const Tab = styled.span`
  display: inline-block;
  ${({ theme }) => theme.typography.bodyBold}
  cursor: pointer;
  text-align: center;
  padding: 12px;
  margin-right: 8px;
  ${({ theme, active }) =>
    active
      ? `
border-bottom: 2px solid ${theme.palette.primary.main};
color: ${theme.palette.primary.main};
`
      : `
  color: #abaeba;
  &:hover {
    color: ${theme.color.neutral1};
  }
  &:disabled {
    color: ${theme.color.neutral2};
  }
`}

  transition: border-color 0.3s;
`;
