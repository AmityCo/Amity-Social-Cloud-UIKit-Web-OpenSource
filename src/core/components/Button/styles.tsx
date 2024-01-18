import styled, { DefaultTheme, css } from 'styled-components';

const commonButtonStyles = ({ theme }: { theme: DefaultTheme }) => css<{ fullWidth?: boolean }>`
  display: inline-flex;
  align-items: center;
  border-radius: 4px;
  outline: none;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.3s;
  ${theme.typography.bodyBold}
  ${({ fullWidth }) => fullWidth && 'width: 100%;'}
  justify-content: center;
  &:disabled {
    cursor: default;
  }
  & > :not(:first-child) {
    margin-left: 0.5rem;
  }
`;

export const DefaultButton = styled.button<{ fullWidth?: boolean }>`
  ${commonButtonStyles};
  background-color: #fff;
  border: 1px solid #e3e4e8;
  color: ${({ theme }) => theme.palette.neutral.main};
  &:hover {
    color: ${({ theme }) => theme.palette.neutral.shade1};
  }
  &:disabled {
    color: ${({ theme }) => theme.palette.neutral.shade2};
  }
`;

export const PrimaryButton = styled.button<{ fullWidth?: boolean }>`
  ${commonButtonStyles};
  border: none;
  background-color: ${({ theme }) => theme.palette.primary.main};
  color: white;
  &:hover:not(:disabled) {
    opacity: 0.8;
  }
  &:disabled {
    background-color: ${({ theme }) => theme.palette.primary.shade2};
  }
`;

export const SecondaryButton = styled.button<{ active?: boolean; fullWidth?: boolean }>`
  ${commonButtonStyles};
  color: ${({ theme }) => theme.palette.neutral.shade1};
  background-color: transparent;
  border: none;
  &:hover {
    background-color: #f2f2f4;
  }
  &:disabled {
    color: ${({ theme }) => theme.palette.neutral.shade2};
  }
  ${({ active, theme }) => active && `color: ${theme.palette.primary.shade1};`}
`;
