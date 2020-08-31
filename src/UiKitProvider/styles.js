import styled from 'styled-components';

export const UIStyles = styled.div`
  ${({ theme }) => theme.typography.body}
  color: ${({ theme }) => theme.color.base};
  input,
  div {
    box-sizing: border-box;
  }
`;
