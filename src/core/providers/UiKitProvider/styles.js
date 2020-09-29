import styled from 'styled-components';

export const UIStyles = styled.div`
  ${({ theme }) => theme.typography.body}
  color: ${({ theme }) => theme.palette.base.main};
  input,
  div {
    box-sizing: border-box;
  }
`;
