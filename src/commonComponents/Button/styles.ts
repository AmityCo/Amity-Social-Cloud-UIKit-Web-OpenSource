import styled from 'styled-components';

const commonButtonStyles = ({ theme }) => `
text-align: center;
border-radius: 4px;
outline: none;
padding: 10px 12px;
cursor: pointer;
transition: background-color 0.3s;
${theme.typography.bodyBold}
`;

export const DefaultButton = styled.button`
  ${commonButtonStyles}
  background-color: transparent;
  border: 1px solid #e3e4e8;
  color: #17181c;
  &:hover {
    color: #818698;
  }
  &:disabled {
    color: #abaeba;
  }
`;

export const PrimaryButton = styled.button`
  ${commonButtonStyles}
  border: none;
  background-color: #1054de;
  color: white;
  &:hover {
    background-color: #4a82f2;
  }
  &:disabled {
    background-color: #a0bdf8;
  }
`;

export const SecondaryButton = styled.button`
  ${commonButtonStyles}
  color: #818698;
  background-color: transparent;
  border: none;
  &:hover {
    background-color: #f2f2f4;
  }
  &:disabled {
    color: #abaeba;
  }
  ${({ active, theme }) => active && `color: ${theme.color.primary1};`}
`;
