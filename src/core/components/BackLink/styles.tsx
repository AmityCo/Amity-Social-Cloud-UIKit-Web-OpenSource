import styled from 'styled-components';

export const ButtonLink = styled.button.attrs({ role: 'button' })`
  color: ${({ theme }) => theme.palette.base.shade1};
  font-size: 14px;
  border: none;
  outline: none;
  background: none;
  padding: 4px 0 4px 0px;

  &:hover {
    cursor: pointer;
    color: ${({ theme }) => theme.palette.neutral.shade1};
  }
`;
